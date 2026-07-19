import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/profile-images");
    },

    filename:(req,file,cb)=>{
        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});


const upload = multer({
    storage,
    limits:{
        fileSize:2*1024*1024 //2MB
    },

    fileFilter:(req,file,cb)=>{

        const allowedTypes=[
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];

        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }
        else{
            cb(new Error("Only images allowed"));
        }
    }
});


export default upload;