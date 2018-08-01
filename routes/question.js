
const router = require("express").Router();
const questionController = require("../controllers/question")
const auth = require('../middlewares/auth')

router
   .get("/", auth, questionController.getAllPost)
   .get("/:id", questionController.getSinglePost)
   .post("/", auth, questionController.createPost)
   .put("/:id", auth, questionController.updatePost)
   .delete("/:id", auth, questionController.deletePost)
   .put('/addupvote/:id',auth, questionController.addUpvote)
   .put('/removeupvote/:id',auth,questionController.removeUpvote)
   .put('/adddownvote/:id',auth, questionController.addDownvote)
   .put('/removedownvote/:id',auth,questionController.removeDownvote);

module.exports = router;