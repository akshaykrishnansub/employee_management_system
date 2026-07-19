import express from "express";
import multer from "multer";

const router = express.Router();


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    }
});


const upload = multer({
    storage
});


router.post(
    "/profile-image",
    upload.single("profile_image"),
    (req,res)=>{

        if(!req.file){
            return res.status(400).json({
                error:"No file uploaded"
            });
        }


        res.status(200).json({
            message:"Image uploaded successfully",
            filePath:`/uploads/${req.file.filename}`
        });
    }
);


export default router;