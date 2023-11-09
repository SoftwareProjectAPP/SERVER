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
    const user_achievements = await Achievemens.findAll({
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
  if(!req.body.hasOwnProperty('achievement_id')){
    return res.json({
      'success': false,
      'error': 'missing fields'
    });
  }
  // get achievmeent id
  const achievement_id = req.body.achievement_id;
  if(achievement_id == ""){
    return res.json({
      'success': false,
      'error': 'achievement_id cant be empty'
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
    // check if achivement_id is valid
    const c = await Achievements.count({
      where: {
        id: achievement_id
      }
    });
    // not valid
    if(c == 0){
      res.json({
        'success': false,
        'error': 'achievement invalid'
      });
    // valid
    }else{
      // map achievement to user
      const a1 = AchievementUser.build({
        user_id: decode.id,
        achievements_id: achievement_id
      });
      // mapping worked
      a1.save().then(t=>{
        res.json({
          'success': true
        });
      // mapping failed
      }).catch(error=>{
        res.json({
          'success': false,
          'error': 'error adding achievement. contact admin'
        });
      })
    }
  }
});

module.exports = router;