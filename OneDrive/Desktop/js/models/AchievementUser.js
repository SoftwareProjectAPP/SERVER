// intermediary table
// acts as mapping between achievements and user
module.exports = (sequelize, type, Users, Achievements) =>{
    return sequelize.define('AchievementsUser',{
        id: {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        user_id: {
            type: type.INTEGER,
            allowNull: false,
            references: 
            {
                model: Users,
                key: 'id'
            }
        },
        achievements_id: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: Achievements,
                key: 'id'
            }
        }
    },
    {
        freezeTableName: true,                                              
        timestamps: false,                                                  
    
    });
}

