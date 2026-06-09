import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import CrmDashboard from './pages/CrmDashboard';
import Dashboard from './pages/Admin/Dashboard';
import Appointment from './pages/Admin/Appointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { AdminContext } from './context/AdminContext';
import { CrmContext } from './context/CrmContext';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { cToken } = useContext(CrmContext);

  const renderAdmin = () => (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/appointments' element={<Appointment />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />
          <Route path='*' element={<Navigate to='/admin-dashboard' replace />} />
        </Routes>
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<CrmDashboard defaultTab='overview' />} />
          <Route path='/patients' element={<CrmDashboard defaultTab='patients' />} />
          <Route path='/sessions' element={<CrmDashboard defaultTab='sessions' />} />
          <Route path='/payments' element={<CrmDashboard defaultTab='payments' />} />
          <Route path='/notes' element={<CrmDashboard defaultTab='notes' />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </div>
  );

return (
    <>
      {aToken && renderAdmin()}
      {cToken && !aToken && renderStaff()}
      {!aToken && !cToken && (
        <>
          <ToastContainer />
          <AdminLogin />
        </>
      )}
    </>
  );
};

export default App;