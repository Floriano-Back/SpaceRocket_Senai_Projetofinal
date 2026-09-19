import { Router } from "express";
import passageiroController from "../controllers/passageiroController.js";
//import authMiddleware from "../middlewares/authMiddleware.js";
//import authAdminMiddleware from "../middlewares/authAdminMiddleware.js";
//import passageiroController from "../controllers/passageiroController.js";

const passageiroRoutes = Router ();

passageiroRoutes.get("/", passageiroController.selecionar);
passageiroRoutes.post("/", passageiroController.criar);
passageiroRoutes.delete("/:id_passageiro", passageiroController.apagar);
passageiroRoutes.put("/:id_passageiro", passageiroController.atualizar);

export default passageiroRoutes;