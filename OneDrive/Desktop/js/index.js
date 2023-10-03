// go to vscode cmd and type "npm init"
// then type in "npm install sequelize"
// then "npm install mysql2, then the code is ready to test using "node index.js""

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('logins', 'root', 'root', {             // logins is schema name and root is user and password for server
    //host:
    //port:
    dialect: 'mysql'
});

                                                                        //Proof of connection, Test using cmd: node index.js
/*sequelize.authenticate().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log("Error Connecting to Database")
})*/ 

//User Table
const Users = sequelize.define('user', {
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    achieve1: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
                                                                        // More for any Achievements
},

{
    freezeTableName: true,                                              //takes away auto pluralization
    timestamps: false,                                                  // takes away timestamps in table

});

// DELETES CONTENTS FROM TABLE
/*
Users.sync({alter: true}).then(() => {
    return Users.destroy({truncate: true});
}).then((data) => {
    console.log(data);
})
.catch((err) => {
    console.log(err);
});
*/


/*Users.sync({alter: true}).then((data) => {                              // create makes 1 entry, bulk does multiple
    return Users.create({
        username: "Bryan1",
        password: "Poop",
        achieve1: true
    }
)});
*/



// bulk add
///*
Users.sync({alter: true}).then((data) => {                              // Alter changes sql workshop with each run
    return Users.bulkCreate([{
        username: "Bryan",
        password: "Poop",
        achieve1: true
    },
    {
        username: "Lauren",
        password: "Shit",
        achieve1: true
    },
    {
        username: "Falynne",
        password: "Pee",
        achieve1: true
    },
    {
        username: "Ashley",
        password: "Piss",
        achieve1: true
    }
]); 


// message to show added users

}).then((data) => {
    console.log("Users added to database")
    data.forEach(element => {
        console.log(element.toJSON())                                   //data.toJSON shows changed to table in cmd, element used for bulk
    });
}).catch((err) => {
    console.log(err)
});
//*/

//console.log(sequelize.models.user);                                     // This prints user table in cmd