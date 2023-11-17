// trail information model
module.exports = (sequelize, type) =>{
    return sequelize.define('trail',
    {
        id:
        {
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        image_URL: {
            type: type.STRING,
            allowNull: false
        },
        image_URL2: {
            type: type.STRING,
            allowNull: false
        },
        image_URL3: {
            type: type.STRING,
            allowNull: false
        },
        image_URL4: {
            type: type.STRING,
            allowNull: false
        },
        image_URL5: {
            type: type.STRING,
            allowNull: false
        },
        audio_URL: {
            type: type.STRING,
            allowNull: false
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        description: {
            type: type.STRING,
            allowNull: false
        },
        mileage: {
            type: type.FLOAT,
            allowNull: false
        },
        rating: {
            type: type.TINYINT,
            defaultValue: 0
        },
        is_wheelchair_accessible: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    });
};