import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    // same state across refreshes - read from localStorage and sessionStorage
    const [doctors, setDoctors] = useState(() => {
        try {
            const saved = localStorage.getItem('client_doctors') || sessionStorage.getItem('client_doctors')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })

    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem('client_userData') || sessionStorage.getItem('client_userData')
            return saved ? JSON.parse(saved) : false
        } catch { return false }
    })

    const [loadingDoctors, setLoadingDoctors] = useState(() => {
        try {
            const saved = localStorage.getItem('client_doctors') || sessionStorage.getItem('client_doctors')
            const parsed = saved ? JSON.parse(saved) : []
            return parsed.length === 0
        } catch { return true }
    })
    const [loadingUserData, setLoadingUserData] = useState(false)

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Sync state to localStorage and sessionStorage
    useEffect(() => {
        if (doctors.length > 0) {
            const json = JSON.stringify(doctors)
            localStorage.setItem('client_doctors', json)
            sessionStorage.setItem('client_doctors', json)
        }
    }, [doctors])

    useEffect(() => {
        if (userData) {
            const json = JSON.stringify(userData)
            localStorage.setItem('client_userData', json)
            sessionStorage.setItem('client_userData', json)
        }
    }, [userData])

    
    const getDoctors = useCallback(async () => {
        // Only trigger visible loading state if we have no cached doctors yet
        setDoctors(prev => {
            if (prev.length === 0) {
                setLoadingDoctors(true)
            }
            return prev
        })

        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                const normalized = data.doctors.map(doc => ({
                    ...doc,
                    speciality: doc.speciality || doc.specialization || 'General physician',
                    title: doc.title || 'Specialist',
                    gender: doc.gender || 'Male',
                    slots_booked: doc.slots_booked || {}
                }))

                // Prevent state mutation and rerender if data is the same
                setDoctors(prev => {
                    const isSame = JSON.stringify(prev) === JSON.stringify(normalized)
                    return isSame ? prev : normalized
                })
            }
        } catch (error) {
            toast.error(error.message) 
        } finally {
            setLoadingDoctors(false)
        }
    }, [backendUrl])

    const getUserData = useCallback(async () => {
        if (!token) return
        setLoadingUserData(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingUserData(false)
        }
    }, [token, backendUrl])
    
    const value = {
        doctors, getDoctors, loadingDoctors,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData, loadingUserData,
        getUserData
    }

    useEffect(() => {
        getDoctors()
    }, [getDoctors])

    useEffect(() => {
        if (token) {
            getUserData()
        } else {
            localStorage.removeItem('client_userData')
            sessionStorage.removeItem('client_userData')
            setUserData(false)
        }
    }, [token, getUserData])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
