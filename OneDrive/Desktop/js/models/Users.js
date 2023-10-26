// user model
module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            allowNull: false
        },
        first_name:{
            type: type.STRING,
            allowNull: false
        },
        last_name:{
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        question1: {
            type: type.STRING, 
            allowNull: false
        },
        question2: {
            type: type.STRING, 
            allowNull: false
        },
        answer1: {
            type: type.STRING, 
            allowNull: false
        },
        answer2: {
            type: type.STRING, 
            allowNull: false
        }
    },
    {
        freezeTableName: true,                                              //takes away auto pluralization
        timestamps: false,                                                  // takes away timestamps in table
    });
};