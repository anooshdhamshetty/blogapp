const mongoose= require("mongoose");
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
photo:{
    type:String
}
,
gmail:{
    type:String,
    required:true,
    unique:true
},
role:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
addToWhishList:{
type:[String]
}
});
const User=mongoose.model("users",userSchema);
module.exports=User;