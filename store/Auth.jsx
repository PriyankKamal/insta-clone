import React, { createContext, useState } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext()

const Auth = ({children}) => {
    const [token,setToken] = useState(localStorage.getItem("token"))
    // console.log("token is",token); 
    // const navigate = useNavigate()

    const setTokenInLS=(servertoken)=>{ 
        setToken(servertoken) 
 
        return localStorage.setItem("token",servertoken)
    }

    const logOutUser=()=>{
        setToken("")
        if(token ===""){
            toast.success("logout successful")
            return localStorage.removeItem("token")
        }
        
    }
    const isLoggedIn = !!token
    
    return (
        <>
            <AuthContext.Provider value={{setTokenInLS , logOutUser, isLoggedIn,token}}>
            {/* <h1>i am context!</h1> */}
            {children}

            </AuthContext.Provider>
        </>
    )
}

export default Auth
export { AuthContext }