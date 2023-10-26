// achievement model
module.exports = (sequelize, type) => {
    return sequelize.define('Achievements', 
    {
        id:
        {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:{
            type: type.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,                                              
        timestamps: false,                                                  

    });
}