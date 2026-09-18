import {Router} from "express";
import usersControllers from "../controllers/usersControllers.js";

const usersRouters = Router();

usersRouters.get("/", usersControllers.selecionar);
usersRouters.post("/", usersControllers.cadastrar);

export default usersRouters;