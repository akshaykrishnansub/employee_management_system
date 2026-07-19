"use client"
"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';

const HRDashboard = () => {

  interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    departmentCount: number;
}
  const {logout}=useAuth();
  const router=useRouter();

  const [profile,setProfile]=useState<any>(null);
  const [stats,setStats]=useState<DashboardStats|null>(null);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const dashboardLink =profile?.role === "SUPER_ADMIN"? "/dashboard/super_admin":"/dashboard/hr_manager";

  useEffect(() => {
    document.title = "HR Manager Dashboard | EMS";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchDashboardStats=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/dashboard",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch stats","error");
        return;
      }
      setStats(data.stats);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const fetchEmployeeProfile=async()=>{
    const res=await fetch("http://localhost:5000/api/auth/me",{
      credentials:"include"
    })
    const data=await res.json();
    if(!res.ok){
      showToast(data.error || "Failed to fetch employee Profile","error");
      return;
    }
    setProfile(data?.employee);
    console.log(data);
  }

  useEffect(()=>{
    fetchEmployeeProfile();
    fetchDashboardStats();
  },[]);

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }


  return (
    <div className='bg-blue-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
      {/* sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold mb-8 '>EMS</h1>
          <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}>X</button>
        </div>
        <nav className='space-y-4'>
          <Link href={dashboardLink} onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Dashboard</Link>
          <Link href="/dashboard/employees" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Employees</Link>
          <Link href="/dashboard/employees/create" className='block font-bold p-2 rounded hover:bg-green-200'>Create Employee</Link>
          <Link href="/dashboard/organization" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Organization</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className='lg:hidden mb-6'>
          <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
        </div>
        {/*Welcome section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome, {profile?.name}</h1>
          <p className='mt-4'>This is a dashboard for HR Managers</p>
        </div>
        {/*Stats section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Employees</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.totalEmployees}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Active Employees</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.activeEmployees}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Inactive Employees</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.inactiveEmployees}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Department</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.departmentCount}</p>
          </div>
        </div>
      </main>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default HRDashboard