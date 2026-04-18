import models from "../../models/index.model.js";

const { Profile } = models;

export const FilterProfile = async (req, res) => {
    const { age_group, gender, country_id } = req.query;

    let filter = {};

    if (!age_group && !gender && !country_id) {
        const { count, rows:profile } = await Profile.findAndCountAll({ attributes: ["id", "name", "gender", "age", "age_group", "country_id"] })
        return res.status(200).json({
            status: "success",
            count,
            data: profile
        })
    }

    if (typeof age_group === "string" && age_group.trim() !== "") {
        filter.age_group = age_group.trim().toLowerCase();
    }

    if (typeof gender === "string" && gender.trim() !== "") {
        filter.gender = gender.trim().toLowerCase();
    }

    if (typeof country_id === "string" && country_id.trim() !== "") {
        filter.country_id = country_id.trim().toUpperCase();
    }

    try {
        const {count, rows:profile} = await Profile.findAndCountAll({
            where: filter,
            attributes: ["id", "name", "gender", "age", "age_group", "country_id"]
        });

        if (!profile || profile.length === 0) {
            return res.status(404).json({
                status: "success",
                message: "Profile not found!"
            })
        }

        return res.status(200).json({
            status: "success",
            count,
            data: profile
        })
    } catch (err) {        
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}