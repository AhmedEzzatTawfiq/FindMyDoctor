import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const CrmContext = createContext();

const CrmContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cToken, setCToken] = useState(localStorage.getItem('sToken') || '');
  const [staffUser, setStaffUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);

  const crmHeaders = useCallback(() => ({ stoken: cToken }), [cToken]);

  const staffLogin = async (username, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/staff/login`, { username, password });
      if (data.success) {
        localStorage.setItem('sToken', data.token);
        setCToken(data.token);
        setStaffUser(data.user || null);
        toast.success('Logged in successfully');
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const staffLogout = () => {
    localStorage.removeItem('sToken');
    setCToken('');
    setStaffUser(null);
    setPatients([]);
    setSessions([]);
    setNotes([]);
    setStats(null);
  };

  const getCrmStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/crm/stats`, { headers: crmHeaders() });
      if (data.success) setStats(data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getAllPatients = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/crm/patient/list`, { headers: crmHeaders() });
      if (data.success) setPatients(data.patients);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addPatient = async (patientData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/patient/add`, patientData, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllPatients();
        getCrmStats();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const updatePatient = async (patientData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/patient/update`, patientData, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllPatients();
        getCrmStats();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const deletePatient = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/patient/delete`, { id }, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllPatients();
        getAllSessions();
        getCrmStats();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getAllSessions = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/crm/session/list`, { headers: crmHeaders() });
      if (data.success) setSessions(data.sessions);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addSession = async (sessionData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/session/add`, sessionData, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllSessions();
        getAllPatients();
        getCrmStats();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const updateSession = async (sessionData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/session/update`, sessionData, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllSessions();
        getAllPatients();
        getCrmStats();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const deleteSession = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/session/delete`, { id }, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllSessions();
        getAllPatients();
        getCrmStats();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getAllNotes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/crm/note/list`, { headers: crmHeaders() });
      if (data.success) setNotes(data.notes);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addNote = async (noteData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/note/add`, noteData, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllNotes();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/crm/note/delete`, { id }, { headers: crmHeaders() });
      if (data.success) {
        toast.success(data.message);
        getAllNotes();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const refreshAll = async () => {
    await Promise.all([getCrmStats(), getAllPatients(), getAllSessions(), getAllNotes()]);
  };

  useEffect(() => {
    const stored = localStorage.getItem('sToken');
    if (stored && stored !== cToken) setCToken(stored);
  }, []);

  useEffect(() => {
    if (cToken) refreshAll();
  }, [cToken]);

  const value = {
    cToken, setCToken,
    backendUrl,
    staffUser,
    patients, sessions, notes, stats,
    staffLogin, staffLogout,
    getCrmStats, refreshAll,
    getAllPatients, addPatient, updatePatient, deletePatient,
    getAllSessions, addSession, updateSession, deleteSession,
    getAllNotes, addNote, deleteNote,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export default CrmContextProvider;
