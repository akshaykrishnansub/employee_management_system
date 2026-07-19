"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Organization = () => {
    const {logout}=useAuth();
    const router=useRouter();
    const [profile,setProfile]=useState<any>(null);
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
    const [tree, setTree] = useState<any>(null);
    useEffect(() => {
    console.log(tree);
}, [tree]);
    const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
    const dashboardLink =profile?.role === "SUPER_ADMIN"?"/dashboard/super_admin":"/dashboard/hr_manager";

    useEffect(() => {
        document.title = "Organization Hierarchy | EMS";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
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
    fetchOrganizationTree(data.employee.id);
    console.log(data);
  }

  const fetchOrganizationTree = async (id:string) => {
    try {
        const res = await fetch(
            `http://localhost:5000/api/employees/${id}/tree`,
            {
                credentials: "include",
            }
        );

        const data = await res.json();
        console.log("Response:", data);

        if (!res.ok) {
            showToast(data.error || "Failed to fetch organization tree", "error");
            return;
        }

        setTree(data);
    } catch (err) {
        console.error(err);
        showToast("Something went wrong", "error");
    }
};

useEffect(() => {
    fetchEmployeeProfile();
}, []);

useEffect(() => {
    if (profile?.id) {
        fetchOrganizationTree(profile.id);
    }
}, [profile]);

const renderTree = (node: any) => {
    return (
        <div key={node.id} className="ml-6 mt-6">
            <div className="inline-block bg-white rounded-lg shadow-md border p-4 min-w-55">
                <h3 className="font-bold text-lg">{node.name}</h3>
                <p className="text-sm text-gray-600">{node.designation}</p>
                <p className="text-xs text-blue-600">{node.role}</p>
            </div>

            {node.reportees?.length > 0 && (
                <div className="ml-8 mt-4 border-l-2 border-gray-300 pl-6">
                    {node.reportees.map((child: any) => (
                        renderTree(child)
                    ))}
                </div>
            )}
        </div>
    );
};

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
          <Link href="/dashboard/organization" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Organization</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
    </aside>
    <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className='lg:hidden mb-6'>
            <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
        </div>
        <h1 className='text-3xl font-bold mb-8'>Welcome,{" "}{profile?.name}</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
    <h2 className="text-2xl font-bold mb-6">
        Organization Hierarchy
    </h2>

    {tree ? (
        renderTree(tree)
    ) : (
        <p className="text-gray-500">Loading organization tree...</p>
    )}
</div>
        </main>
    </div>
)
}

export default Organization;