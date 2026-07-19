import app from "./app.js";
import pool from "./db/connection.js";

const PORT=process.env.PORT || 5000;

async function startServer(){
    try{
        await pool.query("SELECT 1");
        console.log("Postgres connected");
        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        })
    }catch(err){
        console.error(err);
    }
}

startServer();