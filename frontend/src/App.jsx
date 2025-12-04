import {Routes, Route ,Navigate} from "react-router";
import HomePage from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import Profile from "./pages/profile";
import Getstarted from "./pages/getstarted";
import Reports from "./pages/reports";
import Scans from "./pages/scans";



function App() {
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
     <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/dashboard" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/dashboard" />:<Signup></Signup>}></Route>
      <Route path="/dashboard" element={isAuthenticated?<Dashboard></Dashboard>:<Signup></Signup>}></Route>
      <Route path="/profile" element={<Profile></Profile>}></Route>
      <Route path="/getstarted" element={<Getstarted></Getstarted>}></Route>
      <Route path="/reports" element={<Reports></Reports>}></Route>
      <Route path="/scans/:sid" element={<Scans></Scans>}></Route>
     </Routes>
    </>
  )
}

export default App


/*<Route path="/dashboard" element={isAuthenticated?<Dashboard></Dashboard>:<Navigate to="/signup"/>}></Route>*/