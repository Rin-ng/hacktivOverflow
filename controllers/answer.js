const Question  = require('../models/question');
const Answer = require('../models/answer');

const User = require('../models/user');

class AnswerController{

   static createAns(req,res){
      let questionId = req.params.id;
      let {content} = req.body;
      let user = req.decoded._id;
      
      Answer.create({
         content,
         user,
         question: questionId
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


   static getAllAns(req,res){
      let questionId = req.params.id;
      
      Answer.find({question: questionId})
      .populate('user')
      .populate('question')
      .populate('upvotes')
      .populate('downvotes')
      .then(function(comments){
         res.status(200).json({
            message: "Here are all the answers to this post's question:",
            comments
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static searchAns(req,res){
      let {query} = req.body;

      Answer.find({ $or: [{title : { $regex: query, $options: 'i'}}, {content: {$regex: query , $options: 'i'}}]})
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

   static updateAns(req,res){
      let {id} = req.params;
      let {content} = req.body;

      let newInfo = {};

      if (title) {
        newInfo['title'] = title;
      }
      if (content) {
        newInfo['content'] = content;
      }
      console.log("-------", newInfo)

      Answer.update({_id: id}, {$set: newInfo}).exec()
      .then(function(updatedItem){
        Answer.findById({_id:id})
        .then(function(newAns){
          res.status(200).json({
            message: "data updated",
            newAns
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
   
   static addUpvote(req,res){
      let answerId = req.params.id;
      let {userId} = req.body;

      Answer.update({_id: answerId}, {$pull: { downvotes: userId }}, {multi: true})
      .then(function(){
         User.findById({_id: userId})
         .then(function(user){
            Answer.findById({_id:answerId})
            .then(function(ans){
               ans.upvotes.push(user)
               ans.save()
               .then(function(){
                  res.status(200).json({
                     message: "succesfully added upvotes!"
                  })
               })
               .catch(function(err){
                  console.log("error di push user k ans upvote")
                  res.status(400).json(err.message)
               })
            })
            .catch(function(err){
               console.log("error di cari ans by id")
               res.status(400).json(err.message)
            })
         })
         .catch(function(err){
            console.log("error di cari user by id di ans")
            res.status(400).json(err.message)
         })
      }
      .catch(function(err){
         console.log("error di update upvote ans")
         res.status(400).json(err.message)
      }))
   }

   static addDownvote(req,res){
      let answerId = req.params.id;
      let {userId} = req.body;

      Answer.update({_id: answerId}, {$pull: { upvotes: userId }}, {multi: true})
      .then(function(){
         User.findById({_id: userId})
         .then(function(user){
            Answer.findById({_id:answerId})
            .then(function(ans){
               ans.downvotes.push(user)
               ans.save()
               .then(function(){
                  res.status(200).json({
                     message: "succesfully added downvotes!"
                  })
               })
               .catch(function(err){
                  console.log("error di push user k ans downvotes")
                  res.status(400).json(err.message)
               })
            })
            .catch(function(err){
               console.log("error di cari ans by id downvotes")
               res.status(400).json(err.message)
            })
         })
         .catch(function(err){
            console.log("error di cari user by id di ans downvotes")
            res.status(400).json(err.message)
         })
      }
      .catch(function(err){
         console.log("error di update downvotes ans")
         res.status(400).json(err.message)
      }))
   }

   static removeDownvote(req,res){
      let answerId = req.params.id;
      let {userId} = req.body;
      Answer.update({_id: answerId}, {$pull: { downvotes: userId }}, {multi: true})
      .then(function(){
         res.status(200).json({
            message: "succesfully removed downvotes!"
         })
      })
      .catch(function(err){
         console.log("error di remove downvote ans")
         res.status(400).json(err.message)
      })
   }


   static removeUpvote(req,res){
      let answerId = req.params.id;
      let {userId} = req.body;
      Answer.update({_id: answerId}, {$pull: { upvote: userId }}, {multi: true})
      .then(function(){
         res.status(200).json({
            message: "succesfully removed upvote!"
         })
      })
      .catch(function(err){
         console.log("error di remove downvote ans")
         res.status(400).json(err.message)
      })
   }
}

module.exports = AnswerController;