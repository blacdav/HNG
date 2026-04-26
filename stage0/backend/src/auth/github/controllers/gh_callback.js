import { sequelize } from "../../../db/index.js";
import models from "../../../models/index.model.js";
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
        return res.status(400).json({ error: "Invalid state parameter" });
    }

    try {
        const token = await GitHubWebServices.exchangeCodeForToken(code, storedState.code_verifier);

        const user_info = await GitHubWebServices.getUserInfo(token.access_token);

        sequelize.transaction(async t => (
            await User.findOrCreate(
                {
                    where: { github_id: user_info.id },
                    defaults: {
                        github_id: user_info.id,
                        username: user_info.login,
                        email: user_info.email,
                        avater_url: user_info.avatar_url,
                        last_login_at: new Date()
                    },
                    transaction: t
                }
            )
        ))

        return res.json({ data: user_info });
    } catch (err) {
        console.log("err object", err);
        throw err;
    }
}

export const GhDeviceCallbackAuth = async (req, res) => {
    // this controller will handle the callback for the device flow
    // it will exchange the device code for an access token, and return it to the client
    const { device_code } = req.cookies.gh_device_tokens;

    if (!device_code) {
        return res.status(400).json({ error: "Device code not found in cookies" });
    }

    return
}