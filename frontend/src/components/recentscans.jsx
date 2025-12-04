import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function RecentScans() {
  const [latestScans, setLatestScans] = useState([]);
  useEffect(()=>{
    const fetchd = async ()=>{
      try{
        const res = await axiosClient.get("/scan/scansbyuser");
        setLatestScans(res.data.slice(-3).reverse());
      }
      catch(err){
        console.log("error fetching recent scans"+err)
      }
    }
    fetchd();
  },[])

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
      <ul className="space-y-3">
        {latestScans.map((scan, idx) => (
          <li key={idx} className="border-b pb-2">
            <p className="font-medium text-blue-600">{scan.url}</p>
            <p className="text-sm text-gray-500">Scanned on: {scan.scandate.slice(0, 10)}</p>
            <p className="text-sm text-red-500">Violations: {scan.violations.length}</p> 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentScans;


//Array.isArray(scan.violations)? scan.violations.length : scan.violations ?? 0