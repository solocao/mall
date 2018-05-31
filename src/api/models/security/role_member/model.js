/**
 * Created by leiyin on 2017/03/13.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
    const RoleMember = sequelize.define('RoleMember', {
        member_id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.STRING(50),
            comment: "角色类型"
        },
        value: {
            type: DataTypes.STRING(50),
            comment: "值"
        }
    }, {
        tableName: 'security_role_members',
        indexes: [
            { name: 'unique_index', unique: true, fields: ['role_id', 'type', 'value']},
            { name: 'type_index', fields: ['type'] },
            { name: 'value_index', fields: ['value'] }
        ],
        timestamps: true,
        underscored: true,
        classMethods: {
            associate: function (models) {
                RoleMember.belongsTo(models.Role, {
                    as: "role",
                    foreignKey: 'role_id'
                });
            }
        }
    });

    return RoleMember;
};
