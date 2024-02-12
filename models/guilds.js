const { DataTypes, Model } = require("sequelize");

module.exports = class guilds extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        guildId: {
          type: DataTypes.STRING,
        },
        membercount: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        timestamps: false,
        tableName: "discord_guilds",
        sequelize,
      },
    );
  }
};
