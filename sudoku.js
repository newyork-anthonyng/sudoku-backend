const axios = require("axios");

// http://www.cs.utep.edu/cheon/ws/sudoku/
const BASE_URL = `http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=1`;
const MIN_NUMBER = 1;
const MAX_NUMBER = 9;

class Sudoku {
  createNewPuzzle = async () => {
    const grid = this._createEmptyGrid();

    try {
      const newGame = await this._fetchNewPuzzle();

      newGame.forEach(({ x, y, value }) => {
        grid[x][y].value = value;
        grid[x][y].filled = true;
      });

      this.grid = grid;

      return grid;
    } catch (e) {
      // console.error(e);
      this.grid = null;

      return null;
    }
  };

  _createEmptyGrid = () => {
    const grid = new Array(9).fill(undefined);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = [];

      for (let j = 0; j < grid.length; j++) {
        grid[i][j] = { x: i, y: j, value: 0, filled: false };
      }
    }

    return grid;
  };

  _fetchNewPuzzle = async () => {
    const { data: response } = await axios.get(BASE_URL);

    // const response = {
    //   response: true,
    //   size: "9",
    //   squares: [
    //     { x: 0, y: 4, value: 5 },
    //     { x: 1, y: 7, value: 6 },
    //     { x: 1, y: 8, value: 8 },
    //     { x: 2, y: 1, value: 1 },
    //     { x: 2, y: 6, value: 7 },
    //     { x: 3, y: 3, value: 6 },
    //     { x: 4, y: 2, value: 6 },
    //     { x: 4, y: 4, value: 2 },
    //     { x: 4, y: 6, value: 9 },
    //     { x: 5, y: 1, value: 3 },
    //     { x: 5, y: 2, value: 2 },
    //     { x: 5, y: 3, value: 5 },
    //     { x: 6, y: 0, value: 6 },
    //     { x: 6, y: 6, value: 2 },
    //     { x: 6, y: 8, value: 9 },
    //     { x: 7, y: 1, value: 2 },
    //     { x: 7, y: 5, value: 7 },
    //     { x: 8, y: 0, value: 5 },
    //     { x: 8, y: 4, value: 3 },
    //     { x: 8, y: 5, value: 1 },
    //   ],
    // };

    return response.squares;
  };

  move = ({ x, y, value }) => {
    if (x < 0 || x > 8) return;
    if (y < 0 || y > 8) return;
    if (this.grid[x][y].filled) return;
    if (value < MIN_NUMBER) return;
    if (value > MAX_NUMBER) return;

    const newGrid = this.grid.slice();
    newGrid[x] = newGrid[x].slice();

    newGrid[x][y] = {
      ...newGrid[x][y],
      value: value,
    };

    this.grid = newGrid;
  };

  getGrid = () => {
    return this.grid;
  };
}

module.exports = Sudoku;
