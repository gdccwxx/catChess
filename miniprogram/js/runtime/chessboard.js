import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.jpg'
const BORDER_CHESS = 20;
const CELL_NUMS = 6; // 一共横、竖向有多少个
const CHESSBOARD_SIZE = Math.min(screenHeight, screenWidth);
const CELL_SIZE = (CHESSBOARD_SIZE -  BORDER_CHESS * 2) / 6;
const TOP = (Math.max(screenHeight, screenWidth) - CHESSBOARD_SIZE) / 2;

/**
 * 游戏背景类
 */
export default class Chessboard extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, screenWidth, screenHeight)

    this.top = 0

    this.render(ctx)
  }

  update() {
    this.top += 2

    if (this.top >= screenHeight) this.top = 0
  }

  render(ctx) {
    ctx.strokeStyle="#BFBFBF";

    for (let i = 0; i < CELL_NUMS + 1; i++) {
      ctx.moveTo(BORDER_CHESS + CELL_SIZE * i, TOP + BORDER_CHESS);
      ctx.lineTo(BORDER_CHESS + CELL_SIZE * i, TOP + CHESSBOARD_SIZE - BORDER_CHESS);
      ctx.stroke();
      ctx.moveTo(BORDER_CHESS, TOP + BORDER_CHESS + CELL_SIZE * i);
      ctx.lineTo(CHESSBOARD_SIZE - BORDER_CHESS, TOP + BORDER_CHESS + CELL_SIZE * i);
      ctx.stroke(); 
    }
  }
}
