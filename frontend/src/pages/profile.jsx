import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import { 
  FaUserCircle, FaMoon, FaSun, FaBars, FaTimes, 
  FaChartLine, FaRocket, FaUser, FaFileAlt, FaRobot, FaSave 
} from 'react-icons/fa';
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../authSlice";
import { motion } from "framer-motion";

function Profile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    state: '',
    postcode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Set theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch user details on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const res = await axiosClient.get('/user/getprofile');
        const userData = res.data;

        // Pre-fill form with user data
        setFormData({
          displayName: userData.info.firstName || '',
          email: userData.info.emailId || user?.emailId || '',
          state: userData.state || '',
          postcode: userData.postcode || ''
        });
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      fetchUser();
    }
  }, [user]);

  // Toggle dropdown
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axiosClient.put('/user/updateprofile', formData);
      setIsEditing(false);
      // Show success feedback
    } catch (err) {
      console.error('Error updating profile:', err);
      // Show error feedback
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* Sticky Navbar */}
      <nav className="bg-base-100 shadow-md sticky top-0 z-50 w-full flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className="mr-4 md:hidden text-xl"
          >
            {showMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="text-2xl font-bold text-primary">BrightWay</div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
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
                  <p className="font-medium truncate">{user?.emailId || "Guest"}</p>
                </div>
                <NavLink 
                  to="/profile" 
                  className="block px-4 py-2 hover:bg-base-300 rounded"
                  onClick={() => setShowDropdown(false)}
                >
                  My Profile
                </NavLink>
                <NavLink 
                  to="/settings" 
                  className="block px-4 py-2 hover:bg-base-300 rounded"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <aside className="md:hidden bg-base-200 p-4 border-b">
          <ul className="menu space-y-2">
            <li>
              <NavLink 
                to="/dashboard" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaChartLine className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/getstarted" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/profile" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center bg-base-300"
                onClick={toggleMobileMenu}
              >
                <FaUser className="mr-2" /> Profile
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaFileAlt className="mr-2" /> Reports
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaRobot className="mr-2" /> AI Assist
              </NavLink>
            </li>
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-base-200 p-4 border-r min-h-full hidden md:block">
          <ul className="menu space-y-1">
            <li>
              <NavLink to="/dashboard" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                <FaChartLine className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/getstarted" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="hover:bg-base-300 rounded-md p-2 flex items-center bg-base-300">
                <FaUser className="mr-2" /> Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                <FaFileAlt className="mr-2" /> Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className="hover:bg-base-300 rounded-md p-2 flex items-center">
                <FaRobot className="mr-2" /> AI Assist
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Profile Content */}
        <main className="flex-1 p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold flex items-center">
                <FaUser className="mr-3 text-primary" /> 
                Your Profile
              </h1>
              <button 
                onClick={handleEditToggle}
                className="btn btn-outline"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-8 border border-base-300">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Display Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="input input-bordered w-full bg-base-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Postcode</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end mt-8">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-full md:w-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <FaSave className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
                
                {/* Account Information */}
                <div className="mt-12 pt-8 border-t border-base-300">
                  <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-5 rounded-lg">
                      <h3 className="font-semibold mb-3">Account Security</h3>
                      <p className="text-sm mb-4">Last password change: Never</p>
                      <button className="btn btn-sm btn-outline">Change Password</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Profile;