import { useNavigate, NavLink } from "react-router";
import { useState, useEffect} from "react";
import { 
  FaUserCircle, FaMoon, FaSun, FaBars, FaTimes, 
  FaRocket, FaChartLine, FaUser, FaFileAlt, FaRobot 
} from 'react-icons/fa';
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../authSlice";
import { motion } from "framer-motion";

function Getstarted() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Set theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleScan = async () => {
    if (!url) {
      setUrlError("URL is required");
      return;
    }
    
    if (!/^https?:\/\/.+$/.test(url)) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    
    try {
      setIsLoading(true);
      await axiosClient.post('/scan/result', { url });
      navigate("/reports");
    } catch (error) {
      console.error('Error submitting url', error);
      setUrlError("Failed to start scan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
                  <p className="font-medium truncate">{user?.emailId|| "Guest"}</p>
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
                className="hover:bg-base-300 rounded-md p-2 flex items-center bg-base-300"
                onClick={toggleMobileMenu}
              >
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/profile" 
                className="hover:bg-base-300 rounded-md p-2 flex items-center"
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
              <NavLink to="/getstarted" className="hover:bg-base-300 rounded-md p-2 flex items-center bg-base-300">
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="hover:bg-base-300 rounded-md p-2 flex items-center">
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

        {/* Scan Content */}
        <main className="flex-1 p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Accessibility Scanner</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                Scan any website to identify accessibility issues and get actionable insights
              </p>
            </div>

            <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-8 border border-base-300">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <FaRocket className="mr-2 text-primary" /> Start a New Scan
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a website URL below to begin your accessibility analysis
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-4 mb-6">
                <label className="block font-medium text-lg">Website URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError("");
                    }}
                    placeholder="https://example.com"
                    className={`input input-bordered w-full text-lg py-4 pl-12 ${urlError ? 'input-error' : ''}`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500">🔗</span>
                  </div>
                </div>
                {urlError && <p className="text-error text-sm mt-1">{urlError}</p>}
                
                <div className="mt-2">
                  <button 
                    className={`btn btn-primary w-full text-lg py-3 ${isLoading ? 'loading' : ''}`} 
                    onClick={handleScan}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Scanning...' : 'Start Accessibility Scan'}
                  </button>
                </div>
              </div>

              {/* Scan Options */}
              <div className="mt-8 border-t border-base-300 pt-6">
                <h3 className="text-xl font-semibold mb-4">Scan Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-base-200 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-primary text-white p-2 rounded mr-3">
                        <span>⚡</span>
                      </div>
                      <h4 className="font-medium">Quick Scan</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Basic accessibility checks (WCAG 2.1 Level A)
                    </p>
                  </div>
                  
                  <div className="card bg-base-200 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-secondary text-white p-2 rounded mr-3">
                        <span>🔍</span>
                      </div>
                      <h4 className="font-medium">Full Audit</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive analysis (WCAG 2.1 Level AA + AAA)
                    </p>
                  </div>
                </div>
              </div>

              {/* Scan Details */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">What We Check</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Color contrast and readability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Image alt text and descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Keyboard navigation and focus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Semantic HTML structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>ARIA attributes implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Form accessibility and labeling</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-base-100 rounded-xl border border-base-300">
                  <div className="text-4xl mb-4">1</div>
                  <h3 className="font-bold text-lg mb-2">Enter URL</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Provide the website address you want to scan
                  </p>
                </div>
                
                <div className="text-center p-6 bg-base-100 rounded-xl border border-base-300">
                  <div className="text-4xl mb-4">2</div>
                  <h3 className="font-bold text-lg mb-2">Automated Scan</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our system analyzes the site for accessibility issues
                  </p>
                </div>
                
                <div className="text-center p-6 bg-base-100 rounded-xl border border-base-300">
                  <div className="text-4xl mb-4">3</div>
                  <h3 className="font-bold text-lg mb-2">Get Results</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Receive detailed report with actionable fixes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Getstarted;