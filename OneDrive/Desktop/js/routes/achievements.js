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
  // get token
  const h = req.header('Authorization');
  const split = h.split('bearer ');
  const token = split[1];
  // decode token
  const decode = jwt.decode(token);
  if(!req.body.hasOwnProperty('achievement_name')){
    return res.json({
      'success': false,
      'error': 'missing fields'
    });
  }
  // get achievmeent id
  const achievement_name = req.body.achievement_name;
  if(achievement_name == ""){
    return res.json({
      'success': false,
      'error': 'achievement_name cant be empty'
    });
  }

  if(
    achievement_name !== "SandyTrailComplete" &&
    achievement_name !== "LakeLoopComplete" &&
    achievement_name !== "FernComplete" &&
    achievement_name !== "LoneStarComplete" &&
    achievement_name !== "NorthwesternComplete"
  ){
    return res.json({
      'success': false,
      'error': 'invalid achievement name'
    });
  }
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
    res.json({
      'success': false,
      'error': 'user not logged in'
    });
  // valid token found
  }else{
    Achievements.findOne({
      where:{
        user_id: decode.id
      }
    }).then(r=>{
      if(r == null){
        res.json({
          'success': false,
          'error': 'Invalid achievement name'
        });
      }else{
        r.update({achievement_name: true}).then(()=>{
          res.json({
            'success': true
          });
        });
      }
    });
  }
});

module.exports = router;