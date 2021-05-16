import Sprite from '../base/sprite'
import { CHESS_STATUS, ROLE, SITE, CHESS_COUNT, CELL_NUM, EAT_RULE } from '../constant';
import { shuffle } from '../libs/utils';
import Chess from './chess';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.jpg'

const BORDER_CHESS = 20;

const CHESSBOARD_SIZE = Math.min(screenHeight, screenWidth);
const CELL_SIZE = (CHESSBOARD_SIZE - BORDER_CHESS * 2) / 6;
const TOP = (Math.max(screenHeight, screenWidth) - CHESSBOARD_SIZE) / 2;

export default class Chessboard extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, screenWidth, screenHeight);

    this.chesses = [];
    this.top = TOP;
    this.size = CHESSBOARD_SIZE;

    // [选中棋子, row, column]
    this.choiceChess = [null, -1, -1];
    this.site = SITE.UNINITIALIZED;

    this.render(ctx);
    // 简单创建chesses 的二维数组，真正在这里修改
    this.initChess(ctx);
    this.start();
  }

  start() {
    this.site = Math.random() > 0.5 ? SITE.RED : SITE.BLUE;
    console.log('site', this.site);
  }

  // 是否点击
  isClickInChessboard(x, y) {
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

  toggleSite() {
    if (this.site === SITE.RED) {
      this.site = SITE.BLUE;
      console.log('site', this.site);
      return;
    }

    if (this.site === SITE.BLUE) {
      this.site = SITE.RED;
      console.log('site', this.site);
      return;
    }
  }

  // 把屏幕的坐标点转化成棋盘上的坐标点
  convertCoordinateToChess(x, y) {
    const columnIndex = Math.floor((x - BORDER_CHESS) / CELL_SIZE);
    const rowIndex = Math.floor((y - this.top - (BORDER_CHESS / 2)) / CELL_SIZE);

    return { row: rowIndex, column: columnIndex };
  }

  // 判断是否需要下一步
  onChessStep(row, column) {
    if (this.isPosEmpty(row, column) && !this.isSelectedChess()) {
      return;
    }

    if (this.isPosEmpty(row, column) && this.isSelectedChess()) {
      const [selectChess] = this.choiceChess;

      selectChess.moveTo(row, column);
      return;
    }

    // 如果位置上有棋子, 可以吃
    if (
      !this.isPosEmpty(row, column)
      && this.isSelectedChess()
    ) {
      // 吃掉棋子
      if (this.couldEat(this.choiceChess[0], this.chesses[row][column])) {
        this.eatChess(row, column);
        return;
      }

      if (this.couldEat(this.chesses[row][column], this.choiceChess[0])) {
        this.beEatChess(row, column);
        return;
      }

    }

    // 判断是否点击的是空
    if (this.choiceChess[0] === null && this.isPosEmpty(row, column)) {
      return;
    }

    // 判断是否需要反转棋子
    if (!this.isPosEmpty(row, column) && !this.isChessTurned(row, column)) {
      this.onTurnChess(row, column);
      return;
    }

    // 选中棋子
    if (this.site === this.getChessSite(row, column)) {
      this.onSelectChess(row, column);
      return;
    }

    // this.toggleSite();
  }

  // 翻开棋子
  onTurnChess(row, column) {
    !this.isChessTurned(row, column) && this.chesses[row][column].turnChess();
    this.toggleSite();
    console.log(this.chesses);
  }

  // 当前位置是否是空的
  isPosEmpty(row, column) {
    return this.chesses[row][column] === null;
  }

  // 棋子是否被反转
  isChessTurned(row, column) {
    if (this.chesses[row][column] !== null) {
      return this.chesses[row][column].status === CHESS_STATUS.TURNED;
    }

    return false;
  }

  // 检查棋子类型
  getChessSite(row, column) {
    if (this.isPosEmpty(row, column)) {
      console.warn('their is no chess on that position');
      return;
    }

    if (!this.isChessTurned(row, column)) {
      console.warn('their is no turned that position');
      return;
    }

    return this.chesses[row][column].site;
  }

  // 选择棋子
  onSelectChess(row, column) {
    if (this.getChessSite(row, column) !== this.site) {
      return;
    }

    this.choiceChess = [this.chesses[row][column], row, column];
    console.log(this.choiceChess);
  }

  // 清空选中的棋子
  clearSelectedChess() {
    this.choiceChess = [null, -1, -1];
  }

  // 检查是否选中了棋子
  isSelectedChess() {
    if (this.choiceChess[0] === null) {
      return false;
    }

    return true;
  }

  // 是否可以吃掉棋子
  couldEat(chess, beEatChess) {
    if (chess.site === beEatChess.site || chess.status !== CHESS_STATUS.TURNED || beEatChess.status !== CHESS_STATUS.TURNED) {
      return false;
    }
    return EAT_RULE[chess.role].includes(beEatChess.role);
  }

  // 吃掉棋子
  eatChess(beEatRow, beEatColumn) {
    if (!this.isSelectedChess()) {
      console.warn('none select chesses, can not eat');
      return;
    }

    const [selectChess, row, column] = this.choiceChess;
    if (this.couldEat(selectChess, this.chesses[beEatRow][beEatColumn])) {
      this.chesses[beEatRow][beEatColumn] = selectChess;
      this.chesses[row][column] = null;

      selectChess.moveTo(beEatRow, beEatColumn);
      console.log(this.chesses);
      this.clearSelectedChess();
      this.toggleSite();
    }
  }

  // 被吃掉,例如无法吃掉别人的时候，就会被吃掉
  beEatChess(eatRow, eatColumn) {
    if (!this.isSelectedChess()) {
      console.warn('none select chesses, can not eat');
      return;
    }

    const [selectChess, row, column] = this.choiceChess;
    if (this.couldEat(this.chesses[eatColumn][eatRow], selectChess)) {
      this.chesses[row][column].clearChessPos();
      this.chesses[row][column] = null;
      this.clearSelectedChess();
      this.toggleSite();
    }
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
    console.log(this.chesses)
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
