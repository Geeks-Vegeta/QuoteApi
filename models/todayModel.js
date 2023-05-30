const mongoose = require('mongoose');

const todayQuoteSchema = mongoose.Schema({
    quote:{
        type:String,
    },
    author:{
        type:String,
    },
    likes:{
        type:String,
    },
    image:{
        type:String,
    },
    today:{
        type:Boolean,
        default:true
    }
})

const todayQuoteModel = mongoose.model("today", todayQuoteSchema);

module.exports=todayQuoteModel;