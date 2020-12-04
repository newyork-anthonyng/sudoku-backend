const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const routes = require("./routes");

app.use(cookieParser());
app.use("/games", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
