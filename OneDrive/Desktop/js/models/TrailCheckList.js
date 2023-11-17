// checklist information
// maps to trail
module.exports = (sequelize, type, Trail) => {
    return sequelize.define('trailchecklist',{
        id:
        {
          type: type.INTEGER,
          primaryKey:true,
          autoIncrement:true
        },
        item: {
            type: type.STRING,
            allowNull: false
        },
        trail_id:{
            type: type.INTEGER,
            allowNull: false,
            references: 
            {
                model: Trail,
                key: 'id'
            }
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
};