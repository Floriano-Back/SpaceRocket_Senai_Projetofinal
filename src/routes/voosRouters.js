import { Router } from "express";
import voosControllers from "../controllers/voosControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";

const voosRouters = Router();

voosRouters.get("/all", authMiddlewares, authAdminMiddlewares, voosControllers.listarTodos);

voosRouters.get("/", voosControllers.listarDisponiveis);

voosRouters.post(
  "/",authMiddlewares,authAdminMiddlewares,voosControllers.cadastrar
);
voosRouters.get("/:id", voosControllers.buscarPorId);

voosRouters.put(
  "/:id",
  authMiddlewares,
  authAdminMiddlewares,
  voosControllers.atualizar
);

voosRouters.delete(
  "/:id",
  authMiddlewares,
  authAdminMiddlewares,
  voosControllers.deletar
);

export default voosRouters;