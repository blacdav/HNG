import { agify, genderize, nationalize } from "../../classify.js";
import { sequelize } from "../../db/index.js";
import models from "../../models/index.model.js";

const { Profile } = models;

export const CreateProfile = async (req, res) => {
    const { name } = req.body;

    if(!name) {
        return res.status(400).json({
            status: "error",
            message: "name feild is required!"
        })
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(422).json({
            status: "error",
            message: "Name must be a non-empty string."
        });
    }

    try {
        // check db if the name exist create or fetch the details.
        const profile = await Profile.findAll({ where: { name }});

        if (profile && profile.length > 0) {
            return res.json({
                status: "success",
                message: "profile already exists",
                data: profile
            })
        }

        const [g, a, n] = await Promise.all([
            genderize(name),
            agify(name),
            nationalize(name)
        ])

        if (!g.gender || g.count === 0) {
            return res.status(502).json({
                status: "false",
                message: "Genderize API returned invalid response"
            })
        }

        if (!a.age) {
            return res.status(502).json({
                status: "false",
                message: "Agify API returned invalid response"
            })
        }

        if (!n.country || n.country.length === 0) {
            return res.status(502).json({
                status: "false",
                message: "Nationalize API returned invalid response"
            })
        }

        const age_group = a.age >= 0 && a.age <= 12 ? "child" : a.age >= 13 && a.age <= 19 ? "teenager" : a.age >= 20 && a.age <= 59 ? "adult" : "senior"
        const country_probability = Math.round(n.country[0].probability * 100) / 100

        const t = await sequelize.transaction(async t => {
            return Profile.create({
                name,
                gender: g.gender,
                gender_probability: g.probability,
                sample_size: g.count,
                age: a.age,
                age_group,
                country_id: n.country[0].country_id,
                country_probability
            }, { transaction: t })
        })

        return res.status(201).json({
            status: "success",
            data: t
        });
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            const existing = await Profile.findOne({ where: { name } });

            return res.status(200).json({
                status: "success",
                message: "Profile already exists",
                data: existing
            });
        }

        console.log("Server Issue", err);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}