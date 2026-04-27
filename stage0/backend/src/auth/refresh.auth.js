import models from "../models/index.model.js";
import TokenService from "./github/services/tokens.js";

const { User } = models;

export const RefreshAuth = () => {
    // receives a json body with refresh token, 
    // creates and return new access and refresh tokens
    const { refresh_token } = req.body;

    try {
        const payload = TokenService.verifyRefreshToken(refresh_token);

        const { github_id } = payload;

        const access_token = TokenService.genAccessToken({ github_id });

        const new_refresh_token = TokenService.genRefreshToken({ github_id });

        res.cookie("access_token", {}, { httpOnly: true, secure: true, sameSite: "strict" })

        return res.json({
            status: "success",
            message: "Tokens refreshed successfully",
            data: {
                access_token,
                refresh_token: new_refresh_token
            }
        });
    } catch (err) {
        console.error("Error refreshing tokens:", err);
        return res.status(400).json({
            status: "error",
            message: "Invalid refresh token"
        });
    }
}