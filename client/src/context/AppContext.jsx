import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setTokenState] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const queryClient = useQueryClient();

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken)
            setTokenState(newToken)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('userData')
            setTokenState('')
        }
    }


    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        setTokenState('')
        queryClient.removeQueries({ queryKey: ['userData'] })
    }, [queryClient])

    // TanStack Query caching for Doctors List
    const {
        data: doctors = [],
        isLoading: loadingDoctors,
        refetch: getDoctors,
    } = useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                return data.doctors.map(doc => ({
                    ...doc,
                    speciality: doc.speciality || doc.specialization || 'General physician',
                    title: doc.title || 'Specialist',
                    gender: doc.gender || 'Male',
                    slots_booked: doc.slots_booked || {}
                }))
            } else {
                toast.error(data.message)
                return []
            }
        },
        staleTime: 1000 * 60 * 5,
    })

    // TanStack Query for user Data
    const {
        data: userData = false,
        isLoading: loadingUserData,
        refetch: getUserData,
    } = useQuery({
        queryKey: ['userData', token],
        queryFn: async () => {
            if (!token) return false
            try {
                const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })
                if (data.success) {
                    localStorage.setItem('userData', JSON.stringify(data.userData))
                    return data.userData
                } else {
                    if (data.message === 'jwt expired' || data.message === 'Not authorized' || data.message === 'jwt malformed') {
                        logout()
                    } else {
                        toast.error(data.message)
                    }
                    return false
                }
            } catch (error) {
                const errMsg = error.response?.data?.message || error.message
                if (errMsg === 'jwt expired' || errMsg === 'Not authorized' || errMsg === 'jwt malformed' || error.response?.status === 401) {
                    logout()
                } else {
                    toast.error(errMsg)
                }
                return false
            }
        },
        enabled: Boolean(token),
        initialData: () => {
            if (!token) return false
            try {
                const saved = localStorage.getItem('userData')
                return saved ? JSON.parse(saved) : undefined
            } catch {
                return undefined
            }
        },
        staleTime: 1000 * 60 * 5,
    })

    const setUserData = useCallback((updater) => {
        if (!token) return
        queryClient.setQueryData(['userData', token], (oldData) => {
            const newData = typeof updater === 'function' ? updater(oldData) : updater
            if (newData) {
                localStorage.setItem('userData', JSON.stringify(newData))
            }
            return newData
        })
    }, [token, queryClient])



    const value = {
        doctors, getDoctors, loadingDoctors,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData, loadingUserData,
        getUserData, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
