const router = require("express").Router();
const {
  addmessage,
  getallmessage,
} = require("../controllers/messageController");

router.route("/addmsg").post(addmessage);
router.route("/getmsg").get(getallmessage);

module.exports = router;
