const moment = require('moment');
// authentication token model
module.exports = (sequelize, type, Users) => {
    return sequelize.define('auth_token',
    {
        id:
        {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        token:
        {
            type: type.STRING,
            allowNull:false,
            validate:
            {
                notEmpty:true
            }
        },
        user_id:{
            type: type.INTEGER,
            allowNull: false,
            references:
            {
                model:Users,
                key:'id'
            }
        },
        issue_date:
        {
            type: type.DATE,
            defaultValue: type.NOW
        },
        expiration_date:
        {
            type: type.DATE,
            defaultValue:moment().add(1,'days').toDate()
        }
    },{
        timestamps:false
    });
}