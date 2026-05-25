import { createContext, useEffect, useState } from "react";
import  toast  from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [doctors, setDoctors] = useState([])
    const [userData, setUserData] = useState(false)


    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    
    const getDoctors = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            }
        } catch (error) {
            toast.error(error.message) 
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/profile', {headers:{token}})
            if (data.success) {
                setUserData(data.userData)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    const value = {
        doctors, getDoctors,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        getUserData
    }

    useEffect(()=>{
        getDoctors()
    }, [])

    useEffect(()=>{
        if (token) {
            getUserData()
        } else {
            setUserData(false)
        }
    }, [token])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
