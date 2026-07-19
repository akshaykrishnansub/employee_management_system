"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Login = () => {
  const {checkAuth}=useAuth();
  const router=useRouter();

  const [formData,setFormData]=useState({email:"",password:""});
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

  useEffect(() => {
    document.title = "Login | EMS";
  },[]);

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const name=e.target.name;
      const value=e.target.value;
      setFormData({
        ...formData,
        [name]:value
      })
  }

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try{
      const res=await fetch("http://localhost:5000/api/auth/login",{
        method:"POST",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:formData.email,
          password:formData.password
        })
      })
      const data=await res.json();
      if(!res.ok){
        showToast("Login Failed","error");
        return;
      }

      await checkAuth();
      const role=data.employee.role.toLowerCase();
      router.push(`/dashboard/${role}`)

    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }


  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='w-full max-w-md'>
        <h1 className='text-center font-bold mb-2 text-4xl'>Employee Management System</h1>
        <h2 className='text-center mb-2 font-semibold text-2xl'>Welcome Back</h2>
        <p className='text-center text-gray-600 mb-6'>Login to your account to continue</p>
        <div className='bg-white border rounded-lg shadow-2xl p-8'>
          <form onSubmit={handleSubmit}>
            <div className='mb-5'>
              <label htmlFor="Email">Email</label>
              <input type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600'
              placeholder='Enter your email' />
            </div>
            <div className='mb-5'>
              <label htmlFor="Password">Password</label>
              <input type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600'
              placeholder='Enter your Password' />
            </div>
            <div className='mb-5'>
              <button type='submit' className='w-full text-white bg-blue-700 p-2 rounded hover:bg-blue-600 cursor-pointer font-bold'>Login</button>
            </div>
          </form>
        </div>
      </div>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default Login