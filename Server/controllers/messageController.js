const messageModel = require("../model/messageModel");
exports.addmessage = async (req, res, body) => {
  try {
    const { from, to, message } = req.body;
    const data = messageModel.create({
      message: message,
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({
        msg: "Message successfully added to the Databse",
        status: true,
      });
    } else {
      return res.json({
        msg: "Message not added to the Database Errror!!!!!!!!!!",
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getallmessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    const messages = await messageModel
      .find({ users: { $all: [from, to] } })
      .sort({ updated: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
      };
    });
    return res.json(projectedMessages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Internal Server Error",
      status: false,
    });
  }
};
