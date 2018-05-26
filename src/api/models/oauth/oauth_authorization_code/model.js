/**
 * Created by leiyin on 2017/03/13.
 */
'use strict';

const moment = require('moment');

module.exports = function AuthCodeModel(sequelize, DataTypes) {
    const OAuthAuthorizationCode = sequelize.define('OAuthAuthorizationCode', {
        id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        authorization_code: DataTypes.STRING(256),
        expires: DataTypes.DATE,
        redirect_uri: DataTypes.STRING(2000),
        scope: DataTypes.STRING,
        type: { type: DataTypes.INTEGER },
        user_id: { type: DataTypes.INTEGER }
    }, {
        tableName: 'oauth_authorization_codes',
        indexes: [
            { name: 'type_index', fields: ['type'] },
            { name: 'user_index', fields: ['user_id'] }
        ],
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function associate(models) {
                OAuthAuthorizationCode.belongsTo(models.OAuthClient, {
                    foreignKey: 'client_id'
                })
            }
        }
    });

    return OAuthAuthorizationCode;
};
