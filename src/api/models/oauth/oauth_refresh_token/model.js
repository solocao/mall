/**
 * Created by leiyin on 2017/03/13.
 */
'use strict';

module.exports = function RefreshTokenModel(sequelize, DataTypes) {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        refresh_token: DataTypes.STRING(256),
        expires: DataTypes.DATE,
        scope: DataTypes.STRING,
        type: { type: DataTypes.INTEGER },
        user_id: { type: DataTypes.INTEGER }
    }, {
        tableName: 'oauth_refresh_tokens',
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function associate(models) {
                RefreshToken.belongsTo(models.App, {
                    as: "app",
                    foreignKey: 'app_id'
                });
            }
        }
    });

    return RefreshToken;
};
