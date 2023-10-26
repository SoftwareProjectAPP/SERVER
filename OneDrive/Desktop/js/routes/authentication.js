const {Users, Auth} = require('../sequelize');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const passport = require('passport');

// register user route
router.post('/register',async function(req,res){
    // get email, password, first name, last name
    // security question 1 and 2 and answers
    const email = req.body.email;
    if(email == ""){
        res.json({
            'success':false,
            'error':'Missing email'
        });
    }
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const a1 = req.body.answer1;
    const a2 = req.body.answer2;
    const q1 = req.body.question1;
    const q2 = req.body.question2;

    // check if user already exists
    const count = await Users.count({where:{email: email}});
    
    // user exists
    if(count!= 0){
        res.json({
            'success':false,
            'error':'User already exists'
        });
    // user doesnt exist
    }else{
        // generate salt
        bcrypt.genSalt(10,function(err,salt){
            // hash password
            bcrypt.hash(password,salt,(err,hash)=>{
                // save user
                const user = Users.build({
                    email:email,
                    first_name:first_name,
                    last_name:last_name,
                    password:hash,
                    question1: q1,
                    question2: q2,
                    answer1: a1,
                    answer2: a2
                });
                // user saved worked
                user.save().then(task=>{
                    res.send({'success':true,'message':'User Saved'});
                // user saved failed
                }).catch(error=>{
                    res.send({'success':false,'error':'user creation failed. contact admin'});
                });
            });
        });
    }
});

// login user
router.post('/login',async function(req,res){
    // get email and confirmed password
    const email = req.body.email;
    const password = req.body.password;

    // check if user is valid
    const user = await Users.findOne({
        where:{email: email}
    });
    // user invalid
    if(user == null){
        res.json({'success':false,'error':'Username or Password Incorrect'});  
    // user valid
    }else{
        // check if password is valid
        bcrypt.compare(password,user.password,async (err,isMatch)=>{
            // password invalid
            if(err){
                res.send({'success':false,'error':'Error Logging you in. Plase Contact Admin'});
            }
            // password valid
            if(isMatch){
                // get user id
                const d = {id: user.id};
                // find token that is valid
                const count = await Auth.count({
                    where: {
                        user_id: user.id,
                        expiration_date: {
                            [Op.lte]: new Date()
                        }
                    }
                });
                // valid token found
                if(count > 0)
                {
                    res.json({'success':false,'error':'Already Logged In'});
                }
                // valid token not found
                else
                {
                    // generate token
                    const token = jwt.sign(d,config.secret,{
                        expiresIn: 604800 // 1 week
                    });
                    // save token (map to user)
                    const auth_token = Auth.build({
                        token: token,
                        user_id: user.id
                    });
                    // save token
                    auth_token.save().then(task=>{
                        res.json({
                            'success':true,
                            'token':token,
                            'user_id': user.id
                        });
                    // save failed
                    }).catch(error=>{
                        res.json({
                            'success':false,
                            'error':'Error Logging In Plase Contact Administrator.'
                        });
                    });
                }
            }
        });
    }
});

// change password
router.post('/forgot/answer', async function(req, res){
    // get email and password
    const email = req.body.email;
    const new_password = req.body.password;

    // get user
    const user = await Users.findOne({
        where: {
            email: email
        }
    });
    // invalid user
    if(user == null){
        res.json({
            'success': false,
            'error': 'User not found'
        });
    // valid user
    }else{
        // salt password
        bcrypt.genSalt(10,function(err,salt){
            // hash password
            bcrypt.hash(new_password,salt,(err,hash)=>{
                // change password
                user.update({password:hash}).then(()=>{
                    res.json({'success':true});
                });
            });
        });
    }
});

// check if answers are correct
router.post('/forgot/change', async function(req, res){
    // get email and answers
    const email = req.body.email;
    const a1 = req.body.answer1;
    const a2 = req.body.answer2;

    // get user
    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    // invalid user
    if(user == null){
        res.json({
            'success': false,
            'error': 'User not found'
        });
    // valid user
    }else{
        // correct answers
        if(user.answer1 == a1 && user.answer2 == a2){
            res.json({
                'success': true
            });
            
        // wrong answers
        }else{
            res.json({
                'success': false,
                'error': 'wrong answers'
            });
        }
    }
});

// get security questions for user
router.post('/forgot',async function(req,res){
    // get email
    const email = req.body.email;
    
    // get user with email
    const user = await Users.findOne({
        where: {
            email: email
        }
    });
    // invalid user
    if(user == null)
    {
        res.json({
            'success': false,
            'error': 'user not found'
        });
    // valid user
    }else{
        // send questions
        res.json({
            'success': true,
            'security_question1': user.question1,
            'security_question2': user.question2
        });
    }
});

// logout route
// protected route
router.get('/logout',passport.authenticate('jwt',{session:false}),function(req,res){
    // get token
    const h = req.header('Authorization');
    const split = h.split('bearer ');
    const token = split[1];
    // decode token
    const decode = jwt.decode(token);
    // find valid token
    Auth.findOne({
        where:{
            token:token,
            expiration_date: {
                [Op.lte]: new Date()
            },
            user_id:decode.id
        }}
    ).then(r=>{
        // no valid token found
        if(r==null){
            res.json({
                'success':false,
                'error':'Invalid Token'
            });
        // valid token found
        }else{
            // expire token
            r.update({'expiration_date':new Date()}).then(()=>{
                res.json({
                    'success':true
                });
            });
        }
    });
});