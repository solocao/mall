/**
 * Created by leiyin on 2017/03/13.
 */
module.exports = function (sequelize, DataTypes) {
    const Portal = sequelize.define('Portal', {
        portal_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            comment: "门户名"
        },
        description: {
            type: DataTypes.STRING,
            comment: "描述"
        },
        protocol: {
            type: DataTypes.STRING,
            comment: "协议"
        },
        host: {
            type: DataTypes.STRING,
            comment: "主机地址(多个用分号分隔)"
        },
        logo: {
            type: DataTypes.STRING,
            comment: "logo图片"
        },
        auth_type: {
            type: DataTypes.ENUM('local', 'remote'),
            default: 'local',
            comment: "用户账号验证方式"
        }
    }, {
        tableName: 'system_portals',
        timestamps: false,
        underscored: true
    });
    return Portal;
};