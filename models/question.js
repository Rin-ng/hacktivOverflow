const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
   title:{
      type: String,
      required: "Please input title",
   },
   content:{
      type: String,
      require: "Please input content",
   },
   upvote:[{
      type:Schema.Types.ObjectId, 
      ref: 'user',
      default: []
       
   }],
   downvote:[{
      type:Schema.Types.ObjectId, 
      ref: 'user',
      default: []
   }],
   user:{
      type: Schema.Types.ObjectId,
      ref: 'user'
   }
}, {timestamps: true});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;