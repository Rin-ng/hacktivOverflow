const User  = require('../models/user');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const kue = require('kue')
const queue = kue.createQueue()

class UserController{
   
   static signUp(req,res){
      let {name, email, password} = req.body;

      User.create({
         name,
         email,
         password,
      })
      .then(function(){
         User.findOne({email})
         .then(function(user){
            var job = queue.create('email', {
               title: 'Thanks for registering!',
               to: user.email,
           })
           .attempts(3)
           .save( function(err){
              if( err ) {
                 console.log(err)
               }
               else{
                  console.log( job.id );
               }
           });
         })
         .catch(function(err){
            console.log(err)
         })

         res
         .status(201)
         .json({
            message: "Successfully created new user",
         })
      })
      .catch(function(err){
         res
         .status(401)
         .json({
            message: err.message
         })
      })
   }

  static signIn(req,res){
    let {email, password} = req.body;
    User.findOne({ email })
    .then(function(user){
      user.comparePassword(password, function(err, isMatch){
        if(err){
            res.status(401).json(err.message)
        }
        else{
          if(isMatch){
            let token = jwt.sign({_id: user.id}, process.env.secretKey)
            res
            .status(200)
            .json({
                user, 
                token, 
                message: "Token generated"
            });
          }
          else{
            res
            .status(400)
            .json({
                message: "Password is wrong!"
            })
          }
        }
      })
    })
    .catch(function(err){
        res
        .status(400)
        .json(err.message);
    })
  }

   static fbSignIn(req,res){
      console.log("masuk sini hihihihi")
      console.log("cek req headers nih", req.headers.fbToken);
      console.log('headers ', req.headers)
      console.log("body nih", req.body)
      
      let {name, email, id} = req.body;

      User.findOne({ email: email })
      .then(function(user){
        let pass = id + 'a';
        //If user hasn't been saved into db
        if(user === null){
            User.create({
              name: name,
              email: email,
              password : pass
            })
            .then(function(newUser){
              console.log(newUser);
              let token = jwt.sign({_id: newUser._id}, process.env.secretKey)
              console.log("tokennn", token);
                res
                .status(201)
                .json({
                    newUser,
                    token, 
                    message: "Created new user"
                })
            })
            .catch(function(err){
              res
              .status(400)
              .json(err.message);
            })
        }
        //If user is ALREADY in DB
        else{ 
          console.log("masuk else FB login");
          user.comparePassword(pass, function(err, isMatch){  
            if(err){
                console.log("else err fB login")
                res
                .status(401)
                .json({
                  message: err.message
                })
            }
            else{
              console.log("no err @fb login");
              if(isMatch){
                let token = jwt.sign({_id: user.id}, process.env.secretKey)
                res
                .status(200)
                .json({
                    user, 
                    token, 
                    message: "Token generated"
                });
              }
              else{
                console.log("no match")
                res
                .status(400)
                .json({
                    message: "Password is wrong!"
                })
              }
            }
          })
        }
      })
      .catch(function(err){
        console.log("error @ find one");
        console.log(err.message)
        res
        .status(400)
        .json(err.message)
      }) 
   }

   static singleUser(req,res){
      let id = req.decoded._id;
      User.findById({_id:id})
      .then(function(user){
         res.status(200).json({
            user
         })
      })
      .catch(function(err){
         res.status(500).json(err.message);
      })
   }

   
}

module.exports = UserController;