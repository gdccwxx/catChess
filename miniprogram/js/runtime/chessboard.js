import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/title.png'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

export default class Chessboard extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

    this.width = ctx.screenWidth;
    this.height = ctx.screenWidth;

    this.render(ctx)
  }

  update() {
    // this.top += 2

    // if ( this.top >= screenHeight )
    //   this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    ctx.moveTo();
  }
}
