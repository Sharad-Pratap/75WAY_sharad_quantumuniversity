import { Request , Response} from "express";

const checkLogin = (req : Request , res : Response , next: ()=>void) => {
    const checkLogin = req.cookies.accessToken;
    if(!checkLogin){
        res.status(401).json({error:"Unauthorized Login First"});
    }
    else{
        next();
    }
}
export default checkLogin;