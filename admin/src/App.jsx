import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import Appointment from './pages/Admin/Appointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
// import CrmDashboard from './pages/CrmDashboard';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { AdminContext } from './context/AdminContext';

const App = () => {
  const { aToken } = useContext(AdminContext);

  const renderAdmin = () => (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path='/' element={<Navigate to='/admin-dashboard' replace />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/appointments' element={<Appointment />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />


          <Route path='*' element={<Navigate to='/admin-dashboard' replace />} />
        </Routes>
      </div>
    </div>
  );

  return (
    <>
      {aToken && renderAdmin()}
      {!aToken && (
        <>
          <ToastContainer />
          <AdminLogin />
        </>
      )}
    </>
  );
};

export default App;