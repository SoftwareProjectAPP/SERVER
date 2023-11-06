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
        SandyTrailComplete: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        LakeLoopComplete: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        FernComplete: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        LoneStarComplete: 
        {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        },
        NorthwesternComplete: 
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
