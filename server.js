const express = require("express");
const app = express();
const Sudoku = require("./sudoku");

app.get("/", async (req, res) => {
  const sudoku = new Sudoku();
  const response = await sudoku.createNewPuzzle();
  console.log(response);
  res.json(response.data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
