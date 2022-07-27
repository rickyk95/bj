const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    post:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date
    },
    image:{
            type: Buffer,
            contentType:String
    },
    metaDescription:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})

const postModel = model('post',postSchema)
module.exports=postModel