
const router = require("express").Router();
const answerController = require("../controllers/answer")
const auth = require('../middlewares/auth')

router
   .get("/", auth, answerController.getAllAns)
   .post("/", auth, answerController.createAns)
   .put("/:id", auth, answerController.updateAns)
   .put('/addupvote/:id',auth, answerController.addUpvote)
   .put('/removeupvote/:id',auth,answerController.removeUpvote)
   .put('/adddownvote/:id',auth, answerController.addDownvote)
   .put('/removedownvote/:id',auth,answerController.removeDownvote);

module.exports = router;