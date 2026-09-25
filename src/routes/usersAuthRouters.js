import { Router } from "express";
import usersAuthControllers from "../controllers/usersAuthControllers.js";

const usersAuthRouters = Router();

usersAuthRouters.post('/login', usersAuthControllers.login);

export default usersAuthRouters;