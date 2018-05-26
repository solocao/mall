/**
 * Created by leiyin on 2017/03/13.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
    const Permission = sequelize.define('Permission', {
        permission_id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        resource_type: {
            type: DataTypes.STRING(50),
            comment: "资源类型 menu"
        },
        resource_id: {
            type: DataTypes.STRING(50),
            comment: "资源ID menu_id"
        },
        credential_type: {
            type: DataTypes.STRING(50),
            comment: "凭证类型 role"
        },
        credential_id: {
            type: DataTypes.STRING(50),
            comment: "凭证ID role_id"
        }
    }, {
        tableName: 'security_permissions',
        indexes: [
        ],
        timestamps: true,
        underscored: true,
        classMethods: {
            associate: function (models) {
                
            }
        }
    });

    return Permission;
};
