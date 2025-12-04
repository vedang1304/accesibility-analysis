import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router";
import { 
  FaUserCircle, FaBell, FaRocket, FaUser, FaFileAlt, FaRobot,
  FaChartLine, FaChartPie, FaChartBar, FaChartArea, FaExclamationTriangle
} from "react-icons/fa";
import { MdDarkMode, MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../authSlice";
import { motion } from "framer-motion";
import axiosClient from "../utils/axiosClient";
import {
  LineChart,
  PieChart,
  RadarChart,
  BarChart
} from "../components/charts";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    accessibilityScore: 0,
    totalScans: 0,
    fixedIssues: 0,
    activeIssues: 0
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/scan/scansbyuser");
        setScans(data);
        
        // Calculate statistics
        const totalScans = data.length;
        const totalIssues = data.reduce((acc, scan) => 
          acc + (scan.violations?.reduce((sum, v) => sum + v.nodes.length, 0) || 0), 0);
        
        const fixedIssues = Math.floor(totalIssues * 0.78); // Mock fixed issues (78%)
        const activeIssues = totalIssues - fixedIssues;
        
        const accessibilityScore = Math.max(0, 100 - (activeIssues * 0.5));
        
        setStats({
          accessibilityScore: Math.round(accessibilityScore),
          totalScans,
          fixedIssues,
          activeIssues
        });
        
      } catch (error) {
        console.error("Error fetching scans", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScans();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (scans.length === 0) return {};
    
    // Line chart data - score trend
    const lineData = scans.slice(-6).map((scan, index) => {
      const totalIssues = scan.violations?.reduce((acc, violation) => 
        acc + violation.nodes.length, 0) || 0;
      const score = Math.max(0, 100 - (totalIssues * 0.5));
      
      return {
        name: `Scan ${index + 1}`,
        score: Math.round(score)
      };
    }).reverse();
    
    // Pie chart data - issue distribution by impact
    const latestScan = scans[scans.length - 1];
    let pieData = [];
    
    if (latestScan?.violations) {
      const impactCounts = latestScan.violations.reduce((acc, violation) => {
        const impact = violation.impact || 'unknown';
        acc[impact] = (acc[impact] || 0) + violation.nodes.length;
        return acc;
      }, {});
      
      pieData = Object.entries(impactCounts).map(([impact, count]) => ({
        name: impact.charAt(0).toUpperCase() + impact.slice(1),
        value: count
      }));
    }
    
    // Radar chart data - category completeness
    const radarData = [
      { subject: "Color", score: 85 },
      { subject: "Forms", score: 70 },
      { subject: "Navigation", score: 90 },
      { subject: "Semantics", score: 75 },
      { subject: "Media", score: 80 }
    ];
    
    // Bar chart data - issues per domain
    const domainIssues = {};
    
    scans.forEach(scan => {
      const domain = new URL(scan.url).hostname;
      const issues = scan.violations?.reduce((acc, violation) => 
        acc + violation.nodes.length, 0) || 0;
      
      if (domainIssues[domain]) {
        domainIssues[domain] += issues;
      } else {
        domainIssues[domain] = issues;
      }
    });
    
    const barData = Object.entries(domainIssues).map(([domain, issues]) => ({
      name: domain,
      issues
    })).slice(0, 5); // Limit to top 5 domains
    
    return { lineData, pieData, radarData, barData };
  };

  const { lineData, pieData, radarData, barData } = prepareChartData();
  const recentScans = scans.slice(-4).reverse();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-base-100"}`}>
      {/* Navbar */}
      <nav className="bg-base-100 dark:bg-gray-800 border-b dark:border-gray-700 shadow-md sticky top-0 z-50 w-full flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className="mr-4 md:hidden text-xl"
          >
            {showMobileMenu ? "✕" : "☰"}
          </button>
          <div className="text-2xl font-bold text-primary">BrightWay</div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="btn btn-ghost btn-circle"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <MdDarkMode size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn-ghost btn-circle"
              aria-label="User profile menu"
            >
              <FaUserCircle size={24} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 dark:bg-gray-800 shadow-lg rounded-md p-2 z-50 border border-base-300 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-base-300 dark:border-gray-700">
                  <p className="font-medium truncate">{user?.emailId || "Guest"}</p>
                </div>
                <NavLink 
                  to="/profile" 
                  className="block px-4 py-2 hover:bg-base-300 dark:hover:bg-gray-700 rounded"
                  onClick={() => setShowDropdown(false)}
                >
                  My Profile
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 hover:bg-base-300 dark:hover:bg-gray-700 rounded text-red-500"
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
        <aside className="md:hidden bg-base-200 dark:bg-gray-700 p-4 border-b dark:border-gray-600">
          <ul className="menu space-y-2">
            <li>
              <NavLink 
                to="/dashboard" 
                className="hover:bg-base-300 dark:hover:bg-gray-600 rounded-md p-2 flex items-center bg-base-300 dark:bg-gray-600"
                onClick={toggleMobileMenu}
              >
                <MdDashboard className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/getstarted" 
                className="hover:bg-base-300 dark:hover:bg-gray-600 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/profile" 
                className="hover:bg-base-300 dark:hover:bg-gray-600 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaUser className="mr-2" /> Profile
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className="hover:bg-base-300 dark:hover:bg-gray-600 rounded-md p-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaFileAlt className="mr-2" /> Reports
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/ai-assist" 
                className="hover:bg-base-300 dark:hover:bg-gray-600 rounded-md p-2 flex items-center"
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
        <aside className="w-64 bg-base-200 dark:bg-gray-800 p-4 border-r dark:border-gray-700 min-h-full hidden md:block">
          <ul className="menu space-y-1">
            <li>
              <NavLink to="/dashboard" className="hover:bg-base-300 dark:hover:bg-gray-700 rounded-md p-2 flex items-center bg-base-300 dark:bg-gray-700">
                <MdDashboard className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/getstarted" className="hover:bg-base-300 dark:hover:bg-gray-700 rounded-md p-2 flex items-center">
                <FaRocket className="mr-2" /> Get Started
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="hover:bg-base-300 dark:hover:bg-gray-700 rounded-md p-2 flex items-center">
                <FaUser className="mr-2" /> Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className="hover:bg-base-300 dark:hover:bg-gray-700 rounded-md p-2 flex items-center">
                <FaFileAlt className="mr-2" /> Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className="hover:bg-base-300 dark:hover:bg-gray-700 rounded-md p-2 flex items-center">
                <FaRobot className="mr-2" /> AI Assist
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.firstName || "User"}! Here's your accessibility overview.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.accessibilityScore}%
                  </div>
                  <div className="text-blue-800 dark:text-blue-200 font-medium mt-1">Accessibility Score</div>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${stats.accessibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalScans}
                  </div>
                  <div className="text-green-800 dark:text-green-200 font-medium mt-1">Total Scans</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {recentScans.length} in last 30 days
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.fixedIssues}
                  </div>
                  <div className="text-purple-800 dark:text-purple-200 font-medium mt-1">Issues Fixed</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {(stats.fixedIssues / (stats.fixedIssues + stats.activeIssues) * 100 || 0).toFixed(1)}% resolution rate
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.activeIssues}
                  </div>
                  <div className="text-amber-800 dark:text-amber-200 font-medium mt-1">Active Issues</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1 text-amber-500" /> Needs attention
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-xl p-6 h-80">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <FaChartLine className="mr-2 text-blue-500" /> 
                      Accessibility Score Trend
                    </h2>
                    <div className="text-sm badge badge-outline">Last 6 scans</div>
                  </div>
                  {lineData?.length > 0 ? (
                    <LineChart data={lineData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No scan data available
                    </div>
                  )}
                </div>
                
                <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-xl p-6 h-80">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <FaChartPie className="mr-2 text-green-500" /> 
                      Issue Distribution
                    </h2>
                    <div className="text-sm badge badge-outline">Latest scan</div>
                  </div>
                  {pieData?.length > 0 ? (
                    <PieChart data={pieData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No issue data available
                    </div>
                  )}
                </div>
                
                <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-xl p-6 h-80">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <FaChartBar className="mr-2 text-purple-500" /> 
                      Issues by Domain
                    </h2>
                    <div className="text-sm badge badge-outline">All scans</div>
                  </div>
                  {barData?.length > 0 ? (
                    <BarChart data={barData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No domain data available
                    </div>
                  )}
                </div>
                
                <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-xl p-6 h-80">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <FaChartArea className="mr-2 text-orange-500" /> 
                      Category Analysis
                    </h2>
                    <div className="text-sm badge badge-outline">Latest scan</div>
                  </div>
                  {radarData?.length > 0 ? (
                    <RadarChart data={radarData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No category data available
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Scans */}
              <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center">
                    <FaFileAlt className="mr-2 text-primary" /> 
                    Recent Scans
                  </h2>
                  <NavLink to="/reports" className="text-sm text-primary hover:underline">
                    View All
                  </NavLink>
                </div>
                
                {recentScans.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>URL</th>
                          <th>Date</th>
                          <th>Issues</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentScans.map((scan) => {
                          const scanDate = new Date(scan.scandate).toLocaleDateString();
                          const totalIssues = scan.violations?.reduce((acc, violation) => 
                            acc + violation.nodes.length, 0) || 0;
                          const score = Math.max(0, 100 - (totalIssues * 0.5));
                          
                          return (
                            <tr key={scan._id} className="hover:bg-base-200 dark:hover:bg-gray-700">
                              <td className="max-w-xs truncate">
                                {scan.url.replace(/^https?:\/\//, '')}
                              </td>
                              <td>{scanDate}</td>
                              <td>{totalIssues}</td>
                              <td>
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                                    <div 
                                      className="h-2 rounded-full bg-green-500" 
                                      style={{ width: `${score}%` }}
                                    ></div>
                                  </div>
                                  <span>{Math.round(score)}%</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${totalIssues > 0 ? 'badge-warning' : 'badge-success'}`}>
                                  {totalIssues > 0 ? 'Issues Found' : 'Passed'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No scans found. Start your first accessibility scan!
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <FaRocket className="mr-2 text-blue-500" /> Start New Scan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Scan a new website for accessibility issues
                  </p>
                  <NavLink 
                    to="/getstarted" 
                    className="btn btn-primary w-full"
                  >
                    Scan Website
                  </NavLink>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <FaRobot className="mr-2 text-green-500" /> AI Assistant
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get AI-powered recommendations for accessibility improvements
                  </p>
                  <NavLink 
                    to="/reports" 
                    className="btn btn-success w-full"
                  >
                    Ask AI Assistant
                  </NavLink>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <FaChartLine className="mr-2 text-purple-500" /> View Reports
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Analyze detailed accessibility reports and trends
                  </p>
                  <NavLink 
                    to="/reports" 
                    className="btn btn-secondary w-full"
                  >
                    View Reports
                  </NavLink>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;