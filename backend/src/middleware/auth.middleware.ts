import type { NextFunction, Request,Response } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request{
    employee?:{
        id:string;
        role:string;
    }
}

export const authenticateToken=(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Access Denied"});
    }
    try{
        console.log("Token:",token)
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as {id:string,role:string}
        console.log(decoded);
        req.employee=decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(403).json({error:"Invalid Token"});
    }
}