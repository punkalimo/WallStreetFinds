const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const maxAge = 3 * 24 * 60 * 60;

const generateToken = (id)=>{
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
		algorithm: "HS256",
		expiresIn: maxAge,
	});
    console.log(token)
    return token;
};

const checkToken =(req, res, next)=>{
    const header = req.header['Authorization'];

    if(typeof header !== 'undefined'){
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        res.status(403);
    }
}


const registerUser = asyncHandler( async(req, res)=>{
    const { firstname, lastname, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).send("User with that email already exists. Please login!");
        throw new Error('User Already Exists');
    }
    const user = await User.create({
        firstname,
        lastname,
        email,
        password
    });
    if(user){
        const token = generateToken(user._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
        });
    }
});

const authUser = asyncHandler( async (req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne( {email});
    if(!user){
        res.status(400).send("Invalid email address or password");
        throw new Error('Invalid Email Entered');
    }
    if(user &&( await user.matchPassword(password))){
        const userID = user._id;
        const jwtExpirySeconds = 300 * 3600000;
        const token = jwt.sign({ userID } , process.env.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
	    });
        res.cookie("token", token, { 
            maxAge: jwtExpirySeconds,
            sameSite: 'none',
            secure: true
        });
        const user_logged = {
            firstname: user.firstname,
            lastname:user.lastname,
            email:user.email,
            subscription:user.isSubscribed
        }
        res.send({token,user_logged });
    }
});
const verifyToken = async(client_id, jwtToken) => {
    const client = new OAuth2Client(client_id);
    // Call the verifyIdToken to verify and decode it
    const ticket = await client.verifyIdToken({
        idToken: jwtToken,
        audience: client_id,
    });
    // Get the JSON with all the user info
    const payload = ticket.getPayload();

    // This is a JSON object that contains all the user info
   return payload;
}
const googleAuth = async(req, res) => {
   const userObj = verifyToken(process.env.MY_GOOGLE_CLIENT_ID, req.body.jwtToken);
   userObj.then( async(userObject) => {
    const foundUser = await User.findOne( {email: userObject.email});
    if (!foundUser) {
        const user = await User.create({
            firstname: userObject.given_name,
            lastname: userObject.family_name,
            email: userObject.email,
        });
        if (user) {
            const userID = user._id;
            const jwtExpirySeconds = 300 * 3600000;
            const token = jwt.sign({ userID } , process.env.SECRET_KEY, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            });
            res.cookie("token", token, { 
                maxAge: jwtExpirySeconds,
                sameSite: 'none',
                secure: true
            });
            const user_logged = {
                firstname: user.firstname,
                lastname:user.lastname,
                email:user.email,
                subscription:user.isSubscribed
            }
            res.send({token,user_logged });
        }
    } else {
        const userID = foundUser._id;
        const jwtExpirySeconds = 300 * 3600000;
        const token = jwt.sign({ userID } , process.env.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
	    });
        res.cookie("token", token, { 
            maxAge: jwtExpirySeconds,
            sameSite: 'none',
            secure: true
        });
        const user_logged = {
            firstname: foundUser.firstname,
            lastname:foundUser.lastname,
            email:foundUser.email,
            subscription:foundUser.isSubscribed
        }
        res.send({token,user_logged });
    }
   }).catch((error) => res.status(500).json({message: error.message}))
};

const profile = (req, res)=>{
    console.log(req.cookies.token)
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                res.redirect('/login')
            }
           const user = await User.findById(decoded.userID);
            if(user){
                res.status(200).json({
                    firstname: user.firstname,
                    lastnme: user.lastname,
                    email: user.email
                })
            }
        })
    }else{
        res.sendStatus(403);
    }
}


const recover = async (req, res)=>{
    const email = req.body.email;
    User.findOne({email})
        .then(user=>{
            if(!user) return res.status(401).json({message: 'this email is not registered'});
            user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordExpires = Date.now() + 3600000;
            user.save();
            console.log(user.resetPasswordToken)
            res.send("http://" + req.headers.host + "/reset/" + user.resetPasswordToken);
        })
        .catch(err => res.status(500).json({message: err.message}));
}
const reset = (req, res)=>{
    const token = req.params.token;
    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()}
    })
    .then((user)=>{
        if(!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        res.send(user)
    })
    .catch(error => res.status(500).json({message: error.message})); 
};

const logout = async (req, res)=>{
    res.cookie('token', '', {maxAge: 0});
    res.end();
}

const resetPassword = (req, res) =>{
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    })
    .then((user)=>{
        if(!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        user.password = req.body.password;
        user.resetPasswordToken= undefined;
        user.resetPasswordExpires= undefined;
        user.save((error)=>{
            if(error){ return res.status(500).json({message: error.message});}
            else{ return res.status(201).json({message: 'success password has been reset'})}
        })
    })
};

module.exports= {registerUser, authUser, googleAuth, recover, reset, resetPassword, profile, checkToken, logout};