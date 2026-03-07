const exp=require("express");
const writerApp=exp.Router();
const bcryptjs= require("bcryptjs");
const User= require("../models/UserModel");
const jwt= require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const BlogModel = require("../models/BlogModel");


//posting blog
writerApp.post("/postblog",verifyToken,async(req,res)=>{
    if(req.body.role==="writer"){
        const blogdata=req.body;
        delete blogdata.role;
        const now = new Date();
        const dateTimeString = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
});
blogdata.createdAt=dateTimeString;
blogdata.updatedAt=dateTimeString;
        const blogDoc= new BlogModel(blogdata);
        await blogDoc.save();
        res.status(200).send({message:"Post added succesfully",payload:blogDoc});

    }
    else{
        res.status(200).send({message:"Invalid access."}); 
    }
})



//blog update.
writerApp.put("/updateblog/:id",verifyToken,async(req,res)=>{
    const id= req.params.id;
    const blogData=req.body;
    const now = new Date();
    const updatedTime = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
});
const response= await BlogModel.findOneAndUpdate({_id:id},{$set:{title:blogData.title,description:blogData.description,updatedAt:updatedTime}},{new:true});
    if(response===null){
        res.status(200).send({message:"blog doesn't exist"});
    }
    else{
        
        res.status(200).send({message:"blog updated successfully"});
    }
})


//get writer blogs created by him

writerApp.get("/writerblogs/:id",verifyToken,async(req,res)=>{
    const id= req.params.id;
    const data=await BlogModel.find({authorId:id});
    if(data.length===0){
        res.status(200).send({message:"No blogs created yet"})
    }
    else{
        res.status(200).send({message:" writer blogs",payload:data});
    }
})

writerApp.put("/hideblog/:id",verifyToken,async(req,res)=>{
    const id= req.params.id;
    const blogData=req.body;
    console.log(blogData);
    
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const response= await BlogModel.findOneAndUpdate(
        {_id:id},
        {
            $set:{
                isDelete: blogData.isDelete,
                updatedAt: dateTimeString
            }
        },
        {new:true}
    );
    
    if(response===null){
        res.status(200).send({message:"blog doesn't exist"});
    }
    else{
        if(blogData.isDelete===true){
            res.status(200).send({message:"blog deleted successfully"});
        }
        else{
            res.status(200).send({message:"blog republished successfully"});
        }
    }
})

module.exports=writerApp;