const mongoose = require('mongoose');

const scrapQuoteSchema = mongoose.Schema({
    quote:{
        type:String,
    },
    author:{
        type:String,
    },
    like:{
        type:String,
    },
    image:{
        type:String,
    },
})

const scrapQuoteModel = mongoose.model("scrapquote", scrapQuoteSchema);

module.exports=scrapQuoteModel;