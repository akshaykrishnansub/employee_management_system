import type { AuthRequest} from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { findEmployeeByEmail } from "../models/auth.model.js";
import bcrypt from 'bcrypt';
import { assignManager, checkCircularReporting, deleteEmployee, findEmployeeById, getEmployeeProfile, getEmployeesWithFilter, getLastEmployeeId, getOrganizationTree, getReportees, insertEmployee, selectAllEmployees, selectEmployeeById, updateEmployee } from "../models/employee.model.js";

export const createEmployee=async(req:AuthRequest,res:Response)=>{
    try{
        const {name,email,password,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image}=req.body;
        if(!name||!email||!password||!phone||!department||!designation||!salary||!joining_date||!status||!role){
            return res.status(400).json({error:"All required fields are mandatory"});
        }
        if(req.employee?.role==="HR_MANAGER" && role==="SUPER_ADMIN"){
            return res.status(403).json({error:"HR cannot create Super Admin"});
        }
        const existingEmployee=await findEmployeeByEmail(email);
        if(existingEmployee){
            return res.status(409).json({error:"Email Already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const employeeId=await getLastEmployeeId();

        const employee=await insertEmployee(employeeId,name,email,hashedPassword,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image);
        return res.status(201).json({message:'Employee created successfully',employee})
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const getAllEmployees=async(req:AuthRequest,res:Response)=>{
    try{
        const employees=await selectAllEmployees();
        return res.status(200).json({message:'Employees fetched successfully',employees});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const getEmployeeById=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const employee=await selectEmployeeById(id as string);
        if(!employee){
            return res.status(404).json({error:'Employee not found'});
        }
        return res.status(200).json({employee});
    }catch(err){
        console.error;
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const updateEmployeeDetails=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const {name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image}=req.body;
        const employee=await selectEmployeeById(id as string);
        if(!employee){
            return res.status(404).json({error:"Employee not found"});
        }

        if(req.employee?.role==="EMPLOYEE" && req.employee.id!==id){
            return res.status(403).json({error:"You can only update your own profile"});
        }

        if(req.employee?.role==="HR_MANAGER" && role==="SUPER_ADMIN"){
            return res.status(403).json({error:"HR cannot assign Super Admin Role"});
        }

        if(req.employee?.role==="EMPLOYEE"){
            if(department || designation || salary || role || manager_id || status){
                return res.status(403).json({error:"Employees can only update their phone and profile image"});
            }
        }

        const updatedEmployee=await updateEmployee(id as string,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image);
        return res.status(200).json({message:"Employee updated successfully",employee:updatedEmployee});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const deleteEmployeeDetails=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        if (req.employee?.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                error: "Only Super Admin can delete employees",
            });
        }

        // Prevent self deletion
        if (req.employee.id === id) {
            return res.status(400).json({
                error: "Super Admin cannot delete their own account",
            });
        }

        const employee=await selectEmployeeById(id as string);
        if(!employee){
            return res.status(404).json({error:'Employee not found'});
        }
        const deletedEmployee=await deleteEmployee(id as string);
        return res.status(200).json({message:'Employee deleted successfully',employee:deletedEmployee});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const getEmployeesWithFilterController=async(req:AuthRequest,res:Response)=>{
    try{
        const {search,department,role,status,sort,order}=req.query;
        const employees=await getEmployeesWithFilter(search as string,department as string,role as string,status as string,sort as string,order as string);
        return res.status(200).json({employees});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const assignEmployeeManager=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const {managerId}=req.body;
        if(id===managerId){
            return res.status(400).json({error:'Employee cannot be their own manager'});
        }
        const manager=await findEmployeeById(managerId);
        if(!manager){
            return res.status(404).json({error:"Manager not found"});
        }
        const circular=await checkCircularReporting(id as string,managerId);
        if(circular){
            return res.status(400).json({error:"Circular Reporting not allowed"});
        }
        const employee=await assignManager(id as string,managerId);
        res.status(200).json({message:"Manager Assigned Successfully",employee});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const getEmployeeReportees=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const reportees=await getReportees(id as string);
        return res.status(200).json({reportees});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const getEmployeeTree=async(req:AuthRequest,res:Response)=>{
    try{
        console.log("Inside getEmployeeTree");
        console.log("Params:", req.params);
        console.log("ID:", req.params.id);
        const {id}=req.params;
        const tree=await getOrganizationTree(id as string);
        if(!tree){
            return res.status(404).json({error:'Employee not found'});
        }
        return res.status(200).json(tree);
    }catch(err:any){
        console.error("getEmployeeTree Error:", err);

    return res.status(500).json({
        error: err.message,
        stack: err.stack,
    });
    }
}

