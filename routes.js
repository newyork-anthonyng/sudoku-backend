const express = require("express");
const router = express.Router();

const Haikunator = require("haikunator");

const Sudoku = require("./sudoku");

const games = {};

function getRandomToken() {
  const haiku = new Haikunator();

  return haiku.haikunate({ tokenLength: 0 });
}

router.get("/new", async (req, res) => {
  const token = getRandomToken();
  const newSudoku = new Sudoku();
  games[token] = newSudoku;
  newSudoku.createNewPuzzle();

  res.cookie("sudoku_game_id", token, { maxAge: 900000, httpOnly: true });
  return res.json({ id: token });
});

router.get("/:gameId", (req, res) => {
  const { gameId } = req.params;
  const sudoku = games[gameId];
  if (!sudoku) {
    return res.sendStatus(404);
  }

  const grid = sudoku.getGrid();

  return res.json({ grid: grid });
});

router.put("/:gameId", (req, res) => {
  const { gameId } = req.params;
  const { x, y, value } = req.body;

  const sudoku = games[gameId];

  if (!sudoku) {
    return res.sendStatus(404);
  }

  sudoku.move({ x, y, value });

  return res.json({ ok: true });
});

module.exports = router;
