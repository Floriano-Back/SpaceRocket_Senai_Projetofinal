import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import usersServices from '../services/usersServices.js';

const usersAuthControllers = {
    login: async (req, res) => {
        try{
            const {email, senha_hash} = req.body;
            
            const userExists = await usersServices.usuarioPorEmail(email);
            console.log(userExists);
        
            if(!userExists || userExists.length === 0){
                return res.status(400).json({msg: "Senha ou email estão incorretos"})
            }
            
            const validPasword = await bcrypt.compare(senha_hash, userExists[0].senha_hash);

            if(!validPasword){
                return res.status(400).json({
                    msg: "Senha ou email estão incorretos"
                })
            }

            const acessToken = jwt.sign(
                {
                    id_usuario: userExists[0].id_usuario,
                    name: userExists[0].name,
                    email: userExists[0].email,
                    tipo_usuario: userExists[0].tipo_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '15m'
                }
            )

            res.status(200).json({
                msg: "Login efetuado!",
                token: acessToken
            });

        }catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Ocorreu um erro no Servidor",
                errormenssage: error.menssage
            });
        }
    }
}

export default usersAuthControllers;