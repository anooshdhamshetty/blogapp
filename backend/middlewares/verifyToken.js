const jwt=require("jsonwebtoken");
const verifyToken=(req,res,next)=>{
    let bearerToken=req.headers.authorization;
    if(!bearerToken){
        res.status(200).send({message:"Unauthorised access"});
    }
    else{
        let token=bearerToken.split(" ")[1];
        try{
            let decodedToken=jwt.verify(token,'anoosh');
            next();
        }
        catch(err){
            res.status(200).send({message:"please relogin to recontinue"});
        }
    }
}
module.exports=verifyToken;