import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrmContext } from '../context/CrmContext';
import { BanknoteArrowDown, Calendar, CreditCard, NotebookTabs, RefreshCcw, SquareKanban, UserRound } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <SquareKanban /> },
  { id: 'patients', label: 'Patients', icon: <UserRound /> },
  { id: 'sessions', label: 'Sessions', icon: <Calendar /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard /> },
  { id: 'notes', label: 'Notes', icon: <NotebookTabs /> },
];

const NOTE_TAGS = ['General', 'Medical', 'Administrative', 'Urgent'];
const NOTE_PRIORITIES = ['normal', 'high', 'urgent'];
const SESSION_STATUSES = ['completed', 'ongoing', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'partial', 'paid'];

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtMoney = (n) => `${(n || 0).toLocaleString()} EGP`;

const badge = (text, color) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{text}</span>
);

const paymentBadge = (status) => {
  const map = {
    paid: 'bg-green-100 text-green-700',
    partial: 'bg-amber-100 text-amber-700',
    unpaid: 'bg-red-100 text-red-700',
  };
  return badge(status || 'unpaid', map[status] || map.unpaid);
};

const sessionBadge = (status) => {
  const map = {
    completed: 'bg-green-100 text-green-700',
    ongoing: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return badge(status || 'completed', map[status] || map.completed);
};

const TAB_ROUTES = {
  overview: '/',
  patients: '/patients',
  sessions: '/sessions',
  payments: '/payments',
  notes: '/notes',
};

const CrmDashboard = ({ defaultTab = 'overview' }) => {
  const navigate = useNavigate();
  const {
    cToken, staffUser, patients, sessions, notes, stats,
    getCrmStats, refreshAll,
    addPatient, deletePatient,
    addSession, updateSession, deleteSession,
    addNote, deleteNote,
  } = useContext(CrmContext);

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);
  const [patientSearch, setPatientSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: '', phone: '', phone2: '', age: '', gender: '', address: '', notes: '',
  });
  const [newSession, setNewSession] = useState({
    patientId: '', date: '', diagnosis: '', prescription: '', notes: '', status: 'completed', fee: '', paid: false,
  });
  const [newNote, setNewNote] = useState({
    title: '', content: '', tag: 'General', priority: 'normal', patientId: '',
  });

  useEffect(() => {
    if (cToken) refreshAll();
  }, [cToken]);

  const sessionCountMap = stats?.sessionCounts || {};

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const q = patientSearch.toLowerCase();
      const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.phone?.includes(q);
      const matchGender = genderFilter === 'all' || p.gender === genderFilter;
      return matchSearch && matchGender;
    });
  }, [patients, patientSearch, genderFilter]);

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (sessionStatusFilter !== 'all' && s.status !== sessionStatusFilter) return false;
      if (paymentFilter === 'paid' && !s.paid) return false;
      if (paymentFilter === 'unpaid' && s.paid) return false;
      return true;
    });
  }, [sessions, sessionStatusFilter, paymentFilter]);

  const pendingPatients = useMemo(
    () => patients.filter(p => (p.amountRemaining || 0) > 0),
    [patients]
  );

  const recentPatients = useMemo(
    () => [...patients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [patients]
  );

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const ok = await addPatient({
      ...newPatient,
      age: newPatient.age ? Number(newPatient.age) : undefined,
    });
    if (ok) {
      setNewPatient({ name: '', phone: '', phone2: '', age: '', gender: '', address: '', notes: '' });
      setShowPatientForm(false);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    const ok = await addSession({
      ...newSession,
      fee: parseFloat(newSession.fee) || 0,
      paid: newSession.paid === true || newSession.paid === 'true',
    });
    if (ok) {
      setNewSession({ patientId: '', date: '', diagnosis: '', prescription: '', notes: '', status: 'completed', fee: '', paid: false });
      setShowSessionForm(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const ok = await addNote({
      ...newNote,
      patientId: newNote.patientId || null,
    });
    if (ok) {
      setNewNote({ title: '', content: '', tag: 'General', priority: 'normal', patientId: '' });
      setShowNoteForm(false);
    }
  };

  const toggleSessionPaid = async (session) => {
    await updateSession({ id: session._id, paid: !session.paid });
  };

  const exportSessionsCsv = () => {
    const headers = ['Date', 'Patient', 'Diagnosis', 'Status', 'Fee', 'Paid'];
    const rows = filteredSessions.map(s => [
      fmtDate(s.date),
      s.patientId?.name || s.patientId,
      s.diagnosis || '',
      s.status,
      s.fee,
      s.paid ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass = 'border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300';
  const labelClass = 'text-xs font-medium text-gray-500 mb-1 block';
  const selectClass = inputClass + ' bg-white';

  return (
    <div className="m-5 w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">Clinic CRM</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Welcome{staffUser?.name ? `, ${staffUser.name}` : ''} — manage patients, sessions & payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshAll}
            className="text-sm flex gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
          <RefreshCcw className='w-4 h-4 text-gray-500' /> Refresh
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Staff Online
          </div>
        </div>
      </div>

    
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Add Patient', action: () => { navigate('/patients'); setShowPatientForm(true); } },
          { label: 'New Session', action: () => { navigate('/sessions'); setShowSessionForm(true); } },
          { label: 'View Payments', action: () => navigate('/payments') },
          { label: 'Add Note', action: () => { navigate('/notes'); setShowNoteForm(true); } },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-indigo-200 transition group"
          >
            <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">{item.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">Quick action</p>
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Patients', value: stats?.totalPatients ?? patients.length, color: 'from-indigo-500 to-indigo-400', icon:<UserRound/> },
          { label: 'Sessions (Month)', value: stats?.monthlySessions ?? '—', color: 'from-purple-500 to-purple-400', icon:<Calendar /> },
          { label: 'Monthly Revenue', value: fmtMoney(stats?.monthlyRevenue), color: 'from-emerald-500 to-emerald-400', icon:<CreditCard /> },
          { label: 'Pending Amounts', value: fmtMoney(stats?.pendingAmount), color: 'from-rose-500 to-rose-400', icon:<BanknoteArrowDown /> },
        ].map(card => (
          <div key={card.label} className={`bg-linear-to-br ${card.color} rounded-2xl p-5 text-white shadow`}>
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="text-xl font-bold truncate">{card.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 mb-5 gap-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(TAB_ROUTES[tab.id])}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Recent Patients</h3>
              <button onClick={() => navigate('/patients')} className="text-xs text-indigo-500 hover:underline">View all</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">Patient</th>
                  <th className="text-left px-4 py-2">Phone</th>
                  <th className="text-left px-4 py-2">Sessions</th>
                  <th className="text-left px-4 py-2">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPatients.length ? recentPatients.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-2.5 text-gray-500">{p.phone}</td>
                    <td className="px-4 py-2.5">{sessionCountMap[p._id] || 0}</td>
                    <td className="px-4 py-2.5 text-gray-400">{fmtDate(p.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400">No patients yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Recent Sessions</h3>
              <button onClick={() => navigate('/sessions')} className="text-xs text-indigo-500 hover:underline">View all</button>
            </div>
            <div className="divide-y divide-gray-50">
              {sessions.slice(0, 5).map(s => (
                <div key={s._id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.patientId?.name || 'Patient'}</p>
                    <p className="text-xs text-gray-400">{s.diagnosis || 'No diagnosis'} · {fmtDate(s.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sessionBadge(s.status)}
                    <span className="text-xs font-medium text-gray-600">{fmtMoney(s.fee)}</span>
                  </div>
                </div>
              ))}
              {!sessions.length && <p className="py-8 text-center text-gray-400 text-sm">No sessions yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* PATIENTS */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Patient List</h3>
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                placeholder="Search name or phone…"
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm w-44"
              />
              <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                <option value="all">All genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <button onClick={() => setShowPatientForm(v => !v)} className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-4 py-2 rounded-full font-semibold transition">
                + Add Patient
              </button>
            </div>
          </div>

          {showPatientForm && (
            <form onSubmit={handleAddPatient} className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 grid sm:grid-cols-3 gap-3">
              {[['name', 'Full Name'], ['phone', 'Phone'], ['phone2', 'Phone 2'], ['age', 'Age'], ['address', 'Address'], ['notes', 'Notes']].map(([field, ph]) => (
                <div key={field}>
                  <label className={labelClass}>{ph}</label>
                  <input type={field === 'age' ? 'number' : 'text'} placeholder={ph} value={newPatient[field]} onChange={e => setNewPatient(p => ({ ...p, [field]: e.target.value }))} className={inputClass} required={field === 'name' || field === 'phone'} />
                </div>
              ))}
              <div>
                <label className={labelClass}>Gender</label>
                <select value={newPatient.gender} onChange={e => setNewPatient(p => ({ ...p, gender: e.target.value }))} className={selectClass}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowPatientForm(false)} className="text-sm text-gray-500 px-4 py-2 rounded-full border hover:bg-gray-100">Cancel</button>
                <button type="submit" className="text-sm bg-indigo-500 text-white px-5 py-2 rounded-full font-semibold">Save Patient</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Patient</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Age</th>
                  <th className="text-left px-4 py-3">Sessions</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Registered</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPatients.length ? filteredPatients.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {(p.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.phone}</td>
                    <td className="px-4 py-3">{p.age || '—'}</td>
                    <td className="px-4 py-3">{sessionCountMap[p._id] || 0}</td>
                    <td className="px-4 py-3">{paymentBadge(p.paymentStatus)}</td>
                    <td className="px-4 py-3 text-gray-400">{fmtDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deletePatient(p._id)} className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-3 py-1 rounded-full">Remove</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No patients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Session Details</h3>
            <div className="flex flex-wrap gap-2">
              <select value={sessionStatusFilter} onChange={e => setSessionStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                <option value="all">All statuses</option>
                {SESSION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                <option value="all">All payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <button onClick={exportSessionsCsv} className="text-xs border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50">Export CSV</button>
              <button onClick={() => setShowSessionForm(v => !v)} className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-4 py-2 rounded-full font-semibold">+ Add Session</button>
            </div>
          </div>

          {showSessionForm && (
            <form onSubmit={handleAddSession} className="px-6 py-4 bg-purple-50 border-b border-purple-100 grid sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Patient</label>
                <select value={newSession.patientId} onChange={e => setNewSession(s => ({ ...s, patientId: e.target.value }))} className={selectClass} required>
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" value={newSession.date} onChange={e => setNewSession(s => ({ ...s, date: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={newSession.status} onChange={e => setNewSession(s => ({ ...s, status: e.target.value }))} className={selectClass}>
                  {SESSION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Diagnosis</label>
                <input type="text" value={newSession.diagnosis} onChange={e => setNewSession(s => ({ ...s, diagnosis: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Fee (EGP)</label>
                <input type="number" min="0" value={newSession.fee} onChange={e => setNewSession(s => ({ ...s, fee: e.target.value }))} className={inputClass} />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={newSession.paid} onChange={e => setNewSession(s => ({ ...s, paid: e.target.checked }))} />
                  Paid
                </label>
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>Prescription / Notes</label>
                <textarea value={newSession.prescription} onChange={e => setNewSession(s => ({ ...s, prescription: e.target.value }))} className={inputClass + ' h-16 resize-none'} />
              </div>
              <div className="sm:col-span-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowSessionForm(false)} className="text-sm text-gray-500 px-4 py-2 rounded-full border">Cancel</button>
                <button type="submit" className="text-sm bg-purple-500 text-white px-5 py-2 rounded-full font-semibold">Save Session</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Patient</th>
                  <th className="text-left px-4 py-3">Diagnosis</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Fee</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSessions.length ? filteredSessions.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{fmtDate(s.date)}</td>
                    <td className="px-4 py-3 font-medium">{s.patientId?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.diagnosis || '—'}</td>
                    <td className="px-4 py-3">{sessionBadge(s.status)}</td>
                    <td className="px-4 py-3">{fmtMoney(s.fee)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSessionPaid(s)} className={`text-xs px-2 py-0.5 rounded-full border ${s.paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {s.paid ? 'Paid ✓' : 'Unpaid'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteSession(s._id)} className="text-xs text-red-400 border border-red-200 px-2 py-0.5 rounded-full">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No sessions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Pending Amounts</h3>
              <p className="text-xs text-gray-400 mt-0.5">Patients with outstanding balances</p>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingPatients.length ? pendingPatients.map(p => (
                <div key={p._id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-600">{fmtMoney(p.amountRemaining)}</p>
                    {paymentBadge(p.paymentStatus)}
                  </div>
                </div>
              )) : (
                <p className="py-10 text-center text-gray-400 text-sm">No pending payments</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Payment Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              {PAYMENT_STATUSES.map(status => {
                const count = patients.filter(p => p.paymentStatus === status).length;
                const colors = { paid: 'text-green-600', partial: 'text-amber-600', unpaid: 'text-red-600' };
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                    <span className={`font-bold ${colors[status]}`}>{count} patients</span>
                  </div>
                );
              })}
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Pending</span>
                <span className="text-lg font-bold text-rose-600">{fmtMoney(stats?.pendingAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Clinical & Admin Notes</h3>
            <button onClick={() => setShowNoteForm(v => !v)} className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-4 py-2 rounded-full font-semibold">+ Add Note</button>
          </div>

          {showNoteForm && (
            <form onSubmit={handleAddNote} className="px-6 py-4 bg-pink-50 border-b border-pink-100 grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input type="text" value={newNote.title} onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Patient (optional)</label>
                <select value={newNote.patientId} onChange={e => setNewNote(n => ({ ...n, patientId: e.target.value }))} className={selectClass}>
                  <option value="">— None —</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tag</label>
                <select value={newNote.tag} onChange={e => setNewNote(n => ({ ...n, tag: e.target.value }))} className={selectClass}>
                  {NOTE_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select value={newNote.priority} onChange={e => setNewNote(n => ({ ...n, priority: e.target.value }))} className={selectClass}>
                  {NOTE_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Content</label>
                <textarea value={newNote.content} onChange={e => setNewNote(n => ({ ...n, content: e.target.value }))} className={inputClass + ' h-24 resize-none'} />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowNoteForm(false)} className="text-sm text-gray-500 px-4 py-2 rounded-full border">Cancel</button>
                <button type="submit" className="text-sm bg-pink-500 text-white px-5 py-2 rounded-full font-semibold">Save Note</button>
              </div>
            </form>
          )}

          <div className="divide-y divide-gray-50">
            {notes.length ? notes.map(n => (
              <div key={n._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{n.tag}</span>
                      {n.priority !== 'normal' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${n.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {n.priority}
                        </span>
                      )}
                    </div>
                    {n.patientId?.name && <p className="text-xs text-indigo-500 mt-0.5">Patient: {n.patientId.name}</p>}
                    <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmtDate(n.createdAt)}</p>
                  </div>
                  <button onClick={() => deleteNote(n._id)} className="text-xs text-red-400 border border-red-200 px-2 py-0.5 rounded-full shrink-0">Delete</button>
                </div>
              </div>
            )) : (
              <p className="py-10 text-center text-gray-400 text-sm">No notes yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
