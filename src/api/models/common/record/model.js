/**
 * Created by leiyin on 2017/03/13.
 */
module.exports = function(sequelize, DataTypes) {
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
            type: DataTypes.STRING(50),
            comment: "选择奖项"
        },
        jobs: {
            type: DataTypes.STRING(255),
            comment: "就业意向"
        },
        tags: {
            type: DataTypes.STRING(255),
            comment: "就业意向"
        },
        skills: {
            type: DataTypes.STRING(255),
            comment: "专业"
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
