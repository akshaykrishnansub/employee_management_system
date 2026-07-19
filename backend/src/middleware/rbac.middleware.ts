import type { Request,Response,NextFunction } from "express"
import type {AuthRequest} from "./auth.middleware.js"

export const authorizeRoles=(...allowedRoles:string[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        const employee=req.employee;
        if(!employee){
            return res.status(401).json({error:"Authentication Required"});
        }

        if(!allowedRoles.includes(employee.role)){
            return res.status(403).json({error:"Access Denied"});
        }
        next();
    }
}