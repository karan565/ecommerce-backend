const bodyParser = require("body-parser");
const express = require("express");
// const db = require("./middlewares/dbConnect");


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
require("dotenv").config();

// app.use(db.connectToDatabase);
// app.use(db.disconnectFromDatabase);

app.use('/cart', require("./routes/cart"));
app.use('/orders', require("./routes/orders"));
app.use('/products', require("./routes/products"));
app.use('/users', require("./routes/users"));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});