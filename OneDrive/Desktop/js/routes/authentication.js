const {Users, Auth, Achievements} = require('../sequelize');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// register user route
router.post('/register',async function(req,res){
    try{
        console.log(req.body);
        // check if email, password, first_name, last_name,
        // and other fields are included
        if(
            !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('password') ||
            !req.body.hasOwnProperty('first_name') ||
            !req.body.hasOwnProperty('last_name') ||
            !req.body.hasOwnProperty('answer1') ||
            !req.body.hasOwnProperty('answer2') ||
            !req.body.hasOwnProperty('question1') ||
            !req.body.hasOwnProperty('question2')
        ){
            return res.json({
                'success': false,
                'error': 'missing fields'
            })
        }
        // retrieve email and check if email is empty
        const email = req.body.email;
        if(email == ""){
            return res.json({
                'success':false,
                'error':'Missing email'
            });
        }
        // get password and check if empty
        const password = req.body.password;
        if(password == ""){
            return res.json({
                'success':false,
                'error':'Missing password'
            });
        }
        // check password requirements
        if(password.length < 8){
            return res.json({
                'success': false,
                'error': 'Password doesnt meet requirements'
            });
        }
        // get first name and check if it is empty
        const first_name = req.body.first_name;
        if(first_name == ""){
            return res.json({
                'success':false,
                'error':'Missing first name'
            });
        }
        // get last name and check if it is empty
        const last_name = req.body.last_name;
        if(last_name == ""){
            return res.json({
                'success':false,
                'error':'Missing last name'
            });
        }
        // get answer 1 and check if it is empty
        const a1 = req.body.answer1;
        if(a1 == ""){
            return res.json({
                'success':false,
                'error':'Missing security answer 1'
            });
        }
        // get answer 2 and check if it is empty
        const a2 = req.body.answer2;
        if(a2 == ""){
            return res.json({
                'success':false,
                'error':'Missing security answer 2'
            });
        }
        // get question 1 and check if it is empty
        const q1 = req.body.question1;
        if(q1 == ""){
            return res.json({
                'success':false,
                'error':'Missing security question 1'
            });
        }
        // get question 2 and check if it is empty
        const q2 = req.body.question2;
        if(q2 == ""){
            return res.json({
                'success':false,
                'error':'Missing security question 2'
            });
        }

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
            bcrypt.genSalt(10,async function(err,salt){
                if(err){
                    console.log("error: ");
                    console.log(err);
                    return res.json({
                        'success': false,
                        'error': 'server error. please contact admin'
                    })
                }
                // hash password
                bcrypt.hash(password,salt,async (err,hash)=>{
                    if(err){
                        console.log("error: ");
                        console.log(err);
                        return res.json({
                            'success': false,
                            'error': 'server error. please contact admin'
                        })
                    }
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
                    user.save().then(async (task)=>{
                        // get user id from email
                        const u = await Users.findOne({
                            where:{
                                email: email
                            }
                        });
                        // create achievement row for user
                        const a = Achievements.build({
                            user_id: u.id
                        });
                        // save achievement
                        a.save().then((t)=>{
                            res.send({'success':true,'message':'User Saved'});
                        }).catch(e=>{
                            console.log("error: ");
                            console.log(e);
                            // achievement save failed
                            res.send({'success':false,'error':'user creation failed. contact admin'});
                        });
                    // user saved failed
                    }).catch(error=>{
                        console.log("Error: ");
                        console.log(error);
                        res.send({'success':false,'error':'user creation failed. contact admin'});
                    });
                });
            });
        }
    }catch(err)
    {
        console.log("Error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': "Server error. please contact admin"
        });
    }
});

// login user
router.post('/login',async function(req,res){
    try{
        // check if fields in request
        if(
            !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('password')
        ){
            return res.json({
                'success': false,
                'error': 'Missing fields'
            })
        }
        // get email and confirmed password
        const email = req.body.email;
        const password = req.body.password;

        // check if email is empty
        if(email == "")
        {
            return res.json({
                'success': false,
                'error': 'email cant be empty'
            })
        }

        // check if password is empty
        if(password == "")
        {
            return res.json({
                'success': false,
                'error': 'password cant be empty'
            })
        }

        // check if user is valid
        const user = await Users.findOne({
            where:{
                email: email
            }
        });
        // user invalid
        if(user == null){
            res.json({
                'success': false,
                'error': 'Username or Password Incorrect'
            });
        // user valid
        }else{
            // check if password is valid
            bcrypt.compare(password,user.password,async (err,isMatch)=>{
                // password invalid
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    res.json({
                        'success': false,
                        'error':'Error Logging you in. Please Contact Admin'
                    });
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
                                [Op.gt]: new Date()
                            }
                        }
                    });
                    console.log("count=" + count);
                    // valid token found
                    if(count > 0)
                    {
                        res.json({
                            'success':false,
                            'error':'Already Logged In'
                        });
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
                            console.log("Error: ");
                            console.log(error);
                            res.json({
                                'success':false,
                                'error':'Error Logging In Plase Contact Administrator.'
                            });
                        });
                    }
                }
                else{
                    res.json({
                        'success': false,
                        'error': 'Invalid username or password'
                    });
                }
            });
        }
    }catch(err){
        console.log("Error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': 'Server error. please contact admin'
        });
    }
});

// check if answers are correct
router.post('/forgot/change', async function(req, res){
    try{
        // check if missing fields
        if(
            !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('answer1') ||
            !req.body.hasOwnProperty('answer2') ||
            !req.body.hasOwnProperty('password')
        ){
            return res.json({
                'success': false,
                'error': 'missing fields'
            })
        }
        // get email and answers
        const email = req.body.email;
        const a1 = req.body.answer1;
        const a2 = req.body.answer2;
        const new_password = req.body.password;

        if(email == ""){
            return res.json({
                'success': false,
                'error': 'email cant be empty'
            });
        }

        if(a1 == ""){
            return res.json({
                'success': false,
                'error': 'answer to security question 1 cant be empty'
            });
        }

        if(a2 == ""){
            return res.json({
                'success': false,
                'error': 'answer to security question 2 cant be empty'
            });
        }

        if(new_password == ""){
            return res.json({
                'success': false,
                'error': 'password cant be empty'
            });
        }

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
                // salt password
                bcrypt.genSalt(10,function(err,salt){
                    if(err)
                    {
                        console.log("Error: ");
                        console.log(err);
                        return res.json({
                            'success': false,
                            'error': 'server error. please contact admin'
                        });
                    }
                    // hash password
                    bcrypt.hash(new_password,salt,(err,hash)=>{
                        if(err)
                        {
                            console.log("Error: ");
                            console.log(err);
                            return res.json({
                                'success': false,
                                'error': 'server error. please contact admin'
                            });
                        }
                        // change password
                        user.update({password:hash}).then(()=>{
                            res.json({
                                'success':true
                            });
                        }).catch(err=>{
                            console.log("Error: ");
                            console.log(err);
                            return res.json({
                                'success': false,
                                'error': 'server error. please contact admin'
                            });
                        });
                    });
                });
            // wrong answers
            }else{
                res.json({
                    'success': false,
                    'error': 'wrong answers'
                });
            }
        }
    }catch(err){
        console.log("error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': 'server error. please contact admin'
        });
    }
});

// get security questions for user
router.post('/forgot',async function(req,res){
    try{
        // check if email exist
        if(!req.body.hasOwnProperty('email')){
            return res.json({
                'success': false,
                'error': 'missing fields'
            });
        }
        // get email
        const email = req.body.email;

        if(email == ""){
            return res.json({
                'success': false,
                'error': 'email cant be empty'
            });
        }
        
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
    }catch(err){
        console.log("Error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': 'server error. please contact admin'
        });
    }
});

// logout route
// protected route
router.get('/logout',passport.authenticate('jwt',{session:false}),function(req,res){
    try{
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
                    [Op.gt]: new Date()
                },
                user_id:decode.id
            }}
        ).then(r=>{
            // no valid token found
            if(r==null){
                return res.json({
                    'success':false,
                    'error':'Invalid Token'
                });
            // valid token found
            }else{
                // expire token
                r['expiration_date'] = new Date();
                r.save().then(()=>{
                    res.json({
                        'success': true
                    });
                }).catch((e)=>{
                    console.log("Error: ");
                    console.log(e);
                    res.json({
                        'success': false,
                        'error': 'logout error'
                    });
                });
            }
        });
    }catch(err){
        console.log("Error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': 'server error. please contact admin'
        });
    }
});

module.exports = router;