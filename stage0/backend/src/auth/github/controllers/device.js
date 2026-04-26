import GitHubDeviceServices from "../services/device.js";

export const GitHubDeviceAuth = async (req, res) => {
    try {
        const deviceCodeResponse = await GitHubDeviceServices.getDeviceCode();

        res.cookie("gh_device_tokens", {
            device_code: deviceCodeResponse.device_code,
            user_code: deviceCodeResponse.user_code
        }, { httpOnly: true, secure: true, sameSite: "strict" });

        res.redirect(deviceCodeResponse.verification_uri);
        
        return res.json({
            code: deviceCodeResponse.user_code,
            uri: deviceCodeResponse.verification_uri
        });        
    } catch (err) {
        console.log("err object", err)
        throw err;
    }
}