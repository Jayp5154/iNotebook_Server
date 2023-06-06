const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://Jayp5154:Jaypatel160902@cluster0.jogu6ve.mongodb.net/iNotebook?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connection Successful");
  });
};

module.exports = connectToMongo;
