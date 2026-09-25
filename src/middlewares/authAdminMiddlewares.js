async function authAdminMiddlewares(req, res, next) {
    if(!req.user || req.user.tipo_usuario != "ADMIN"){
        return res.status(403).json({
            msg: "Acesso negado!"
        });
    }
    next();    
}

export default authAdminMiddlewares;