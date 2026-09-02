import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/Login/AdminLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import Appointment from './pages/Appointment/Appointment';
import AddDoctor from './pages/AddDoctor/AddDoctor';
import DoctorList from './pages/DoctorList/DoctorList';

import { AdminContext } from './context/AdminContext';

const App = () => {
  const { aToken } = useContext(AdminContext);

  if (!aToken) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path='/' element={<Navigate to='/admin-dashboard' replace />} />
        <Route path='/admin-dashboard' element={<Dashboard />} />
        <Route path='/appointments' element={<Appointment />} />
        <Route path='/add-doctor' element={<AddDoctor />} />
        <Route path='/doctor-list' element={<DoctorList />} />
        <Route path='*' element={<Navigate to='/admin-dashboard' replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default App;