import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/chess-init.png'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Score extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, 200, 200)

    this.top = 0

    this.render(ctx)
  }

  start(ctx) {
    this.render(ctx);
  }

  render(ctx) {
    console.log('render');
    ctx.drawImage(
      this.img,
      0,
      0,
      200,
      200,
      0,
      0,
      200,
      200
    )
  }
}
