const mongoose = require("mongoose");

const URL = "mongodb+srv://vicky:vicky123@cluster0.o1i4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    mongoose.connect(URL, connectionParams);
    console.log("DB connected ");
  } catch (err) {
    console.log("DB  NOT connected ", err);
  }
};
