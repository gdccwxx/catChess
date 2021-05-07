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

    this.render(ctx);
    // 简单创建chesses 的二维数组，真正在这里修改
    this.initChess(ctx);
  }

  isInChessboard(x, y) {
    if (
      x >= BORDER_CHESS
      && x <= this.size + BORDER_CHESS
      && y > this.top
      && y < this.top + this.size - BORDER_CHESS
    ) {
      return true;
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
    const result = [];
    for (let rowIndex = 0; rowIndex < shuffledArray.length / CELL_NUM; rowIndex += 1) {
      const row = shuffledArray.slice(rowIndex, rowIndex + CELL_NUM);

      row.forEach((item, columnIndex) => {
        result.push(new Chess(ctx, rowIndex, columnIndex, item.status, item.role, item.site));
      });
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
