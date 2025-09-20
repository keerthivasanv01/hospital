import React, { useEffect, useState } from 'react';
import Navbar from '../sections/Navbar';
import '../css/UserDashboard.css';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://devbeapi.lucknowheritagehospital.com/appointments');
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setAppointments(data.data || []);
      } catch (err) {
        setError('Could not load appointments.');
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(appointments.length / rowsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="user-dashboard-page" style={{ width: '100vw', minHeight: '100vh' }}>
      <Navbar />
      <div className="user-dashboard-container" style={{ maxWidth: '100%', width: '100%', borderRadius: 0 }}>
        <h2>Welcome to Your Dashboard</h2>
        <p>Here are all booked appointments:</p>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8">No appointments found.</td>
                  </tr>
                ) : (
                  paginatedAppointments.map((appt, idx) => (
                    <tr key={idx + (currentPage - 1) * rowsPerPage}>
                      <td>{appt.name}</td>
                      <td>{appt.gender}</td>
                      <td>{appt.age}</td>
                      <td>{appt.email}</td>
                      <td>{appt.phone}</td>
                      <td>{appt.appointmentDate || appt.dob}</td>
                      <td>{appt.appointmentTime || appt.time}</td>
                      <td>{appt.department}</td>
                      <td>{appt.doctor}</td>
                      <td>{appt.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination controls at the bottom */}
            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'flex-end',
                background: '#f8f8f8',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #e0e0e0'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  style={{
                    marginLeft: 4,
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid #ccc'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  background: currentPage === 1 ? '#eee' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Prev
              </button>
              <span style={{ minWidth: 80, textAlign: 'center' }}>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  background: (currentPage === totalPages || totalPages === 0) ? '#eee' : '#fff',
                  cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
