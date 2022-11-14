const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

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
})

module.exports= {registerUser, authUser};