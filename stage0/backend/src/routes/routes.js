import { Router } from "express";
import ProfileRoutes from "../profiles/routes/index.routes.js";
import ClassifyRoutes from "../classify/routes/index.route.js";

const router = Router();

router.use('/profiles', ProfileRoutes)
router.use('/classify', ClassifyRoutes)

export default router;