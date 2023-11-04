// go to vscode cmd and type "npm init"
// then type in "npm install sequelize"
// then "npm install mysql2, then the code is ready to test using "node index.js""

const Sequelize = require('sequelize');
const config = require('./config/database');
const fs = require('fs');

// models
const UserModel = require ('./models/Users');
const AuthModel = require('./models/Auth');
const AchievementsModel = require('./models/Achievements');
const AchievementUserModel = require('./models/AchievementUser');
const TrailModel = require('./models/Trail');
const TrailCheckListModel = require('./models/TrailCheckList');

const {Connector} = require("@google-cloud/cloud-sql-connector");

const keyFilePath = './trailblazer-403720-3305da54bd19.json';

const key = JSON.parse(fs.readFileSync(keyFilePath));

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'trailblazer-403720:us-central1:trailblazerinstance',
    username: 'quickstart-user',
 //username: 'root',
    password: 'password',
   // password: 'root',
    database: config.database,
    dialectOptions: {
        socketPath: '/cloudsql/trailblazer-403720:us-central1:trailblazerinstance'
    }
});

const connector = new Connector();

sequelize.beforeConnect(async (config)=>{
    const clientOpts = await connector.getOptions({
        instanceConnectionName: "trailblazer-403720:us-central1:trailblazerinstance",
        ipType: "PUBLIC"
    });
    config = {
        ...clientOpts,
        //user: key.client_email,
        //password: key.private_key,
        user: 'quickstart-user',
        password: 'password',
        ...config
    };
});

sequelize.authenticate().then(()=>{
    console.log("connected...");
}).catch(err=>{
    console.log("Error: " + err);
});

//Proof of connection, Also authenticates connection, Test using cmd: node index.js

/*sequelize.authenticate().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log("Error Connecting to Database")
})*/ 

//User Table

// create models
const Users = UserModel(sequelize,Sequelize);
const Auth = AuthModel(sequelize,Sequelize,Users);
const Achievements = AchievementsModel(sequelize,Sequelize);
const AchievementUser = AchievementUserModel(sequelize,Sequelize,Users,Achievements);
const Trail = TrailModel(sequelize,Sequelize);
const TrailCheckList = TrailCheckListModel(sequelize,Sequelize,Trail);

// connect trails and trail checklist
Trail.hasMany(TrailCheckList,{foreignKey: 'trailId'});
TrailCheckList.belongsTo(Trail, {foreignKey: 'trailId'});

AchievementUser.belongsTo(Achievements,{foreignKey: 'achievements_id'});
AchievementUser.belongsTo(Users,{foreignKey: "user_id"});

Achievements.hasMany(AchievementUser,{foreignKey: "achievements_id"});

// synchronize tables
/*sequelize.sync({force: true}).then(()=>{
    console.log("Tables synchronized");
}).catch(err=>{
    console.log("Synchronization error: " + err);
});*/


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

// export all models for usage
module.exports = 
{
  Users, Trail, TrailCheckList,Achievements, Auth, AchievementUser
}