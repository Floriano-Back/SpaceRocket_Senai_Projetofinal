import jwt from "jsonwebtoken";
import 'dotenv/config';

async function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            msg: "Você não possui autorização para entrar nesse local"
        })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: "Negado!!!"
        })
    }
}

export default authMiddleware;