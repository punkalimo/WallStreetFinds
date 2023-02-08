const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
            type: String,
            required: true,
            unique: true,
    },
    password:{
        type:String,
    },
    isSubscribed:{
        type : Boolean,
        required: true,
        default: false,
    },
    resetPasswordToken:{
        type: String,
        required: false
    },
    resetPasswordExpires:{
        type: Date,
        required:false,
    }
},
{
    timestamps: true,
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.generateJWT = ()=>{
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        firstname: this.email,
        lastname: this.lastname,
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = async ()=>{
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;