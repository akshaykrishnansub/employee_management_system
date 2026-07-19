import type { Request,Response } from "express";
import { findEmployeeByEmail, findEmployeeById } from "../models/auth.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getEmployeeProfile } from "../models/employee.model.js";

interface AuthRequest extends Request{
    employee?:{
        id:string;
        role:string;
    }
}
export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        const employee=await findEmployeeByEmail(email);
        if(!employee){
            return res.status(404).json({error:'User not found'});
        }

        const matchedPassword=await bcrypt.compare(password,employee.password_hash);
        if(!matchedPassword){
            return res.status(401).json({error:'Invalid Credentials'});
        }

        const token=jwt.sign({id:employee.id,role:employee.role},process.env.JWT_SECRET!,{expiresIn:'1d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge:24*60*60*1000
        })

        res.json({message:"Login Successful",token,employee:{id:employee.id,name:employee.name,role:employee.role}})
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const getProfile=async(req:AuthRequest,res:Response)=>{
    try{
         const employeeId=req.employee?.id;
         if(!employeeId){
            return res.status(401).json({error:"Authentication failed"});
        }
        const employee=await findEmployeeById(employeeId);
        if(!employee){
            return res.status(404).json({error:"Employee not found"});
        }
        return res.json({employee});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const logout=async(req:AuthRequest,res:Response)=>{
    try{
        res.clearCookie('token',{
            path:"/",
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })
        res.json({message:'Logged out successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const viewProfile = async (req: AuthRequest, res: Response) => {
    try {
        const employee = await getEmployeeProfile(req.employee!.id);

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found",
            });
        }

        res.json({
            message: "Profile fetched successfully",
            employee,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
};