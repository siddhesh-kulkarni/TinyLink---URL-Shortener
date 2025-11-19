import { DataTypes } from "sequelize";
import { sequelize } from "@/app/lib/db";

const Link = sequelize.define(
  "Link",
  {
    code: {
      type: DataTypes.STRING(8),
      primaryKey: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastClicked: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "links",
    timestamps: false,
  }
);

export { Link };