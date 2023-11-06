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
        title:
        {
            type: type.STRING,
            allowNull: false
        },
        Achieve1: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        Achieve2: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        Achieve3: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        }
    },
    {
        freezeTableName: true,                                              
        timestamps: false,                                                  

    });
}
