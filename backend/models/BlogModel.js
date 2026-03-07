const mongoose= require("mongoose");
const commentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
    
},{strict:true});
const blogModel= new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    authorId:{
        type:String,
        required:true
    },
    comments:{
        type:[commentSchema],
        default:[]
    },
    likesCount:{
        type:Number,
        required:true,
        default:0
    },
    likedBy:{
        type:[String],
        default:[]
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:String,
        required:true
    },
    updatedAt:{
        type:String,
        required:true
    }

});
const BlogModel=mongoose.model("blog",blogModel);
module.exports=BlogModel;