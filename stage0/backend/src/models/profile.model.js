import { sequelize } from "../db/index.js";
import { DataTypes, Model } from "sequelize";
import { v7 as uuidv7 } from "uuid";

class Profile extends Model {
    static associate(models) {}
}


Profile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false
    },
    gender_probability: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sample_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    age_group: {
        type: DataTypes.ENUM("child", "teenager", "adult", "senior"),
        allowNull: false
    },
    country_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country_probability: {
        type: DataTypes.INTEGER,
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