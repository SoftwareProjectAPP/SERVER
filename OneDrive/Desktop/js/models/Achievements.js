// achievement model
module.exports = (sequelize, type, Users) => {
    return sequelize.define('Achievements',
    {
        id:
        {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        user_id:
        {
            type: type.INTEGER,
            allowNull: false,
            references:
            {
                model: Users,
                key: 'id'
            }
        },
        SandyTrailComplete:
        {
            type: type.BOOLEAN,
            defaultValue: false
        },
        LakeLoopComplete:
        {
            type: type.BOOLEAN,
            defaultValue: false
        },
        FernComplete:
        {
            type: type.BOOLEAN,
            defaultValue: false
        },
        LoneStarComplete:
        {
            type: type.BOOLEAN,
            defaultValue: false
        },
        NorthwesternComplete:
        {
            type: type.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    });
}
