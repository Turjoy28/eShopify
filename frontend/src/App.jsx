import { Route,Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import Navbar from "./components/Navbar.jsx"

function App() {

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
        <Route path='/signup' element ={<SignupPage/>}/>
        <Route path='/login' element ={<LoginPage/>}/>
      </Routes>

    </div>
      
    </div>
    </>
  )
}

export default App
