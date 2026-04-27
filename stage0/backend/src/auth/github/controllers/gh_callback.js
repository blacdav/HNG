import { sequelize } from "../../../db/index.js";
import models from "../../../models/index.model.js";
import GitHubDeviceServices from "../services/device.js";
import TokenService from "../services/tokens.js";
import GitHubWebServices from "../services/web.js";

const { User } = models;

export const GhCallbackAuth = async (req, res) => {
    // controllers receives code from github oauth, 
    // exchanges it for access and refresh tokens, 
    // creates user in db if not exists, and returns tokens to client

    const { code, state } = req.query || req.body;

    // Verify the state parameter to prevent CSRF attacks
    const storedState = req.cookies.gh_oauth_state;
    if (!storedState.state || state !== storedState.state) {
        return res.status(400).json({
            status: "error",
            message: "Invalid state parameter"
        });
    }

    try {
        const token = await GitHubWebServices.exchangeCodeForToken(code, storedState.code_verifier);

        const user_info = await GitHubWebServices.getUserInfo(token.access_token);

        const [user, created] = await sequelize.transaction(async t => {
            return await User.findOrCreate({
                where: { github_id: user_info.id },
                defaults: {
                    github_id: user_info.id,
                    username: user_info.login,
                    email: user_info.email,
                    avatar_url: user_info.avatar_url,
                    last_login_at: new Date()
                },
                transaction: t
            })
        });

        const access_token = await TokenService.genAccessToken({ github_id: user_info.id, role: user.role });
        const refresh_token = await TokenService.genRefreshToken({ github_id: user_info.id });

        res.cookie("access_token", access_token, { httpOnly: true, secure: true, sameSite: "strict" });

        res.cookie("refresh_token", refresh_token, { httpOnly: true, secure: true, sameSite: "strict" });

        return res.json({ data: user });
    } catch (err) {
        console.log("err object", err);
        throw err;
    }
}

export const GhDeviceCallbackAuth = async (req, res) => {
    // this controller will handle the callback for the device flow
    // it will exchange the device code for an access token, and return it to the client
    const { device_code } = req.query || req.body;

    if (!device_code) {
        return res.status(400).json({
            status: "error",
            message: "Device code not found in cookies"
        });
    }

    try {
        const tokenResponse = await GitHubDeviceServices.getTokenForDevice(device_code);
        if (tokenResponse.error) {
            return res.status(400).json({
                status: "error",
                message: tokenResponse.error_description || "Error exchanging device code for token"
            });
        }

        const user_info = await GitHubWebServices.getUserInfo(tokenResponse.access_token);

        const [user, created] = await sequelize.transaction(async t => {
            return await User.findOrCreate({
                where: { github_id: user_info.id },
                defaults: {
                    github_id: user_info.id,
                    username: user_info.login,
                    email: user_info.email,
                    avatar_url: user_info.avatar_url,
                    last_login_at: new Date()
                },
                transaction: t
            })
        });

        const access_token = await TokenService.genAccessToken({ github_id: user_info.id, role: user.role });
        const refresh_token = await TokenService.genRefreshToken({ github_id: user_info.id });

        return res.json({
            status: "success",
            message: "Device code exchanged for token successfully",
            data: user,
            tokens: {
                access_token,
                refresh_token
            }
        });
    } catch (err) {
        console.log("err object", err);
        throw err;
    }
}