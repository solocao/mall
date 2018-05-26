/**
 * Created by leiyin on 2017/03/13.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('Role', {
        role_id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(50),
            comment: "��ɫ����"
        },
        description: {
            type: DataTypes.STRING(180),
            comment: "����"
        }
    }, {
        tableName: 'security_roles',
        timestamps: true,
        underscored: true,
        classMethods: {
            associate: function (models) {
            }
        }
    });

    return Role;
};
