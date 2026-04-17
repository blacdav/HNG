export const CreateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "name field is required!"
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(422).json({
      status: "error",
      message: "Name must be a non-empty string."
    });
  }

  const cleanName = name.trim().toLowerCase();

  try {
    const existing = await Profile.findOne({ where: { name: cleanName } });

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "profile already exists",
        data: existing
      });
    }

    const [g, a, n] = await Promise.all([
      genderize(cleanName),
      agify(cleanName),
      nationalize(cleanName)
    ]);

    if (!g.gender || g.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize API returned invalid response"
      });
    }

    if (!a.age) {
      return res.status(502).json({
        status: "error",
        message: "Agify API returned invalid response"
      });
    }

    if (!n.country || n.country.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize API returned invalid response"
      });
    }

    const age_group =
      a.age <= 12 ? "child" :
      a.age <= 19 ? "teenager" :
      a.age <= 59 ? "adult" : "senior";

    const country_probability = Math.round(n.country[0].probability * 100) / 100;

    const created = await Profile.create({
      name: cleanName,
      gender: g.gender,
      gender_probability: g.probability,
      sample_size: g.count,
      age: a.age,
      age_group,
      country_id: n.country[0].country_id,
      country_probability
    });

    return res.status(201).json({
      status: "success",
      data: created
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const existing = await Profile.findOne({ where: { name: cleanName } });

      return res.status(200).json({
        status: "success",
        message: "profile already exists",
        data: existing
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message
    });
  }
};