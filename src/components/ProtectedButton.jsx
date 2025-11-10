import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "primereact/button";

export const ProtectedButton = ({allowedRoles, ...props})=>{
    const {user} = useContext(AuthContext)

    if (!user || !allowedRoles?.includes(user.rol)){
        return null
    }

    return <Button {...props}/>
}