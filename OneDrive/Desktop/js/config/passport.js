const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database.js');
const {Users} = require('../sequelize');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    Users.findOne({
        where:{
            id: jwt_payload.id
        }
    }).then(user=>{
      if(user){
        console.log('user found');
        return done(null,user);
      }else{
        console.log('user not found');
        return done(null,false);
      }
    });
  }));
}