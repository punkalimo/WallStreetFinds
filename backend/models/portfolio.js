const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const PortfolioSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    stock:{
        type: String,
        required: false
    },
    shares:{
        type: Number,
        required: false
    },
    averagePrice:{
        type: SchemaTypes.Decimal128,
        required: false
    },
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
