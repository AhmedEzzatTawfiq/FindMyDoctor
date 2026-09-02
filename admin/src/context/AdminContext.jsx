import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllDoctors as fetchDoctorsApi,
    getAllAppointments as fetchAppointmentsApi,
    getAdminDashboard as fetchDashDataApi,
    changeAvailability as changeAvailabilityApi,
    deleteAppointment as deleteAppointmentApi,
    deleteDoctor as deleteDoctorApi,
} from "../services";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setATokenState] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const queryClient = useQueryClient();
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const setAToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('aToken', newToken)
            setATokenState(newToken)
        } else {
            localStorage.removeItem('aToken')
            setATokenState('')
        }
    }

    // Cleanup legacy sessionStorage keys on init
    useEffect(() => {
        sessionStorage.removeItem('admin_doctors')
        sessionStorage.removeItem('admin_appointments')
        sessionStorage.removeItem('admin_dashData')
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('aToken')
        setATokenState('')
        queryClient.clear()
    }, [queryClient])

    const handleAuthError = useCallback((error, message) => {
        const errMsg = message || error?.response?.data?.message || error?.message
        if (errMsg === 'jwt expired' || errMsg === 'Not authorized' || errMsg === 'jwt malformed' || error?.response?.status === 401) {
            logout()
            return true
        }
        return false
    }, [logout])

    // Query for Doctors List
    const {
        data: doctors = [],
        isLoading: loadingDoctors,
        refetch: getAllDoctors,
    } = useQuery({
        queryKey: ['admin', 'doctors', aToken],
        queryFn: async () => {
            if (!aToken) return []
            try {
                const data = await fetchDoctorsApi()
                if (data.success) {
                    return data.doctors
                } else {
                    if (!handleAuthError(null, data.message)) toast.error(data.message)
                    return []
                }
            } catch (error) {
                if (!handleAuthError(error)) toast.error(error.message)
                return []
            }
        },
        enabled: Boolean(aToken),
        staleTime: 1000 * 60 * 5,
    })

    // Query for Appointments List
    const {
        data: appointments = [],
        isLoading: loadingAppointments,
        refetch: getAllAppointments,
    } = useQuery({
        queryKey: ['admin', 'appointments', aToken],
        queryFn: async () => {
            if (!aToken) return []
            try {
                const data = await fetchAppointmentsApi()
                if (data.success) {
                    return data.appointments
                } else {
                    if (!handleAuthError(null, data.message)) toast.error(data.message)
                    return []
                }
            } catch (error) {
                if (!handleAuthError(error)) toast.error(error.message)
                return []
            }
        },
        enabled: Boolean(aToken),
        staleTime: 1000 * 60 * 5,
    })

    // Query for Dashboard Summary Data
    const {
        data: dashData = null,
        isLoading: loadingDash,
        refetch: getDashData,
    } = useQuery({
        queryKey: ['admin', 'dashData', aToken],
        queryFn: async () => {
            if (!aToken) return null
            try {
                const data = await fetchDashDataApi()
                if (data.success) {
                    return data.dashData
                } else {
                    if (!handleAuthError(null, data.message)) toast.error(data.message)
                    return null
                }
            } catch (error) {
                if (!handleAuthError(error)) toast.error(error.message)
                return null
            }
        },
        enabled: Boolean(aToken),
        staleTime: 1000 * 60 * 5,
    })

    // Change doctor availability
    const changeAvailability = async (docId) => {
        queryClient.setQueryData(['admin', 'doctors', aToken], prev => {
            if (!prev) return prev
            return prev.map(d => d._id === docId ? { ...d, available: !d.available } : d)
        })
        try {
            const data = await changeAvailabilityApi(docId)
            if (data.success) {
                toast.success(data.message)
            } else {
                if (!handleAuthError(null, data.message)) {
                    toast.error(data.message)
                    getAllDoctors()
                }
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error(error.message)
                getAllDoctors()
            }
        }
    }

    // Delete appointment admin
    const deleteAppointment = async (appointmentId) => {
        queryClient.setQueryData(['admin', 'appointments', aToken], prev => {
            if (!prev) return prev
            return prev.filter(item => item._id !== appointmentId)
        })
        queryClient.setQueryData(['admin', 'dashData', aToken], prev => {
            if (!prev) return prev
            return {
                ...prev,
                appointments: Math.max(0, (prev.appointments || 1) - 1),
                latestAppointments: prev.latestAppointments?.filter(item => item._id !== appointmentId)
            }
        })

        try {
            const data = await deleteAppointmentApi(appointmentId)
            if (data.success) {
                toast.success(data.message)
            } else {
                if (!handleAuthError(null, data.message)) {
                    toast.error(data.message)
                    getAllAppointments()
                    getDashData()
                }
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error(error.message)
                getAllAppointments()
                getDashData()
            }
        }
    }

    // Delete doctor admin
    const deleteDoctor = async (docId) => {
        queryClient.setQueryData(['admin', 'doctors', aToken], prev => {
            if (!prev) return prev
            return prev.filter(doc => doc._id !== docId)
        })
        queryClient.setQueryData(['admin', 'dashData', aToken], prev => {
            if (!prev) return prev
            return { ...prev, doctors: Math.max(0, (prev.doctors || 1) - 1) }
        })

        try {
            const data = await deleteDoctorApi(docId)
            if (data.success) {
                toast.success(data.message)
            } else {
                if (!handleAuthError(null, data.message)) {
                    toast.error(data.message)
                    getAllDoctors()
                }
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error(error.message)
                getAllDoctors()
            }
        }
    }

    useEffect(() => {
        if (!aToken) {
            queryClient.removeQueries({ queryKey: ['admin'] })
        }
    }, [aToken, queryClient])

    const value = {
        aToken, setAToken, backendUrl, logout,
        doctors, getAllDoctors, changeAvailability, deleteDoctor, loadingDoctors,
        appointments, getAllAppointments, deleteAppointment, loadingAppointments,
        dashData, getDashData, loadingDash,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider