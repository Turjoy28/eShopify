import { Route,Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import Navbar from "./components/Navbar.jsx"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "./stores/useUserStore.js"
import { useCartStore } from "./stores/useCartStore.js"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import AdminPage from "./pages/AdminPage.jsx"
import CategoryPage from "./pages/CategoryPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import CheckoutPage from "./pages/CheckoutPage.jsx"
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx"
import PaymentFailedPage from "./pages/PaymentFailedPage.jsx"
import PaymentCancelledPage from "./pages/PaymentCancelledPage.jsx"


function App() {
  const {user,checkAuth,checkingAuth}=useUserStore();
  const {getCartItems}=useCartStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  useEffect(()=>{
    if(user) getCartItems();
  },[user, getCartItems])
  if(checkingAuth) return <LoadingSpinner/>

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
  
     <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
     </div>
      
    <div className="relative z-50 pt-8">
    <Navbar/>
      <Routes>
        <Route path='/' element ={<HomePage/>}/>
        <Route path='/signup' element ={user?<HomePage/>:<SignupPage/>}/>
        <Route path='/login' element ={user?<HomePage/>:<LoginPage/>}/>
        <Route path='/secret-dashboard' element ={user?.role==="admin"?<AdminPage/>:<HomePage/>}/>
        <Route path='/category/:category' element={<CategoryPage/>}/>
        <Route path='/cart' element={user?<CartPage/>:<LoginPage/>}/>
        <Route path='/checkout' element={user?<CheckoutPage/>:<LoginPage/>}/>
        <Route path='/payment/success' element={<PaymentSuccessPage/>}/>
        <Route path='/payment/failed' element={<PaymentFailedPage/>}/>
        <Route path='/payment/cancelled' element={<PaymentCancelledPage/>}/>
      </Routes>

    </div>
      <Toaster/>
    </div>
    </>
  )
}

export default App
