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
