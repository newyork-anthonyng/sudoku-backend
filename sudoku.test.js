/**
 * @jest-environment node
 */

const Sudoku = require("./sudoku");
const { rest } = require("msw");
const { setupServer } = require("msw/node");

const BASE_URL = "http://www.cs.utep.edu/cheon/ws/sudoku/new/";

const handlers = [
  rest.get(BASE_URL, (_, res, ctx) => {
    return res(
      ctx.json({
        response: true,
        size: 9,
        squares: [{ x: 0, y: 0, value: 9 }],
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

it("should create new game", async () => {
  const sudoku = new Sudoku();

  const grid = await sudoku.createNewPuzzle();
  expect(grid).toMatchSnapshot();
});

it("should return null when api call fails", async () => {
  server.use(
    rest.get(BASE_URL, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const sudoku = new Sudoku();

  const grid = await sudoku.createNewPuzzle();
  expect(grid).toEqual(null);
});

describe("move", () => {
  let sudoku;
  beforeEach(async () => {
    sudoku = new Sudoku();

    await sudoku.createNewPuzzle();
  });
  it("should update grid when player moves", () => {
    const newMove = { x: 0, y: 1, value: 8 };
    sudoku.move(newMove);

    const grid = sudoku.getGrid();
    expect(grid[newMove.x][newMove.y].value).toEqual(newMove.value);
  });

  it("should not update filled grid item", () => {
    const newMove = { x: 0, y: 0, value: 2 };
    sudoku.move(newMove);

    const grid = sudoku.getGrid();
    expect(grid[newMove.x][newMove.y].value).not.toEqual(newMove.value);
  });

  it("should not allow invalid numbers", () => {
    const bigNumber = { x: 0, y: 1, value: 10 };
    sudoku.move(bigNumber);
    let grid = sudoku.getGrid();
    expect(grid[bigNumber.x][bigNumber.y].value).not.toEqual(bigNumber.value);

    const negativeNumber = { x: 0, y: 1, value: -1 };
    sudoku.move(negativeNumber);
    grid = sudoku.getGrid();

    expect(grid[negativeNumber.x][negativeNumber.y].value).not.toEqual(
      negativeNumber.value
    );
  });

  it("should handle when moves are outside grid", () => {
    const originalGrid = sudoku.getGrid();

    const outsideGridMove = { x: 10, y: 10, value: 1 };
    sudoku.move(outsideGridMove);

    const grid = sudoku.getGrid();
    for (let i = 0; i < originalGrid.length; i++) {
      for (let j = 0; j < originalGrid.length; j++) {
        const originalSquare = originalGrid[i][j];
        const square = grid[i][j];
        expect(originalSquare).toEqual(square);
      }
    }
  });
});
