import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    // Persistent state across refreshes
    const [doctors, setDoctors] = useState(() => {
        try {
            const saved = sessionStorage.getItem('admin_doctors')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })
    const [appointments, setAppointments] = useState(() => {
        try {
            const saved = sessionStorage.getItem('admin_appointments')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })
    const [dashData, setDashData] = useState(() => {
        try {
            const saved = sessionStorage.getItem('admin_dashData')
            return saved ? JSON.parse(saved) : null
        } catch { return null }
    })

    const [loadingDash, setLoadingDash] = useState(false)
    const [loadingDoctors, setLoadingDoctors] = useState(false)
    const [loadingAppointments, setLoadingAppointments] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Sync state to sessionStorage
    useEffect(() => {
        if (doctors.length > 0) {
            sessionStorage.setItem('admin_doctors', JSON.stringify(doctors))
        }
    }, [doctors])

    useEffect(() => {
        if (appointments.length > 0) {
            sessionStorage.setItem('admin_appointments', JSON.stringify(appointments))
        }
    }, [appointments])

    useEffect(() => {
        if (dashData) {
            sessionStorage.setItem('admin_dashData', JSON.stringify(dashData))
        }
    }, [dashData])

    // Get all doctors
    const getAllDoctors = useCallback(async () => {
        if (!aToken) return
        setLoadingDoctors(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingDoctors(false)
        }
    }, [aToken, backendUrl])

    // Change doctor availbility
    const changeAvailability = async (docId) => {
        setDoctors(prev => prev.map(d => d._id === docId ? { ...d, available: !d.available } : d))
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
                getAllDoctors()
            }
        } catch (error) {
            toast.error(error.message)
            getAllDoctors()
        }
    }

    // Get all appointments
    const getAllAppointments = useCallback(async () => {
        if (!aToken) return
        setLoadingAppointments(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingAppointments(false)
        }
    }, [aToken, backendUrl])

    // Delete appointment admin
    const deleteAppointment = async (appointmentId) => {
        setAppointments(prev => prev.filter(item => item._id !== appointmentId))
        setDashData(prev => {
            if (!prev) return prev
            return {
                ...prev,
                appointments: Math.max(0, (prev.appointments || 1) - 1),
                latestAppointments: prev.latestAppointments?.filter(item => item._id !== appointmentId)
            }
        })

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
                getAllAppointments()
                getDashData()
            }
        } catch (error) {
            toast.error(error.message)
            getAllAppointments()
            getDashData()
        }
    }

    // Get dashboard data
    const getDashData = useCallback(async () => {
        if (!aToken) return
        setLoadingDash(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingDash(false)
        }
    }, [aToken, backendUrl])

    // delete doctor
    const deleteDoctor = async (docId) => {
        setDoctors(prev => prev.filter(doc => doc._id !== docId))
        setDashData(prev => prev ? { ...prev, doctors: Math.max(0, (prev.doctors || 1) - 1) } : prev)

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-doctor', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
                getAllDoctors()
            }
        } catch (error) {
            toast.error(error.message)
            getAllDoctors()
        }
    }

    // Background revalidation on authentication
    useEffect(() => {
        if (aToken) {
            getDashData()
            getAllDoctors()
            getAllAppointments()
        } else {
            sessionStorage.removeItem('admin_doctors')
            sessionStorage.removeItem('admin_appointments')
            sessionStorage.removeItem('admin_dashData')
            setDoctors([])
            setAppointments([])
            setDashData(null)
        }
    }, [aToken, getDashData, getAllDoctors, getAllAppointments])

    const value = {
        aToken, setAToken, backendUrl,
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