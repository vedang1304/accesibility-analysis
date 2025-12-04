import { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";
import ChatAi from "../components/aiassist";
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaDownload,
  FaExpand,
  FaCompress,
  FaChartPie,
  FaChartLine
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Color palette for charts
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Scans() {
  const [scanData, setScanData] = useState(null);
  const [latestScans, setLatestScans] = useState([]);
  const [expandedViolations, setExpandedViolations] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('all'); // 'all', 'pie', 'line'
  let { sid } = useParams();
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/scan/generateresult/${sid}`);
        setScanData(data);

        const res = await axiosClient.get("/scan/scansbyuser");
        setLatestScans(res.data.slice(-3).reverse());
      } catch (error) {
        console.error("Error fetching scan data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sid]);

  const handleExport = async () => {
    try {
      const reportElement = chartRef.current;
      const scale = 2;
      
      const pngData = await toPng(reportElement, {
        quality: 0.95,
        pixelRatio: scale,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(pngData);
      const imgWidth = pageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(
        pngData, 
        'PNG',
        10,
        10,
        imgWidth,
        imgHeight
      );
      
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`accessibility-report-${date}.pdf`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const toggleViolation = (id) => {
    setExpandedViolations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getImpactIcon = (impact) => {
    switch(impact) {
      case 'critical': return <FaExclamationTriangle className="text-red-500 mr-2" />;
      case 'serious': return <FaExclamationCircle className="text-orange-500 mr-2" />;
      case 'moderate': return <FaInfoCircle className="text-yellow-500 mr-2" />;
      default: return <FaInfoCircle className="text-blue-500 mr-2" />;
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'critical': return 'bg-red-100 border-red-500';
      case 'serious': return 'bg-orange-100 border-orange-500';
      case 'moderate': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-blue-100 border-blue-500';
    }
  };

  const calculateAccessibilityScore = () => {
    if (!scanData || !scanData.violations) return 100;
    
    const totalIssues = scanData.violations.reduce((acc, violation) => 
      acc + violation.nodes.length, 0);
    
    return Math.max(0, 100 - (totalIssues * 5));
  };

  // Prepare data for charts
  const getChartData = () => {
    if (!scanData?.violations) return { barData: [], pieData: [], lineData: [] };
    
    // Bar chart data (issues by impact)
    const impactCounts = scanData.violations.reduce((acc, violation) => {
      acc[violation.impact] = (acc[violation.impact] || 0) + violation.nodes.length;
      return acc;
    }, {});
    
    const barData = Object.entries(impactCounts).map(([impact, count]) => ({
      name: impact.charAt(0).toUpperCase() + impact.slice(1),
      issues: count
    }));
    
    // Pie chart data (violation types)
    const violationTypes = scanData.violations.reduce((acc, violation) => {
      acc[violation.id] = (acc[violation.id] || 0) + violation.nodes.length;
      return acc;
    }, {});
    
    const pieData = Object.entries(violationTypes).map(([id, count]) => ({
      name: id,
      value: count
    }));
    
    // Line chart data (historical scores)
    const lineData = latestScans.map((scan, index) => {
      const totalIssues = scan.violations?.reduce((acc, violation) => 
        acc + violation.nodes.length, 0) || 0;
      const score = Math.max(0, 100 - (totalIssues * 5));
      
      return {
        name: `Scan ${latestScans.length - index}`,
        score,
        issues: totalIssues
      };
    });
    
    // Add current scan to line data
    if (scanData) {
      const currentTotalIssues = scanData.violations?.reduce((acc, violation) => 
        acc + violation.nodes.length, 0) || 0;
      const currentScore = Math.max(0, 100 - (currentTotalIssues * 5));
      
      lineData.push({
        name: 'Current',
        score: currentScore,
        issues: currentTotalIssues
      });
    }
    
    return { barData, pieData, lineData };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!scanData) {
    return <div className="text-center mt-10">No scan data available</div>;
  }

  const { barData, pieData, lineData } = getChartData();
  const accessibilityScore = calculateAccessibilityScore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left: AI Assistant (30% width) */}
      {!isExpanded && (
        <div className="w-full md:w-[30%] border-r border-gray-200">
          <ChatAi scan={scanData} />
        </div>
      )}
      
      {/* Right: Report (70% width, expands to 100%) */}
      <div 
        className={`w-full ${isExpanded ? 'md:w-full' : 'md:w-[70%]'} p-4 md:p-6 overflow-y-auto bg-white`} 
        ref={chartRef}
      >
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Accessibility Report</h1>
            <div className="text-sm md:text-base text-gray-600 truncate">
              Scanned URL: <span className="font-mono text-blue-600">{scanData.url}</span>
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString()} | {scanData.violations?.length || 0} violations found
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="btn btn-outline btn-primary flex items-center text-sm md:text-base"
            >
              <FaDownload className="mr-1 md:mr-2" /> Export
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-outline flex items-center text-sm md:text-base"
            >
              {isExpanded ? (
                <>
                  <FaCompress className="mr-1 md:mr-2" /> Collapse
                </>
              ) : (
                <>
                  <FaExpand className="mr-1 md:mr-2" /> Expand
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600">
              {accessibilityScore}
            </div>
            <div className="text-blue-800 font-medium mt-1 md:mt-2 text-sm md:text-base">Accessibility Score</div>
            <div className="text-xs md:text-sm text-gray-600 mt-1">(100 is perfect)</div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600">
              {scanData.violations?.length || 0}
            </div>
            <div className="text-orange-800 font-medium mt-1 md:mt-2 text-sm md:text-base">Violation Types</div>
            <div className="text-xs md:text-sm text-gray-600 mt-1">Unique issues found</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="text-4xl md:text-5xl font-bold text-red-600">
              {scanData.violations?.reduce((acc, violation) => acc + violation.nodes.length, 0) || 0}
            </div>
            <div className="text-red-800 font-medium mt-1 md:mt-2 text-sm md:text-base">Total Issues</div>
            <div className="text-xs md:text-sm text-gray-600 mt-1">Across all elements</div>
          </div>
        </div>

        {/* Chart Navigation */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            className={`btn btn-sm ${chartView === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartView('all')}
          >
            All Charts
          </button>
          <button 
            className={`btn btn-sm ${chartView === 'pie' ? 'btn-primary' : 'btn-outline'} flex items-center`}
            onClick={() => setChartView('pie')}
          >
            <FaChartPie className="mr-1" /> Pie
          </button>
          <button 
            className={`btn btn-sm ${chartView === 'line' ? 'btn-primary' : 'btn-outline'} flex items-center`}
            onClick={() => setChartView('line')}
          >
            <FaChartLine className="mr-1" /> Trend
          </button>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          {(chartView === 'all' || chartView === 'bar') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Impact Distribution Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="text-lg md:text-xl font-bold mb-3">Issues by Severity</h2>
                <div className="h-52 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} issues`, 'Count']}
                        labelFormatter={(label) => `Severity: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="issues" fill="#4f46e5" name="Issue Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Violation Type Pie Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="text-lg md:text-xl font-bold mb-3">Violation Types</h2>
                <div className="h-52 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} occurrences`, 'Count']}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {chartView === 'pie' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">Violation Distribution</h2>
              <div className="h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} occurrences`, 'Count']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trend Chart */}
          {(chartView === 'all' || chartView === 'line') && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">
                {chartView === 'all' ? 'Recent Trends' : 'Accessibility Score Trend'}
              </h2>
              <div className="h-52 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => `Scan: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#4f46e5" 
                      name="Accessibility Score" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Violations List */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-3">Accessibility Violations</h2>
          
          {scanData.violations?.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
              <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">No Issues Found</h3>
              <p className="text-gray-600 text-sm md:text-base">Great job! This page meets accessibility standards.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scanData.violations?.map((violation, index) => (
                <div 
                  key={index}
                  className={`border-l-4 rounded-r-lg p-3 ${getImpactColor(violation.impact)}`}
                >
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleViolation(index)}
                  >
                    <div className="flex items-start">
                      {getImpactIcon(violation.impact)}
                      <div>
                        <h3 className="font-bold text-base md:text-lg">
                          {violation.id} - {violation.description}
                        </h3>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">
                          Impact: <span className="font-medium capitalize">{violation.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="badge badge-outline badge-sm">
                      {violation.nodes.length} {violation.nodes.length === 1 ? 'element' : 'elements'}
                    </div>
                  </div>
                  
                  {expandedViolations[index] && (
                    <div className="mt-3 pl-6 space-y-3">
                      <div>
                        <h4 className="font-medium mb-1 text-sm md:text-base">How to Fix</h4>
                        <p className="text-gray-700 text-sm md:text-base">{violation.help}</p>
                        {violation.helpUrl && (
                          <a 
                            href={violation.helpUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-1 inline-block text-sm md:text-base"
                          >
                            Learn more
                          </a>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1 text-sm md:text-base">Affected Elements</h4>
                        <div className="space-y-2">
                          {violation.nodes.map((node, nodeIndex) => (
                            <div key={nodeIndex} className="bg-gray-50 p-2 rounded-lg">
                              <div className="font-mono text-xs md:text-sm mb-1">{node.target.join(' > ')}</div>
                              <div className="text-xs bg-gray-800 text-gray-200 p-2 rounded overflow-x-auto">
                                {node.html}
                              </div>
                              <div className="text-xs md:text-sm text-gray-700 mt-1">
                                <span className="font-medium">Issue:</span> {node.failureSummary}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Scans */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg md:text-xl font-bold mb-3">Recent Scans</h2>
          <ul className="space-y-2">
            {latestScans.map((scan) => {
              const totalIssues = scan.violations?.reduce((acc, violation) => 
                acc + violation.nodes.length, 0) || 0;
              const score = Math.max(0, 100 - (totalIssues * 5));
              
              return (
                <li
                  key={scan._id}
                  className="border border-gray-200 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="truncate pr-2 text-sm md:text-base">
                      {scan.url.replace(/^https?:\/\//, '')}
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 md:w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500" 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs md:text-sm font-medium w-8">{score}</span>
                      <span className="text-xs text-gray-500 ml-1 w-16 text-right">
                        {new Date(scan.scandate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Scans;