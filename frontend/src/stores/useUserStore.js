import {create} from "zustand"
import axios from "../lib/axios"
import {toast} from "react-hot-toast"

export const useUserStore=create((set)=>({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async({name, email, password, confirmPassword})=>{
       set({loading:true});

       if(password!==confirmPassword){
        set({loading:false})
        return toast.error("Password do not match")
       }
       try{
        const res=await axios.post("/auth/signup",{name,email,password})
        console.log("Signup successful:", res.data.user)
        set({user:res.data.user,loading:false})
        toast.success("Account created successfully!")
       }catch(error){
        set({loading:false});
        toast.error(error.response?.data?.message || "An error occurred")
       }
    },

    login: async(email, password)=>{
       set({loading:true});
       try{
        const res=await axios.post("/auth/login",{email,password})
        console.log("Login successful:", res.data.user)
        set({user:res.data.user,loading:false})
        toast.success("Logged in successfully!")
       }catch(error){
        set({loading:false});
        console.error("Login failed:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "An error occurred")
       }
    },

    checkAuth: async() => {
      set({checkingAuth:true});

    try{
      const response=await axios.get("/auth/profile")
      set({user: response.data,checkingAuth:false})
    }catch(error){
      set({checkingAuth:false,user:null});
    }

   },

   Logout: async ()=>{
    try{
      await axios.post("/auth/logout");
      set({user:null});
    }catch(error){
      toast.error(error.response?.data?.message||"An error occurred during logout");
    }
   },



}))

