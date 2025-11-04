import { TOAST_REF } from "./ToastRef";

export const notifyInfo = (message) =>{
    if(TOAST_REF.current){ //si la noti esta abierta
        TOAST_REF.current.show({
            severity: 'info',
            summary: 'informacion',
            detail: message,
            life: 4000 
        })
    } else {
        console.error('Toast no esta inicializado')
    }
}

export const notifySuccess = (message) =>{
    if(TOAST_REF.current){ //si la noti esta abierta
        TOAST_REF.current.show({
            severity: 'success', //severidad
            summary: 'exito', //titulo
            detail: message, //mensaje q devuelve la api
            life: 4000 //tiempo del msj
        })
    } else {
        console.error('Toast no esta inicializado')
    }
}

export const notifyError = (message) =>{
    if(TOAST_REF.current){ //si la noti esta abierta
        TOAST_REF.current.show({
            severity: 'error', //severidad
            summary: 'Error', //titulo
            detail: message, //mensaje q devuelve la api
            life: 4000 //tiempo del msj
        })
    } else {
        console.error('Toast no esta inicializado')
    }
}