import { Router } from "express";
import { GithubAuth } from "../github/controllers/web.js";
import { GhCallbackAuth, GhDeviceCallbackAuth } from "../github/controllers/gh_callback.js";
import { RefreshAuth } from "../refresh.auth.js";
import { GitHubDeviceAuth } from "../github/controllers/device.js";

const router = Router();

router.get('/github', GithubAuth);
router.get('/github/callback', GhCallbackAuth);
router.post('/refresh', RefreshAuth);
// router.post('/logout', LogoutAuth);
router.get('/github/device', GitHubDeviceAuth);
router.get('/github/device/callback', GhDeviceCallbackAuth);
// router.post('/logout', LogoutAuth);

export default router;