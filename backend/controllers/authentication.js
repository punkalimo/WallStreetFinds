const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto')

const maxAge = 3 * 24 * 60 * 60;

const generateToken = (id)=>{
    return jwt.sign( {id}, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    } );
};

const registerUser = asyncHandler( async(req, res)=>{
    const { firstname, lastname, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
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
        res.status(400);
        throw new Error('Invalid Email Entered');
    }
    if(user &&( await user.matchPassword(password))){
        const token = generateToken(user._id);
        res.cookie('jwt', token,{
            httpOnly: true,
            maxAge: maxAge * 1000,
        });
        res.status(200).json({
            firstname: user.firstname,
            id: user._id
        })
    }
});

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

module.exports= {registerUser, authUser, recover, reset, resetPassword};