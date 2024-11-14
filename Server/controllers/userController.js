const User = require("../model/userModel");
const argon2 = require("argon2");
exports.register = async (req, res, body) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already Used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already Used", status: false });
    const hashedPassword = await argon2.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, User });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, body) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "User not Found", status: false });
    }
    const isPassword = await argon2.compare(password, user.password);
    if (!isPassword) {
      return res.json({ msg: "Password is Incorrect", status: false });
    }
    delete user.password;
    return res.json({ status: true, User: user });
  } catch (err) {
    console.log(err);
  }
};

exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    console.log(err);
  }
};
