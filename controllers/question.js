const User  = require('../models/user');
const Question = require('../models/question');

class QuestionController{

   static createPost(req,res){
      let {title, content} = req.body;
      let user = req.decoded._id;
      
      Question.create({
         title,
         content,
         user
      })
      .then(function(created){
         res.status(200).json({
            message: "created new task",
            created
         });
      })
      .catch(function(err){
         res.status(500).json(err.message);
      })
   }

   static getAllPost(req,res){
      Question.find()
      .sort({createdAt: 'desc'})
      .then(function(posts){
         res.status(200).json({
            message: "Here's the list of posts",
            posts
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }
   static getSinglePost(req,res){
      let id = req.params.id;
      
      Question.findById({_id: id})
      .then(function(post){
         res.status(200).json({
            message: "Here's the post's details",
            post
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }


   static searchPosts(req,res){
      let {query} = req.body;

      Question.find({ $or: [{title : { $regex: query, $options: 'i'}}, {content: {$regex: query , $options: 'i'}}]})
      .populate('users')
      .then(function(tasks){
         res.status(200).json({
            message: `Here's a list of articles containing the word ${query}`,
            tasks
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static updatePost(req,res){
      let {id} = req.params;
      let {title, content} = req.body;

      let newInfo = {};

      if (title) {
        newInfo['title'] = title;
      }
      if (content) {
        newInfo['content'] = content;
      }
      console.log("-------", newInfo)

      Question.update({_id: id}, {$set: newInfo}).exec()
      .then(function(updatedItem){
        Question.findById({_id:id})
        .then(function(newPost){
          res.status(200).json({
            message: "data updated",
            newPost
          })
        })
        .catch(function(err){
          res.status(400).json(err.message)
        })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static deletePost(req,res){
      let {id} = req.params

      Question.deleteOne({_id: id})
      .then(function(){
         res.status(200).json("Task deleted")
      })
      .catch(function(err){
         res.status(400).json(err.message);
      })
   }


   static addUpvote(req,res){
      let questionId = req.params.id;
      let {userId} = req.body;

      Question.update({_id: questionId}, {$pull: { downvotes: userId }}, {multi: true})
      .then(function(){
         User.findById({_id: userId})
         .then(function(user){
            Question.findById({_id:questionId})
            .then(function(post){
               post.upvotes.push(user)
               post.save()
               .then(function(){
                  res.status(200).json({
                     message: "succesfully added upvotes!"
                  })
               })
               .catch(function(err){
                  console.log("error di push user k question upvote")
                  res.status(400).json(err.message)
               })
            })
            .catch(function(err){
               console.log("error di cari question by id")
               res.status(400).json(err.message)
            })
         })
         .catch(function(err){
            console.log("error di cari user by id di question")
            res.status(400).json(err.message)
         })
      }
      .catch(function(err){
         console.log("error di update upvote question")
         res.status(400).json(err.message)
      }))
   }

   static addDownvote(req,res){
      let questionId = req.params.id;
      let {userId} = req.body;

      Question.update({_id: questionId}, {$pull: { upvotes: userId }}, {multi: true})
      .then(function(){
         User.findById({_id: userId})
         .then(function(user){
            Question.findById({_id:questionId})
            .then(function(post){
               post.downvotes.push(user)
               post.save()
               .then(function(){
                  res.status(200).json({
                     message: "succesfully added downvotes!"
                  })
               })
               .catch(function(err){
                  console.log("error di push user k question downvotes")
                  res.status(400).json(err.message)
               })
            })
            .catch(function(err){
               console.log("error di cari question by id downvotes")
               res.status(400).json(err.message)
            })
         })
         .catch(function(err){
            console.log("error di cari user by id di question downvotes")
            res.status(400).json(err.message)
         })
      }
      .catch(function(err){
         console.log("error di update downvotes question")
         res.status(400).json(err.message)
      }))
   }

   static removeDownvote(req,res){
      let questionId = req.params.id;
      let {userId} = req.body;
      Question.update({_id: questionId}, {$pull: { downvotes: userId }}, {multi: true})
      .then(function(){
         res.status(200).json({
            message: "succesfully removed downvotes!"
         })
      })
      .catch(function(err){
         console.log("error di remove downvote question")
         res.status(400).json(err.message)
      })
   }


   static removeUpvote(req,res){
      let questionId = req.params.id;
      let {userId} = req.body;
      Question.update({_id: questionId}, {$pull: { upvote: userId }}, {multi: true})
      .then(function(){
         res.status(200).json({
            message: "succesfully removed upvote!"
         })
      })
      .catch(function(err){
         console.log("error di remove downvote question")
         res.status(400).json(err.message)
      })
   }
}

module.exports = QuestionController;