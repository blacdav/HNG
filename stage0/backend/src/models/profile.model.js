import { sequelize } from "../db/index.js";
import { DataTypes, Model } from "sequelize";

class Profile extends Model {
    static associate(models) {}
}


Profile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false
    },
    gender_probability: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sample_size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age_group: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country_probability: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    indexes: [
        {
            fields: ["age_group", "gender", "country_id"]
        }
    ],
    underscored: true,
    modelName: "Profile",
    tableName: "profile"
})

export default Profile;