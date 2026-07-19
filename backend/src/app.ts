import express from 'express';
import cors from 'cors';
import type { Application,Request,Response } from 'express';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import cookieParser from 'cookie-parser';
import dashboardRoutes from './routes/dashboard.routes.js';
import uploadRoutes from "./routes/upload.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app:Application=express();
app.use(
 "/uploads",
 express.static(path.join(__dirname,"../uploads"))
);
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/upload",uploadRoutes);

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"Employee Management System Running"});
})

export default app;