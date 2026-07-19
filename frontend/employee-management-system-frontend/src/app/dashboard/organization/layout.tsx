"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const OrganizationLayout = ({children}:{children:React.ReactNode}) => {
    const {employee,loading}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if(loading){
        return;
    }
    
    if(!employee){
        router.push("/login");
        return;
    }

    if(employee.role !== "SUPER_ADMIN" && employee.role!=="HR_MANAGER"){
        router.push(`/dashboard/${employee.role.toLowerCase()}`);
    }
},[employee,loading,router])
  return (
    <>{children}</>
  )
}

export default OrganizationLayout