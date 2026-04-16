import Profile from "./profile.model.js";

const models = { Profile };

Object.values(models).forEach(model => {
    if(typeof model === "function") {
        model.associate(models);
    }
})

export default models;