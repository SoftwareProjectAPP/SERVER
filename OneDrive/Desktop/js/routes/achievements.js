const {Auth, Achievements} = require('../sequelize');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

// get all achievements
router.get('/getall',passport.authenticate('jwt',{session: false}), async function(req,res){
  // get token
  const h = req.header('Authorization');
  const split = h.split('bearer ');
  const token = split[1];
  // decode token
  const decode = jwt.decode(token);

  const count = await Auth.count({
    where:{
      token: token,
      expiration_date: {
        [Op.gt]: new Date()
      },
      user_id: decode.id
    }}
  );

  // no valid token found
  if(count == 0){
    res.json({
      'success': false,
      'error': 'user not logged in'
    });
  // valid token found
  }else{
    // get all achievements for user
    const user_achievements = await Achievements.findAll({
      attributes:[
        'SandyTrailComplete',
        'LakeLoopComplete',
        'FernComplete',
        'LoneStarComplete',
        'NorthwesternComplete'
      ],
      where: {
        user_id: decode.id
      }
    });
    // no achievements found
    if(user_achievements == null){
      res.json({
        'success': false,
        'error': 'achievements not found'
      });
    // achivements retrieved
    }else{
      // send back to client
      res.json({
        'success': true,
        'user_achievements': user_achievements
      });
    }
  }
});

// add achievements
// protected route
router.post('/add',passport.authenticate('jwt',{session:false}), async function(req,res){
  console.log("running add");
  // get token
  const h = req.header('Authorization');
  const split = h.split('bearer ');
  const token = split[1];
  // decode token
  const decode = jwt.decode(token);
  console.log("decode = ");
  console.log(decode);
  if(!req.body.hasOwnProperty('achievement_name')){
    return res.json({
      'success': false,
      'error': 'missing fields'
    });
  }
  console.log("got token");
  // get achievmeent id
  const achievement_name = req.body.achievement_name;
  if(achievement_name == ""){
    return res.json({
      'success': false,
      'error': 'achievement_name cant be empty'
    });
  }
  console.log("got achievmeent_name");
  console.log("achievement_name = " + achievement_name);

  if(
    achievement_name !== "SandyTrailComplete" &&
    achievement_name !== "LakeLoopComplete" &&
    achievement_name !== "FernComplete" &&
    achievement_name !== "LoneStarComplete" &&
    achievement_name !== "NorthwesternComplete"
  ){
    console.log("achievement name invalid");
    return res.json({
      'success': false,
      'error': 'invalid achievement name'
    });
  }
  console.log("achievement name valid");
  // find token that is valid
  const count = await Auth.count({
    where:{
      token: token,
      expiration_date: {
        [Op.gt]: new Date()
      },
      user_id: decode.id
    }}
  );
  
  // no valid token found
  if(count == 0){
    console.log("token invalid");
    res.json({
      'success': false,
      'error': 'user not logged in'
    });
  // valid token found
  }else{
    console.log("token valid");
    Achievements.findOne({
      where:{
        user_id: decode.id
      }
    }).then(r=>{
      console.log("found achievemnt");
      console.log("r = ");
      console.log(r);
      if(r == null){
        console.log("r not found");
        res.json({
          'success': false,
          'error': 'Invalid achievement name'
        });
      }else{
        console.log("r found");
        r[achievement_name] = true;
        r.save().then(()=>{
          console.log("data updated");
          res.json({
            'success': true
          });
        }).catch((e)=>{
          console.log("error: " + e);
          res.json({
            'success': false,
            'error': 'update error'
          });
        });
      }
    }).catch((err)=>{
      console.log("error: " + err);
      res.json({
        'success': false,
        'error': 'error adding achievement'
      });
    });
  }
});

module.exports = router;