"use client"
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const UpdateEmployee = () => {
    const params=useParams();
    const employeeId=params.id;
    const router=useRouter();
    const {logout}=useAuth();
    const [loading,setLoading]=useState<boolean>(false);
    const [profile,setProfile]=useState<any>(null);
    const [name,setName]=useState<string>("");
    const [email,setEmail]=useState<string>("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [salary, setSalary] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [role, setRole] = useState("EMPLOYEE");
    const [managerId, setManagerId] = useState("");
    const [employees, setEmployees] = useState<any[]>([]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [uploadedImage, setUploadedImage] = useState("");
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
    const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
    const dashboardLink =profile?.role === "SUPER_ADMIN"? "/dashboard/super_admin":"/dashboard/hr_manager";

    useEffect(() => {
        document.title = "Update Employee | EMS";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchEmployee = async()=>{

    try{

        const res = await fetch(
            `http://localhost:5000/api/employees/${employeeId}`,
            {
                credentials:"include"
            }
        );

        const data = await res.json();


        if(!res.ok){
            showToast(
                data.error || "Failed to fetch employee",
                "error"
            );
            return;
        }


        const employee=data.employee;


        setName(employee.name);
        setEmail(employee.email);
        setPhone(employee.phone);
        setDepartment(employee.department);
        setDesignation(employee.designation);
        setSalary(employee.salary);
        setJoiningDate(employee.joining_date.split("T")[0]);
        setStatus(employee.status);
        setRole(employee.role);
        setManagerId(employee.manager_id || "");


    }catch(err){

        console.log(err);

        showToast(
            "Something went wrong",
            "error"
        );
    }

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

    const fetchEmployeeProfile=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/me",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch profile","error");
                return;
            }
            setProfile(data.employee);
        }catch(err){
            console.error(err);
            showToast("Something went wrong");
        }
    }

    const handleImageUpload = async () => {
        if (!profileImage) return "";
        const formData = new FormData();
        formData.append("profile_image", profileImage);
        try {
            const res = await axios.post("http://localhost:5000/api/upload/profile-image",
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        setUploadedImage(res.data.filePath);
        return res.data.filePath;
    } catch (err) {
        console.error(err);
        showToast("Failed to upload image", "error");
        return "";
    }
};
    const handleSubmit=async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        setLoading(true);
        let imagePath = "";
        if (profileImage) {
            imagePath = await handleImageUpload();
        }
        const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`,{
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    department,
                    designation,
                    salary,
                    joining_date: joiningDate,
                    status,
                    role,
                    manager_id: managerId || null,
                    profile_image: imagePath,
                }),
            }
        );
        const data = await res.json();
        if (!res.ok) {
            showToast(data.error || "Failed to create employee","error");
            return;
        }
        showToast("Employee Updated successfully","success");
        router.push("/dashboard/employees");
    } catch (err) {
        console.error(err);
        showToast(
            "Something went wrong",
            "error"
        );
    }finally {
        setLoading(false);
    }
};

    useEffect(()=>{
        fetchEmployeeProfile();
        fetchEmployees();
        fetchEmployee();
    },[employeeId]);

    const handleLogout=async()=>{
        await logout();
        router.push('/login');
    }

  return (
    <div className='bg-blue-100 flex min-h-screen'>
        {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
    )}
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-bold mb-8'>EMS</h1>
            <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}>X</button>
        </div>
        <nav className='space-y-4'>
          <Link href={dashboardLink} className='block font-bold p-2 rounded hover:bg-green-200'>Dashboard</Link>
          <Link href="/dashboard/employees" className='block font-bold p-2 rounded hover:bg-green-200'>Employees</Link>
          <Link href="/dashboard/employees/create" className='block font-bold p-2 rounded hover:bg-green-200'>Create Employee</Link>
          <Link href="/dashboard/organization" className='block font-bold p-2 rounded hover:bg-green-200'>Organization</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className="lg:hidden mb-6">
            <button onClick={() =>setSidebarOpen(true)}className="p-2 shadow bg-white rounded cursor-pointer">☰</button>
        </div>
        <h1 className='text-3xl font-bold mb-4'>Welcome,{" "}{profile?.name}</h1>
        <p className='text-md font-medium text-black mb-8'>You can Update employees here.</p>
        <div className='bg-white shadow-lg rounded-lg p-8'>
            <h1 className='text-2xl font-bold mb-6'>Update Employees</h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <label htmlFor="employeeName" className='block mb-2 font-semibold'>Employee Name</label>
                    <input type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="email" className='block mb-2 font-semibold'>Email</label>
                    <input type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className='block mb-2 font-semibold'>Phone</label>
                    <input type="phone"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="department" className='block mb-2 font-semibold'>Department</label>
                    <input type="text"
                    value={department}
                    onChange={(e)=>setDepartment(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="designation" className='block mb-2 font-semibold'>Designation</label>
                    <input type="text"
                    value={designation}
                    onChange={(e)=>setDesignation(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="salary" className='block mb-2 font-semibold'>Salary</label>
                    <input type="number"
                    value={salary}
                    onChange={(e)=>setSalary(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="joiningDate" className='block mb-2 font-semibold'>Joining Date</label>
                    <input type="date"
                    value={joiningDate}
                    onChange={(e)=>setJoiningDate(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Status</label>
                    <select value={status} onChange={(e)=>setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Role</label>
                    <select value={role}
                    onChange={(e)=>setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                        <option value="EMPLOYEE">Employee</option>
                        <option value="HR_MANAGER">HR Manager</option>
                        {profile?.role==="SUPER_ADMIN" && (
                            <option value="SUPER_ADMIN">Super Admin</option>
                        )}
                    </select>
                </div>
                {/* Reporting Manager */}
                <div>
                    <label className="block mb-2 font-semibold">Reporting Manager</label>
                    <select
                    value={managerId}
                    onChange={(e)=>setManagerId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                        <option value="">Select Reporting Manager</option>
                        {employees.filter((employee)=>employee.id!==profile?.id).map((employee)=>(
                        <option key={employee.id} value={employee.id}>{employee.name}</option>))
                        }
                    </select>
                </div>
                {/* Profile Image */}
                <div>
                    <label className="block mb-2 font-semibold">Profile Image</label>
                    <input type="file"
                    accept="image/*"
                    onChange={(e)=>{
                        if(e.target.files){
                            setProfileImage(e.target.files[0]);
                        }
                    }}
                    className="w-full"/>
                </div>
                <div>
                    <button type="submit" disabled={loading} className='w-full bg-green-700 px-4 py-2 text-white hover:bg-green-600 cursor-pointer'>{loading?"Updating the employee":"Update Employee"}</button>
                </div>
            </form>
        </div>
      </main>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default UpdateEmployee;