import { sequelize } from "@/app/lib/db";
import { Link } from "@/app/models/Link";

export async function initDB() {
  await sequelize.authenticate();
  await Link.sync(); 
}
