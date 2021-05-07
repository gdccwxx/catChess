import Player from './player/index'
import Enemy from './npc/enemy'
import Chessboard from './runtime/chessboard'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.chessboard = new Chessboard(ctx);

    // this.restart()
    this.render();

  }

  handleCanvasTouch () {

  }

  touchEventHandler(e) {
    e.preventDefault();
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;

    // const x = e.touches[0].clientX
    // const y = e.touches[0].clientY
    console.log(this.chessboard);
    if (this.chessboard.isInChessboard(x, y)) {
      console.log('in chessboard');
      return;
    }
    console.log('out chessboard');
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    // this.chessboard.render(ctx)

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     item.drawToCanvas(ctx)
    //   })

    // this.player.drawToCanvas(ctx)

    // databus.animations.forEach((ani) => {
    //   if (ani.isPlaying) {
    //     ani.aniRender(ctx)
    //   }
    // })

    // this.gameinfo.renderGameScore(ctx, databus.score)

    // // 游戏结束停止帧循环
    // if (databus.gameOver) {
    //   this.gameinfo.renderGameOver(ctx, databus.score)

    //   if (!this.hasEventBind) {
    //     this.hasEventBind = true
    //     this.touchHandler = this.touchEventHandler.bind(this)
    //     canvas.addEventListener('touchstart', this.touchHandler)
    //   }
    // }
    this.touchHandler = this.touchEventHandler.bind(this)

    canvas.addEventListener('touchend', this.touchHandler);
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return

    // this.chessboard.update()

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     // item.update()
    //   })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    // this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
