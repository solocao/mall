/**
 * Created by leiyin on 2017/03/13.
 */
module.exports = function (sequelize, DataTypes) {
    const Record = sequelize.define('Record', {
        record_id: {
            type: DataTypes.INTEGER(14),
            comment: "记录标识",
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        awards: {
            type: DataTypes.TEXT,
            comment: "选择奖项"
        },
        jobs: {
            type: DataTypes.STRING(255),
            comment: "就业意向"
        },
        tags: {
            type: DataTypes.STRING(255),
            comment: "个性标签"
        },
        dis_tags: {
            type: DataTypes.STRING(255),
            comment: "政策计划"
        },
        skills: {
            type: DataTypes.STRING(255),
            comment: "行业"
        },
        carethings: {
            type: DataTypes.STRING(255),
            comment: "关心事项"
        },
        user_type: {
            type: DataTypes.STRING(255),
            comment: "用户身份(1:行业大牛,2:领域精英,3:学生党)"
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            comment: "用户标示"
        },
    }, {
            tableName: 'common_records',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function associate(models) {
                }
            }
        });
    return Record;
};
