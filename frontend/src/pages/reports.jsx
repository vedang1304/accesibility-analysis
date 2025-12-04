import { useNavigate, NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaMoon, FaSun, FaSearch, FaTrash, FaEye, FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import moment from 'moment';

function Reports() {
  const [theme, setTheme] = useState('light');
  const [showDropdown, setShowDropdown] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/scan/scansbyuser');
        setReports(data);
      } catch (error) {
        console.log("Unable to get reports: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleView = (id) => {
    navigate(`/scans/${id}`);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/scan/deleteresult/${reportToDelete._id}`);
      setReports(prev => prev.filter(scan => scan._id !== reportToDelete._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting scan:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const filteredReports = reports.filter(report => 
    report.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate accessibility score
  const calculateScore = (violations) => {
    if (!violations || violations.length === 0) return 100;
    
    const totalIssues = violations.reduce((acc, curr) => acc + curr.nodes.length, 0);
    return Math.max(0, 100 - (totalIssues * 5)); // Deduct 5 points per issue
  };

  // Get severity color
  const getSeverityColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-base-100">
        {/* Sticky full-width Navbar */}
        <nav className="bg-base-100 shadow-md sticky top-0 z-50 w-full flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="mr-4 md:hidden text-xl"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
            <div className="text-2xl font-bold text-primary">BrightWay</div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search input for mobile */}
            <div className="md:hidden relative">
              <input
                type="text"
                placeholder="Search reports..."
                className="input input-sm input-bordered pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme} 
              className="btn btn-sm btn-ghost"
              aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={toggleDropdown} aria-label="User profile menu">
                <FaUserCircle size={28} className="text-gray-700 dark:text-gray-300" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-md p-2 z-50 border border-base-300">
                  <div className="px-4 py-2 border-b border-base-300">
                    <p className="font-medium truncate">{user?.emailId}</p>
                  </div>
                  <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 hover:bg-base-300 rounded"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </NavLink>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 hover:bg-base-300 rounded text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile sidebar */}
        {showMobileMenu && (
          <aside className="md:hidden bg-base-200 p-4 border-b">
            <ul className="menu space-y-2">
              <li>
                <NavLink 
                  to="/dashboard" 
                  className="hover:bg-base-300 rounded-md p-2 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-2">📊</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/getstarted" 
                  className="hover:bg-base-300 rounded-md p-2 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-2">🚀</span> Get Started
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/profile" 
                  className="hover:bg-base-300 rounded-md p-2 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-2">👤</span> Profile
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/reports" 
                  className="hover:bg-base-300 rounded-md p-2 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-2">📑</span> Reports
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/reports" 
                  className="hover:bg-base-300 rounded-md p-2 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-2">🤖</span> AI Assist
                </NavLink>
              </li>
            </ul>
          </aside>
        )}

        {/* Content Section: Sidebar + Main */}
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className="w-64 bg-base-200 p-4 border-r min-h-full hidden md:block">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="input input-sm input-bordered w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <ul className="menu space-y-1">
              <li>
                <NavLink to="/dashboard" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                  <span className="mr-2">📊</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/getstarted" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                  <span className="mr-2">🚀</span> Get Started
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                  <span className="mr-2">👤</span> Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" className="hover:bg-base-300 rounded-md p-2 flex items-center bg-base-300">
                  <span className="mr-2">📑</span> Reports
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                  <span className="mr-2">🤖</span> AI Assist
                </NavLink>
              </li>
            </ul>
          </aside>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Scaned Reports</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No reports match your search' : 'You haven\'t scanned any URLs yet'}
                </p>
                <NavLink to="/getstarted" className="btn btn-primary">
                  Start Scanning
                </NavLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map((report) => {
                  const score = calculateScore(report.violations);
                  const severityColor = getSeverityColor(score);
                  
                  return (
                    <div 
                      key={report._id} 
                      className="bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 border-b border-base-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <div className={`w-3 h-3 rounded-full ${severityColor} mr-2`}></div>
                              <span className="text-sm font-medium truncate">
                                {score >= 90 ? 'Good' : score >= 70 ? 'Needs Work' : 'Poor'}
                              </span>
                            </div>
                            <a 
                              href={report.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-blue-500 hover:underline truncate block"
                              title={report.url}
                            >
                              {report.url.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button 
                              onClick={() => handleView(report._id)}
                              className="btn btn-sm btn-ghost btn-square"
                              aria-label="View report"
                            >
                              <FaEye className="text-blue-500" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(report)}
                              className="btn btn-sm btn-ghost btn-square"
                              aria-label="Delete report"
                            >
                              <FaTrash className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="text-xs text-gray-500">Accessibility Score</div>
                            <div className="text-xl font-bold">{score}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Date</div>
                            <div className="text-sm">
                              {report.scandate ? moment(report.scandate).format('MMM D, YYYY') : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`h-2 rounded-full ${severityColor}`} 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Issues</div>
                            <div className="font-medium">
                              {report.violations?.reduce((acc, curr) => acc + curr.nodes.length, 0) || 0}
                            </div>
                          </div>
                        
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reportToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the report for 
              <span className="font-semibold"> {reportToDelete.url.replace(/^https?:\/\//, '')}</span>?
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Reports;