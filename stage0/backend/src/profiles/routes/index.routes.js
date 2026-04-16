import { Router } from "express";
import { CreateProfile } from "../controllers/create.profile.js";
import { GetProfile } from "../controllers/get.profile.js";
import { DeleteProfile } from "../controllers/delete.profile.js";
import { FilterProfile } from "../controllers/filter.profile.js";

const router = Router();

router.post('/', CreateProfile);
router.get('/', FilterProfile);
router.get('/:id', GetProfile);
router.delete('/:id', DeleteProfile);

export default router;