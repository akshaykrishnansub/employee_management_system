"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Employees = () => {
    const {logout}=useAuth();
    const router=useRouter();
    const [profile,setProfile]=useState<any>(null);
    const [employees,setEmployees]=useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
    const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
    const dashboardLink =profile?.role === "SUPER_ADMIN"?"/dashboard/super_admin":"/dashboard/hr_manager";

    useEffect(() => {
        document.title = "Employees | EMS";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    try {
        const res = await fetch(`http://localhost:5000/api/employees/${id}`,{
                method: "DELETE",
                credentials: "include",
            }
        );
        const data = await res.json();
        if (!res.ok) {
            showToast(data.error || "Failed to delete employee","error");
            return;
        }
        showToast("Employee deleted successfully", "success");
        fetchEmployees();
    } catch (err) {
        console.error(err);
        showToast("Something went wrong", "error");
    }
};

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
    console.log(data);
  }

    const fetchEmployees = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/employees", {
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Failed to fetch employees", "error");
            return;
        }

        setEmployees(data.employees);
    } catch (err) {
        console.error(err);
        showToast("Something went wrong", "error");
    }
};

useEffect(() => {
    fetchEmployeeProfile();
    fetchEmployees();
}, []);

const filteredEmployees = employees
    .filter((employee)=>{

        const searchMatch =
            employee.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

            employee.email
            .toLowerCase()
            .includes(search.toLowerCase());


        const departmentMatch =
            department === "" ||
            employee.department === department;


        const roleMatch =
            role === "" ||
            employee.role === role;


        const statusMatch =
            status === "" ||
            employee.status === status;


        return (
            searchMatch &&
            departmentMatch &&
            roleMatch &&
            statusMatch
        );

    })
    .sort((a,b)=>{

        if(sort==="name"){
            return a.name.localeCompare(b.name);
        }

        if(sort==="joining_date"){
            return new Date(a.joining_date).getTime() -
                   new Date(b.joining_date).getTime();
        }

        return 0;

    });

    const departments = [...new Set(employees.map((employee)=>employee.department))];

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
        <div className='hidden lg:block overflow-x-auto'>
            <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full md:w-96 border px-4 py-2 rounded mb-8"
            />
            <div className="flex flex-wrap gap-4 mb-8">
                <select value={department}
                onChange={(e)=>setDepartment(e.target.value)}
                className="border px-4 py-2 rounded"
                >
                <option value="">All Departments</option>
                {
                departments.map((dept)=>(
                <option key={dept} value={dept}>
                {dept}
                </option>
                ))
            }
            </select>
            <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="border px-4 py-2 rounded"
            >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="EMPLOYEE">Employee</option>
            </select>
            <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="border px-4 py-2 rounded"
            >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            </select>
            <select
            value={sort}
            onChange={(e)=>setSort(e.target.value)}
            className="border px-4 py-2 rounded"
            >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="joining_date">Joining Date</option>
</select>
            </div>
            
                    <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
                        <thead className='bg-green-700 text-white'>
                            <tr>
                                <th className='px-6 py-3 text-left'>Employee ID</th>
                                <th className='px-6 py-3 text-left'>Name</th>
                                <th className='px-6 py-3 text-left'>Email</th>
                                <th className='px-6 py-3 text-left'>Department</th>
                                <th className='px-6 py-3 text-left'>Role</th>
                                <th className='px-6 py-3 text-left'>Status</th>
                                <th className='px-6 py-3 text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className='px-6 py-4 font-medium'>{employee.employee_id}</td>
                                    <td className='px-6 py-4 font-medium'>{employee.name}</td>
                                    <td className='px-6 py-4 font-medium'>{employee.email}</td>
                                    <td className='px-6 py-4 font-medium'>{employee.department}</td>
                                    <td className='px-6 py-4 font-medium'>{employee.role}</td>
                                    <td className='px-6 py-4 font-medium'>{employee.status}</td>
                                    <td className='px-6 py-4'>
                                        <div className='flex gap-2 mt-4'>
                                            <Link href={`/dashboard/employees/edit/${employee.id}`} className='bg-green-700 text-white p-2 rounded hover:bg-green-600 cursor-pointer'>Edit</Link>
                                            <button onClick={()=>handleDelete(employee.id)} className='bg-red-700 text-white p-2 rounded hover:bg-red-600'>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="block lg:hidden space-y-4">
                    {filteredEmployees.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No employees found</div>
                    ) : (
                        filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Employee ID</p>
                                    <p className="font-semibold">{employee.employee_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-semibold">{employee.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-semibold break-all">{employee.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="font-semibold">{employee.department}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Role</p>
                                    <p className="font-semibold">{employee.role}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className="font-semibold">{employee.status}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/dashboard/employees/edit/${employee.id}`} className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-600 cursor-pointer">Edit</Link>
                                    <button onClick={()=>handleDelete(employee.id)} className="flex-1 bg-red-700 text-white py-2 rounded hover:bg-red-600 cursor-pointer">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    </div>
)
}

export default Employees