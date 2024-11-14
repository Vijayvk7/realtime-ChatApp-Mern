const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/userController");
const router = require("express").Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/setavatar/:id").post(setAvatar);
router.route("/allusers/:id").get(getAllUsers);

module.exports = router;
