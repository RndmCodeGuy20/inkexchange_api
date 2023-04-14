import { Router } from "express";
import { methodNotAllowed } from "#middlewares/index";
import { controller as api } from "./controller";

const router = new Router();

router.route("/something").get(api.getSomething);

module.exports = router;
