import pool from "../db/connection.js";

export const findEmployeeByEmail=async(email:string)=>{
    const result=await pool.query(`SELECT * from employees WHERE email=$1`,[email]);
    return result.rows[0];
}

export const findEmployeeById=async(id:string)=>{
    const result=await pool.query(`SELECT id,employee_id,name,email,phone,department,designation,salary,joining_date,status,role,manager_id,profile_image FROM employees WHERE id=$1`,[id]);
    return result.rows[0];
}