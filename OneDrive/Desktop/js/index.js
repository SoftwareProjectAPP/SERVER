// go to vscode cmd and type "npm init"
// then type in "npm install sequelize"
// then "npm install mysql2, then the code is ready to test using "node index.js""

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('trailblazerdb', 'root', 'root',        //root is user and pass
{             
    //host: For google
    //port:
    dialect: 'mysql'
});

//Proof of connection, Also authenticates connection, Test using cmd: node index.js

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
},
{
    freezeTableName: true,                                              //takes away auto pluralization
    timestamps: false,                                                  // takes away timestamps in table

});

const Pictures = sequelize.define('pic', 
{
    id:
    {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 
        {
            model:Users,
            key:'user_id'
        }
    },
    image_URL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    audio_URL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    freezeTableName: true,                                              
    timestamps: false,                                                 

});

const Achievements = sequelize.define('Achievements', 
{
    id:
    {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 
        {
            model:Users,
            key:'user_id'
        }
    },
    Achieve1: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Achieve2: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Achieve3: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{
    freezeTableName: true,                                              
    timestamps: false,                                                  

});

const moment = require('moment');
const Auth = sequelize.define('auth_token',
{
    id:
    {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    token:
    {
      type: DataTypes.STRING,
      allowNull:false,
      validate:
      {
        notEmpty:true
      }
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:
      {
        model:Users,
        key:'user_id'
      }
    },
    is_valid:
    {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    },
    issue_date:
    {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expiration_date:
    {
      type: DataTypes.DATE,
      defaultValue:moment().add(1,'days').toDate()
    }
  },{
    timestamps:false
});


// DELETES CONTENTS FROM TABLE
async function deleteUsers() 
{
    await Users.sync({alter: true}).then(() => 
    {
        return Users.destroy({truncate: true});
        
    }).then((data) => 
    {
        console.log(data);
    })
    .catch((err) => 
    {
        console.log(err);
    });
}

async function deletePic() 
{
    await Pictures.sync({alter: true}).then(() => 
    {
        return Pictures.destroy({truncate: true});
    }).then((data) => 
    {
        console.log(data);
    })
    .catch((err) => 
    {
        console.log(err);
    });
}

async function deleteAchieve() 
{
    await Achievements.sync({alter: true}).then(() => 
    {
        return Achievements.destroy({truncate: true});
    }).then((data) => 
    {
        console.log(data);
    })
    .catch((err) => 
    {
        console.log(err);
    });
}

async function deleteAuth() 
{
    await Auth.sync({alter: true}).then(() => 
    {
        return Auth.destroy({truncate: true});
    }).then((data) => 
    {
        console.log(data);
    })
    .catch((err) => 
    {
        console.log(err);
    });
}

// ADD TO TABLE FOR TEST
async function adduser()
{
    await Users.sync({alter: true}).then((data) => {                            
    return Users.create({
        username: "Bryan1",
        password: "Poop",
        achieve1: true
    });
}).then((data) => {
    console.log(data.toJSON());
})
}

async function addpic()
{
    await Pictures.sync({alter: true}).then((data) => {                            
    return Pictures.create({
        user_id: 1,
        image_URL: "imagetest",
        audio_URL: "audiotest",
        Name: "Pic1"
    });
}).then((data) => {
    console.log(data.toJSON());
})
}

async function addachieve()
{
    await Achievements.sync({alter: true}).then((data) => {                            
    return Achievements.create({
        user_id: 1,
        achieve1: true,
        Achieve2: false,
        Achieve3: true
    });
}).then((data) => {
    console.log(data.toJSON());
})
}

async function addauth()
{
    await Auth.sync({alter: true}).then((data) => {                            
    return Auth.create({
        user_id: 1,
        token: "Tokentest",
        
    });
}).then((data) => {
    console.log(data.toJSON());
})
}

//CALL THESE ONE AT A TIME TO TEST

//addauth();
//addachieve();
//addpic();
//adduser();

//CALL THESE ONE AT A TIME TO DELETE CONTENTS IN EACH TABLE

//deletePic();
//deleteAchieve();
//deleteAuth();

//UNCOMMENT AND CALL THESE ONE BY ONE TO DELETE USER TABLE CONTENTS TO NOT GET FOREIGN KEY ERROR

//sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0;', { raw: true });
//deleteUsers();
//sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1;', { raw: true });



module.exports = 
{
  Users, Pictures, Achievements, Auth
}