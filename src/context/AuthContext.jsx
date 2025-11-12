import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authService from '../services/authService'
import { notifyError, notifyInfo } from "../utils/Notifier";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    const navigate = useNavigate()
    const [justLoggedIn, setJustLoggedIn] = useState(false)

    const decodeUser = (token)=>{
        try {
            const decoded = jwtDecode(token)
            if(!decoded.exp || decoded.exp * 1000 < Date.now()){
                return null;
            }  
            
            return{
                id: decoded.user.id,
                nombre:decoded.user.nombre,
                correo: decoded.user.correo,
                rol: decoded.user.rol
            }
        } catch {
            return null
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token)return

        const userLogued = decodeUser(token)
        if(userLogued){
        setUser(userLogued)
        }else{
            localStorage.removeItem('token')
            setUser(null)
        }
    },[])
    

    const login = async (credentials)=>{
        try {
            const {data, status} = await authService.login(credentials)
            if(status===200){
                const token = data?.token
                localStorage.setItem('token', token)

                const userLogued = decodeUser(token)
                if(!userLogued){
                    localStorage.removeItem('token')
                    throw new Error("Token inválido o expirado")  
                }
                setUser(userLogued)
                navigate('/')
            } else{
                notifyError(data?.message)
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    
    const register = async (userData) => {
        try {
          const response = await authService.register(userData);
      
          const nuevoUsuario = response.data; //el usuario viene directo
      
          if (!nuevoUsuario || !nuevoUsuario.id) {
            console.error("No se recibió el ID del usuario nuevo:", nuevoUsuario);
            return;
          }
      
          alert("Usuario creado exitosamente");
      
          //para que redirija a crear un cliente o empleado
          if (nuevoUsuario.rol === "cliente") {
            navigate(`/crear-cliente/${nuevoUsuario.id}`);
          } else if (nuevoUsuario.rol === "admin" || nuevoUsuario.rol === "moderador") {
            navigate(`/crear-empleado/${nuevoUsuario.id}`);
          }
      
          return nuevoUsuario;
        } catch (error) {
          console.error("Error en registro:", error);
          throw error;
        }
      };
      
      

    const logout = () =>{
        setUser(null)
        localStorage.removeItem('token')
        navigate('/inicio-sesion')
    }

    const forgotPassword = async (correo) =>{
        try {
            const {data} = await authService.forgot(correo)            
            notifyInfo(data?.message)
            return true
        } catch (error) {
            console.error(error.response.data || error)
            return false
        }
    }

    const ResetPassword = async ({id, token, contrasena}) =>{
        try {

            const bodyResetPassword={
                id: Number(id),
                token,
                contrasena
            }
            const response = await authService.reset(bodyResetPassword);
            console.log("Reset backend response:", response.data);

            alert('contraseña actualizada con exito')
            return true
        } catch (error) {
            console.error("hubo un error al actualizar la contraseña", error)
            return false
        }
    }

    return(
        <AuthContext.Provider value={{user, setUser, register, login, logout, justLoggedIn, setJustLoggedIn, forgotPassword, ResetPassword}}>
            {children}
        </AuthContext.Provider>
    )
}