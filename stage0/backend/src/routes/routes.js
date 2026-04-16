import { Router } from "express";
import ProfileRoutes from "../profiles/routes/index.routes.js";

const router = Router();

router.use('/profiles', ProfileRoutes)
router.use('/classify', ProfileRoutes)

export default router;