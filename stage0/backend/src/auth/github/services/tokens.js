import jwt from "jsonwebtoken";

export default class TokenService {
    // Service methods for handling GitHub tokens
    static {
        this.access = "gh_access_token";
        this.refresh = "gh_refresh_token";
    }

    static genAccessToken(payload, expiresIn = "3mins") {
        return jwt.sign(payload, this.access, { expiresIn });
    }

    static genRefreshToken(payload, expiresIn = "5mins") {
        return jwt.sign(payload, this.refresh, { expiresIn });
    }

    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.access);
        } catch (err) {
            console.log("Access token verification failed", err);
            throw err;
        }
    }

    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refresh);
        } catch (err) {
            console.log("Refresh token verification failed", err);
            throw err;
        }
    }
}