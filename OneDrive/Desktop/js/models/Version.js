module.exports = (sequelize, type) =>{
    return sequelize.define('version',
    {
        id:
        {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        db_version: {
            type: type.STRING,
            allowNull: false
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
};