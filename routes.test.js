const request = require("supertest");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

jest.mock("./sudoku", () => {
  class MockSudoku {
    createNewPuzzle = () => {
      const emptyGrid = new Array(9).fill(undefined);
      for (let i = 0; i < emptyGrid.length; i++) {
        emptyGrid[i] = [];
        for (let j = 0; j < emptyGrid.length; j++) {
          emptyGrid[i][j] = { x: i, y: j, value: 0, filled: true };
        }
      }

      this.grid = emptyGrid;
    };

    getGrid = () => this.grid;
  }

  return MockSudoku;
});

const router = require("./routes");
app.use("/", router);

describe("GET /new", () => {
  it("test", async () => {
    await request(app)
      .get("/new")
      .expect(200)
      .then((response) => {
        const tokenRegex = /[a-z]*-[a-z]*/;
        const id = response.body.id;

        expect(tokenRegex.test(id)).toBeTruthy();

        const cookieRegex = /sudoku_game_id=[a-z]*-[a-z]*;/;
        expect(cookieRegex.test(response.header["set-cookie"])).toBeTruthy();
      });
  });
});

describe("GET /:gameId", () => {
  it("test", async () => {
    let gameToken;
    await request(app)
      .get("/new")
      .then((response) => {
        gameToken = response.body.id;
      });

    await request(app)
      .get(`/${gameToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it("should return 404 when game is not found", async () => {
    let gameToken = "does-not-exist";

    await request(app).get(`/${gameToken}`).expect(404);
  });
});

// TODO: put /:gameId
