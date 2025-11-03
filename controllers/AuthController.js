import jwt from "jsonwebtoken";
import UserService from "../services/UserService.js";

const SECRET_KEY = process.env.JWT_SECRET;

const userService = new UserService();

class AuthController
{
    constructor(){
        this.userService = userService; 
    }
    async login(req, res){
        //const email = req.params.email;
        //const password = req.params.password;
        try{
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if(!user){
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            if(user.activo !== 'active'){
                return res.status(403).json({ message: 'Cuenta está inactiva, confirme su acceso'});
            }

            const isPasswordValid = await this.userService.validateCredentials(email, password);
            if (!isPasswordValid){
                return res.status(401).json({ message: 'Contraseña o email incorrecto'});
            }

            const token = jwt.sign(
                 { id: user.id, email: user.email },
                 SECRET_KEY,
                 { expiresIn: '1h'}
            );

            res.status(200).json({
                message: 'Login realizado con suceso',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    activo: user.activo
                }
            });
        } catch(error){
            res.status(500).json({ message: 'Erro al autenticar', error: error.message})
        }
    }

    async logout(req, res){
        res.status(200).json({ message: 'Logout efectuado con suceso' });
    }
}

export default new AuthController();