import Sprite from '../base/sprite'
import { CHESS_STATUS, ROLE, SITE } from '../constant';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.jpg'

const CELL_NUM = 6; // 一共横、竖向有多少个
const BORDER_CHESS = 20;

const CHESSBOARD_SIZE = Math.min(screenHeight, screenWidth);
const CELL_SIZE = (CHESSBOARD_SIZE -  BORDER_CHESS * 2) / 6;
const TOP = (Math.max(screenHeight, screenWidth) - CHESSBOARD_SIZE) / 2;

/**
 * 游戏背景类
 */
export default class Chessboard extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, screenWidth, screenHeight)
    
    this.chesses = [];
    this.top = 0

    this.render(ctx);
    // 简单创建chesses 的二维数组，真正在这里修改
    this.initChess();
  }

  start() {
    
  }

  // 初始化的时候会在这里
  initChess() {
    this.chesses = new Array(6)
      .fill(
        new Array(6)
          .fill({
            status: CHESS_STATUS.INITIALIZED,
            role: ROLE.UNINITIALIZED,
            site: SITE.UNINITIALIZED
          }
        )
      );

  }

  update() {
    this.top += 2

    if (this.top >= screenHeight) this.top = 0
  }

  render(ctx) {
    ctx.strokeStyle="#BFBFBF";

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
