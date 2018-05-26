/**
 * Created by leiyin on 2017/03/13.
 */
module.exports = function (sequelize, DataTypes) {
    var OAuthScope = sequelize.define('OAuthScope', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        scope: DataTypes.STRING(80),
        is_default: DataTypes.BOOLEAN
    }, {
        tableName: 'oauth_scopes',
        timestamps: false,
        underscored: true
    })

    return OAuthScope;
}