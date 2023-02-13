const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
const ObjectSchema = new Schema({
    symbol: { type: String, required: false },
    price: { type: Number, required: false },
    shares: { type: String, required: false }
  });

const PortfolioSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    stocks:[ObjectSchema],
  
    userID:{
        type: String,
        required: true
    },
},
{
    timestamps: true,
});

PortfolioSchema.pre('save', async (next)=>{ 
        return next();
})

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);
module.exports = Portfolio
