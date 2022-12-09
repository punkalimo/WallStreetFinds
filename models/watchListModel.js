const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WatchListSchema = new Schema({
    watchlist:{
        type: [String],
    },
    userID:{
        type: String,
        required: true
    },
},
{
    timestamps: true,
});

WatchListSchema.pre('save', async (next)=>{ 
        return next();
})

const Watchlist = mongoose.model('Watch List', WatchListSchema);
module.exports = Watchlist

