const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
   content:{
      type: String,
      require: "Please input content",
   },
   upvotes:[{
      type:Schema.Types.ObjectId, 
      ref: 'user',
      default: []
   }],
   downvotes:[{
      type:Schema.Types.ObjectId, 
      ref: 'user',
      default: []
   }],
   question:{
      type: Schema.Types.ObjectId,
      ref: 'question',
   },
   user:{
      type: Schema.Types.ObjectId,
      ref: 'user'
   }
}, {timestamps: true});

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;