const exp=require("express");
const userApp=exp.Router();
const bcryptjs= require("bcryptjs");
const User= require("../models/UserModel");
const jwt= require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const BlogModel = require("../models/BlogModel");
userApp.post("/user",async(req,res)=>{
    const user= req.body;
    const re=await User.find({gmail:user.gmail});
    if(re.length===0){
        let hashedPassword= await bcryptjs.hash(user.password,6);
        user.password=hashedPassword;
    const userdoc=new User(user);
    await userdoc.save();
    res.status(200).send({message:"user created successfully",payload:user});
    }
    else{
        res.status(200).send({message:"user already exists"})
    }
})
//login
userApp.post("/login",async(req,res)=>{
    console.log(req.body)
    const user= req.body;
    const usercred=await User.find({gmail:user.gmail});
    if(usercred.length===0){
        res.status(200).send({message:"Invalid username"});
    }else{
        let bool=await bcryptjs.compare(user.password,usercred[0].password);

        
    if(bool==false){
        res.status(200).send({message:"Invalid password"});
    }
    else{
        let signedToken=jwt.sign({name:user.name},'anoosh',{expiresIn:"15h"});
        res.status(200).send({message:"login success",token:signedToken,user:usercred[0],role:usercred[0].role});
    }

    }
    
})

//get all users
userApp.get("/users",async(req,res)=>{
    const users=await User.find({});
    res.send({users});
})

//update user

userApp.put("/userupdate", verifyToken  ,async(req,res)=>{
    const user=req.body;
    const updateData = {
        name: user.name,
        photo: user.photo
    };
    
    if(user.password){
        let hashedPassword = await bcryptjs.hash(user.password, 6);
        updateData.password = hashedPassword;
    }
    
    const usercred = await User.findOneAndUpdate(
        {gmail: user.gmail},
        {$set: updateData},
        {new: true}
    );
    
    if(usercred){
        res.status(200).send({message:"User updated successfully", payload: usercred});
    } else {
        res.status(400).send({message:"User not found"});
    }
})

//add comments
userApp.put("/usercomments/:id",verifyToken,async(req,res)=>{
    const id=req.params.id;
    const blogs= await BlogModel.find({_id:id});
     const ans= blogs[0].comments;
    ans.push(req.body);
    const dbresponse=await BlogModel.findOneAndUpdate({_id:id},{$set:{comments:ans}},{new:true})
    if(dbresponse===null){
        res.status(200).send({message:"Invaild no blog found"});
    }
    else{
        res.status(200).send({message:"comment added successfully."});
    }
})


//get total blogs which are not deleted
userApp.get("/totalblogs",verifyToken,async(req,res)=>{
    const data= await BlogModel.find({isDelete:false});
    if(data===null){
        res.status(200).send({message:"no posts existed"})
    }
    else{
        res.status(200).send({message:"posts",payload:data});
    }
})

//update likes (toggle like/unlike)
userApp.put("/updatelike/:id", verifyToken, async(req,res)=>{
    const id = req.params.id;
    const {userId} = req.body;
    
    try {
        const blog = await BlogModel.findById(id);
        
        if(!blog){
            return res.status(404).send({message:"Blog not found"});
        }
        
        const hasLiked = blog.likedBy?.includes(userId) || false;
        
        if(hasLiked){
            // Unlike the blog - ensure count doesn't go below 0
            const newCount = Math.max(0, blog.likesCount - 1);
            const updatedBlog = await BlogModel.findOneAndUpdate(
                {_id: id},
                {
                    $pull: {likedBy: userId},
                    $set: {likesCount: newCount}
                },
                {new: true}
            );
            res.status(200).send({
                message:"unliked successfully", 
                isLiked: false,
                likesCount: updatedBlog.likesCount,
                likedBy: updatedBlog.likedBy
            });
        } else {
            // Like the blog
            const updatedBlog = await BlogModel.findOneAndUpdate(
                {_id: id},
                {
                    $addToSet: {likedBy: userId},
                    $inc: {likesCount: 1}
                },
                {new: true}
            );
            res.status(200).send({
                message:"liked successfully", 
                isLiked: true,
                likesCount: updatedBlog.likesCount,
                likedBy: updatedBlog.likedBy
            });
        }
    } catch(err) {
        res.status(500).send({message:"Error updating like", error: err.message});
    }
})
//addto wishlist
userApp.post("/addtowishlist/:id",async(req,res)=>{
 const id= req.params.id;
 const user=req.body;
 const response=await User.findOneAndUpdate({_id:user.id},{$addToSet:{addToWhishList:id}},{new:true});
 if(response===null){
    res.status(200).send({message:"unable to add to wishlist"});
 }
 else{
    res.status(200).send({message:"blog added successfully"});
 }

})

//remove from wishlist
userApp.put("/removefromwishlist/:id",async(req,res)=>{
 const id= req.params.id;
 const user=req.body;
 const response=await User.findOneAndUpdate({_id:user.id},{$pull:{addToWhishList:id}},{new:true});
 if(response===null){
    res.status(200).send({message:"unable to add to wishlist"});
 }
 else{
    res.status(200).send({message:"blog removed successfully"});
 }
 
})


//get addtowishlist blogs
userApp.get("/getaddtowishlist/:id",verifyToken,async(req,res)=>{
    const id= req.params.id;
    const user=await User.findOne({_id:id});
    const data= await BlogModel.find({_id:{$in:user.addToWhishList}, isDelete:false});
    if(data===null){
        res.status(200).send({message:"Invalid "})
    }
    else{
        res.status(200).send({message:"wishlist blogs",payload:data});
    }
})



module.exports=userApp;