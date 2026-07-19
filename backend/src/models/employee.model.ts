import { stat } from "node:fs";
import pool from "../db/connection.js";

export const getLastEmployeeId=async()=>{
    const result=await pool.query(`SELECT employee_id FROM employees ORDER BY employee_id DESC LIMIT 1`);
    if(result.rowCount===0){
        return "EMP001";
    }

    const lastEmployeeId=result.rows[0].employee_id;
    const number=parseInt(lastEmployeeId.replace("EMP",""));
    return `EMP${String(number+1).padStart(3,"0")}`;
}

export const insertEmployee=async(employee_id:string,name:string,email:string,password_hash:string,phone:string,department:string,designation:string,salary:number,joining_date:string,status:string,role:string,manager_id:string|null,profile_image:string|null)=>{
    const result=await pool.query(`INSERT into employees(employee_id,name,email,password_hash,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image`,[employee_id,name,email,password_hash,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image]);
    return result.rows[0];
}

export const selectAllEmployees=async()=>{
    const result=await pool.query(`SELECT id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image FROM employees ORDER BY employee_id ASC`);
    return result.rows;
}

export const selectEmployeeById=async(id:string)=>{
    const result=await pool.query(`SELECT id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image FROM employees WHERE id=$1`,[id]);
    return result.rows[0];
}

export const updateEmployee=async(id:string,name:string,email:string,phone:string,department:string,designation:string,salary:number,joining_date:string,status:string,role:string,manager_id:string|null,profile_image:string|null)=>{
    const result=await pool.query(`UPDATE employees SET name=$1,email=$2,phone=$3,department=$4,designation=$5,salary=$6,joining_date=$7,status=$8,role=$9,manager_id=$10,profile_image=$11 WHERE id=$12 RETURNING id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image`,[name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image,id]);
    return result.rows[0];
}

export const deleteEmployee=async(id:string)=>{
    const result=await pool.query(`DELETE from employees where id=$1 RETURNING id,employee_id,name,email,role`,[id]);
    return result.rows[0];
}

export const getDashboardStats=async()=>{
    const [totalEmployees,activeEmployees,inactiveEmployees,departmentCount]=await Promise.all([
        pool.query(`SELECT COUNT(*) FROM employees`),
        pool.query(`SELECT COUNT(*) FROM employees WHERE status='ACTIVE'`),
        pool.query(`SELECT COUNT(*) FROM employees WHERE status='INACTIVE'`),
        pool.query(`SELECT COUNT(distinct DEPARTMENT) FROM employees`)
    ]);
     return {
        totalEmployees:Number(totalEmployees.rows[0].count),
        activeEmployees:Number(activeEmployees.rows[0].count),
        inactiveEmployees:Number(inactiveEmployees.rows[0].count),
        departmentCount:Number(departmentCount.rows[0].count)
     }
}

export const getEmployeesWithFilter=async(search?:string,department?:string,role?:string,status?:string,sort?:string,order?:string)=>{
    let query=`SELECT id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image FROM employees WHERE 1=1`;
    const values:any[]=[];
    if(search){
        values.push(`%${search}%`);
        query+=` AND (name ILIKE $${values.length} OR email ILIKE $${values.length})`
    }
    if(department){
        values.push(`%${department}%`);
        query+=` AND (department ILIKE $${values.length})`;
    }

    if(role){
        values.push(`%${role}%`);
        query+=` AND role =$${values.length}`;
    }

    if(status){
        values.push(`%${status}%`);
        query+=` AND status=$${values.length}`;
    }

    const allowedSortFields=["name","employee_id","department","designation","salary","joining_date","status","role"];
    if(sort && allowedSortFields.includes(sort)){
        const sortOrder=order?.toUpperCase()==="DESC"?"DESC":"ASC";
        query+=` ORDER BY ${sort} ${sortOrder}`;
    }else{
        query+=` ORDER BY employee_id DESC`;
    }

    const result=await pool.query(query,values);
    return result.rows;
}

export const assignManager=async(employeeId:string,managerId:string)=>{
    const result=await pool.query(`UPDATE employees SET manager_id=$1 WHERE id=$2 RETURNING *`,[managerId,employeeId]);
    return result.rows[0];
}

//this query is for validating assign manager
export const findEmployeeById=async(id:string)=>{
    const result=await pool.query(`SELECT id,name,manager_id FROM employees WHERE id=$1`,[id]);
    return result.rows[0];
}

export const checkCircularReporting=async(employeeId:string,managerId:string)=>{
    let currentManager=managerId;
    while(currentManager){
        if(currentManager===employeeId){
            return true;
        }
        const result=await pool.query(`SELECT manager_id from employees WHERE id=$1`,[currentManager]);
        currentManager=result.rows[0]?.manager_id;
    }
    return false;
}

export const getReportees=async(managerId:string)=>{
    const result=await pool.query(`SELECT id,employee_id,name,email,phone,department,designation,role FROM employees WHERE manager_id=$1`,[managerId]);
    return result.rows;
}

export const getOrganizationTree=async(employeeId:string)=>{
    const employeeResult=await pool.query(`SELECT id,employee_id,name,email,phone,department,designation,role FROM employees WHERE id=$1`,[employeeId]);
    const employee=employeeResult.rows[0];
    if(!employee){
        return null;
    }
    const reporteesResult=await pool.query(`SELECT id FROM employees WHERE manager_id=$1`,[employeeId]);
    const reportees=[];
    for(const reportee of reporteesResult.rows){
        const child:any=await getOrganizationTree(reportee.id);
        reportees.push(child);
    }

    return {
        ...employee,reportees
    }
}

export const getEmployeeProfile = async (employeeId: string) => {
    const result = await pool.query(`SELECT e.id,e.employee_id,e.name,e.email,e.phone,e.department,e.designation,e.salary,e.joining_date,e.status,e.role,e.profile_image,m.name AS reporting_manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id WHERE e.id = $1`,[employeeId]);
    return result.rows[0];
};