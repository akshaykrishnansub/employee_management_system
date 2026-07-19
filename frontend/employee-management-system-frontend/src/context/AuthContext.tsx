"use client"
import { createContext, useContext, useEffect, useState } from "react";

interface Employee{
    id:string;
    email:string;
    role:string;
}

interface AuthContextType{
    employee:Employee|null;
    logout:()=>Promise<void>;
    loading:boolean;
    checkAuth:()=>Promise<void>
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children:React.ReactNode;})=>{
    const [employee,setEmployee]=useState<Employee | null>(null);
    const [loading,setLoading]=useState(true);

    //logout
    const logout=async()=>{
        await fetch("http://localhost:5000/api/auth/logout",{
            method:"POST",
            credentials:"include"
        })
        setEmployee(null);
    }

    //check Auth on refresh
    const checkAuth=async()=>{
        setLoading(true);
        try{
            const res=await fetch("http://localhost:5000/api/auth/me",{
                method:"GET",
                credentials:"include"
            })
            if(!res.ok){
                setEmployee(null);
                setLoading(false);
                return;
            }
            const data=await res.json();
            setEmployee(data.employee);
            setLoading(false);
        }catch(err){
            setEmployee(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        checkAuth();
    },[])

    return (
        <AuthContext.Provider value={{employee,logout,loading,checkAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}