"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    const {employee,loading}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if(loading)
            return;
        if(!employee){
            router.replace("/login");
        }
    },[employee,loading,router]);

    if(loading){
        return <div>Loading...</div>
    }

    if(!employee){
        return null;
    }

    return <>{children}</>
}