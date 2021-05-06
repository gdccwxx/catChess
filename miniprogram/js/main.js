import Player     from './player/index'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'
import Score from './score/index';

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

wx.cloud.init({
  // env 参数说明：
  //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
  //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
  //   如不填则使用默认环境（第一个创建的环境）
  // env: 'my-env-id',
})
const db = wx.cloud.database()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.scoreIndex = new Score(ctx);
    this.personalHighScore = null

    // this.start()
    
    // this.login()
  }

  login() {
    // 获取 openid
    // wx.cloud.callFunction({
    //   name: 'login',
    //   success: res => {
    //     window.openid = res.result.openid
    //     this.prefetchHighScore()
    //   },
    //   fail: err => {
    //     console.error('get openid failed with error', err)
    //   }
    // })
  }

  prefetchHighScore() {
    // 预取历史最高分
    db.collection('score').doc(`${window.openid}-score`).get()
      .then(res => {
        if (this.personalHighScore) {
          if (res.data.max > this.personalHighScore) {
            this.personalHighScore = res.data.max
          }
        } else {
          this.personalHighScore = res.data.max
        }
      })
      .catch(err => {
        console.error('db get score catch error', err)
        this.prefetchHighScoreFailed = true
      })
  }

  start() {
    this.scoreIndex.start(ctx);
  }
  restart() {
    databus.reset()

    // canvas.removeEventListener(
    //   'touchstart',
    //   this.touchHandler
    // )

    // this.bg       = new BackGround(ctx)
    // this.player   = new Player(ctx)
    // this.gameinfo = new GameInfo()
    // this.music    = new Music()

    // this.bindLoop     = this.loop.bind(this)
    // this.hasEventBind = false

    // 清除上一局的动画
    // window.cancelAnimationFrame(this.aniId);

    // this.aniId = window.requestAnimationFrame(
    //   this.bindLoop,
    //   canvas
    // )
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    // this.bg.render(ctx)
    // this.gameinfo.renderGameScore(ctx, databus.score)
    this.scoreIndex.render(ctx)

    // if ( databus.gameOver ) {
    //   this.gameinfo.renderGameOver(
    //     ctx, 
    //     databus.score,
    //     this.personalHighScore
    //   )
    // }
  }
}
