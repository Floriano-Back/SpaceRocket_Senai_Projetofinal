import {Router} from "express";
import usersControllers from "../controllers/usersControllers.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const usersRouters = Router();

usersRouters.get("/", authMiddlewares, authAdminMiddlewares, usersControllers.selecionar);
usersRouters.post("/", usersControllers.cadastrar);
usersRouters.put("/:id_usuario", usersControllers.atualizar);
usersRouters.delete("/:id_usuario",authMiddlewares, authAdminMiddlewares, usersControllers.deletar);

export default usersRouters;