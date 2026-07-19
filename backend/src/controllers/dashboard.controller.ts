import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { getDashboardStats } from "../models/employee.model.js";

export const dashboardStats=async(req:AuthRequest,res:Response)=>{
    try{
        const stats=await getDashboardStats();
        return res.status(200).json({message:"Dashboard stats fetched successfully",stats});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}