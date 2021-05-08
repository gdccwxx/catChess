import Sprite from '../base/sprite'
import { CHESS_STATUS, ROLE, SITE, CHESS_COUNT, CELL_NUM } from '../constant';
import { shuffle } from '../libs/utils';
import Chess from './chess';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.jpg'

const BORDER_CHESS = 20;

const CHESSBOARD_SIZE = Math.min(screenHeight, screenWidth);
const CELL_SIZE = (CHESSBOARD_SIZE - BORDER_CHESS * 2) / 6;
const TOP = (Math.max(screenHeight, screenWidth) - CHESSBOARD_SIZE) / 2;

/**
 * 游戏背景类
 */
export default class Chessboard extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, screenWidth, screenHeight);

    this.chesses = [];
    this.top = TOP;
    this.size = CHESSBOARD_SIZE;
    
    this.choiceChess = [null, -1, -1];

    this.render(ctx);
    // 简单创建chesses 的二维数组，真正在这里修改
    this.initChess(ctx);
  }

  isInChessboard(x, y) {
    if (
      x >= BORDER_CHESS
      && x <= this.size + BORDER_CHESS
      && y > this.top + BORDER_CHESS
      && y < this.top + this.size - BORDER_CHESS
    ) {
      return true;
    }

    return false;
  }

  convertCoordinateToChess(x, y) {
    const columnIndex = Math.floor((x - BORDER_CHESS) / CELL_SIZE);
    const rowIndex = Math.floor((y - this.top - (BORDER_CHESS / 2)) / CELL_SIZE);

    return { row: rowIndex, column: columnIndex };
  }

  onChessStep(row, column) {
    if (this.choiceChess[0] === null && this.isStepEmpty(row, column)) {
      return;
    }

    if (!this.isStepEmpty(row, column) && !this.isChessTurned(row, column)) {
      this.chesses[column][row].turnChess();
    }
  }

  isStepEmpty(row, column) {
    return this.chesses[column][row] === null;
  }

  isChessTurned(row, column) {
    if (this.chesses[column][row] !== null) {
      return this.chesses[column][row].status === CHESS_STATUS.TURNED;
    }

    return false;
  }

  // 初始化的时候会在这里
  initChess(ctx) {
    const fillArray = [];
    for (let key in CHESS_COUNT) {
      for (let i = 0; i < CHESS_COUNT[key]; i++) {
        fillArray.push({
          status: CHESS_STATUS.INITIALIZED,
          role: ROLE[key],
          site: SITE.RED,
        });
        fillArray.push({
          status: CHESS_STATUS.INITIALIZED,
          role: ROLE[key],
          site: SITE.BLUE,
        });
      }
    }

    const shuffledArray = shuffle(fillArray);
    const shuffledArrayLen = shuffledArray.length;
    const result = [];
    for (let rowIndex = 0; rowIndex < shuffledArrayLen / CELL_NUM; rowIndex += 1) {
      const row = shuffledArray.slice(rowIndex * CELL_NUM, (rowIndex + 1) * CELL_NUM);
      const tempResult = [];
      row.forEach((item, columnIndex) => {
        tempResult.push(new Chess(ctx, rowIndex, columnIndex, item.status, item.role, item.site));
      });
      result.push(tempResult);
    }

    this.chesses = result;
  }

  // update() {
  //   this.top += 2

  //   if (this.top >= screenHeight) this.top = 0
  // }

  render(ctx) {
    ctx.strokeStyle = "#BFBFBF";

    for (let i = 0; i < CELL_NUM + 1; i++) {
      ctx.moveTo(BORDER_CHESS + CELL_SIZE * i, TOP + BORDER_CHESS);
      ctx.lineTo(BORDER_CHESS + CELL_SIZE * i, TOP + CHESSBOARD_SIZE - BORDER_CHESS);
      ctx.stroke();
      ctx.moveTo(BORDER_CHESS, TOP + BORDER_CHESS + CELL_SIZE * i);
      ctx.lineTo(CHESSBOARD_SIZE - BORDER_CHESS, TOP + BORDER_CHESS + CELL_SIZE * i);
      ctx.stroke();
    }
  }
}
