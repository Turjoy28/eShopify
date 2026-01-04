const signup = async(req,res)=>{
    res.send("Signup route called")
}

const login =async(req,res)=>{
    res.send("login route called")
}

const logout = async(req,res)=>{
    res.send("logout route called")
}

export default {
    signup,
    login,
    logout
}