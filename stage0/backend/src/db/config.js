// import { sequelize } from "./index.js";

// export const dbConn = async () => {
//   try {
//     await sequelize.authenticate();
//     // await sequelize.sync({ alter: true });
//     console.log("Database connected successfully");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     throw err;
//     // process.exit(1);
//   }
// };

import { sequelize } from "./index.js";

let isConnected = false;

export const dbConn = async () => {
  if (isConnected) return;

  try {
    await sequelize.authenticate();
    isConnected = true;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("FULL DB ERROR:", {
      name: err?.name,
      message: err?.message,
      code: err?.original?.code,
      errno: err?.original?.errno,
      sqlState: err?.original?.sqlState,
      host: err?.original?.address,
      port: err?.original?.port,
    });

    console.error("Database connection failed:", err);
    throw err;
  }
};