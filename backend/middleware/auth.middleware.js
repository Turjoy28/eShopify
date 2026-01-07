const protectRoute=(req,res,next)=>{
   try{
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message:"Unauthorized - No access token provided"})
    }
    const decode=jwt.verify(accessToken,process.env.process.env.ACCESS_TOKEN_SECRET);
   }catch(error){

   }
}