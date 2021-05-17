import Sprite from '../base/sprite'
import { CHESS_STATUS, ROLE, SITE, CHESS_COUNT, CELL_NUM, EAT_RULE, LEVEL_NAME_MAP, SITE_NAME_MAP } from '../constant';
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

    this.ctx = ctx;

    this.render(ctx);
    // 简单创建chesses 的二维数组，真正在这里修改
    this.initChess(ctx);
    this.start();
  }

  start() {
    this.site = Math.random() > 0.5 ? SITE.RED : SITE.BLUE;
    this.writeSite();
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
    this.clearSelectedChess();
    if (this.site === SITE.RED) {
      this.site = SITE.BLUE;
      this.writeSite();
      return;
    }

    if (this.site === SITE.BLUE) {
      this.site = SITE.RED;
      this.writeSite();
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
      this.moveChess(row, column);
      console.log(this.chesses);
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
        console.log('eat');
        console.log(this.chesses);
        return;
      }

      if (this.couldEat(this.chesses[row][column], this.choiceChess[0])) {
        // this.beEatChess(row, column);
        // console.log('be eat');
        // console.log(this.chesses);
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
  }

  // 翻开棋子
  onTurnChess(row, column) {
    !this.isChessTurned(row, column) && this.chesses[row][column].turnChess();
    this.toggleSite();
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
    this.writeChoicePos();
  }

  // 清空选中的棋子
  clearSelectedChess() {
    this.choiceChess = [null, -1, -1];
    this.writeChoicePos();
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
    const rowIndexAbs = Math.abs(chess.rowIndex - beEatChess.rowIndex);
    const columnIndexAbs = Math.abs(chess.columnIndex - beEatChess.columnIndex);
    if ((rowIndexAbs === 0 && columnIndexAbs === 1) || (rowIndexAbs === 1 && columnIndexAbs === 0)) {
      return EAT_RULE[chess.role].includes(beEatChess.role);
    }

    return false;
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
    if (this.couldEat(this.chesses[eatRow][eatColumn], selectChess)) {
      console.log('be eat chess', row, column);
      this.chesses[row][column].clearChessPos();
      this.chesses[row][column] = null;
      this.clearSelectedChess();
      this.toggleSite();
    }
  }

  moveChess(row, column) {
    if (!this.isSelectedChess()) {
      return;
    }

    const [choiceChess, choiceRow, choiceColumn] = this.choiceChess;
    this.chesses[choiceRow][choiceColumn] = null;
    this.chesses[row][column] = choiceChess;

    this.chesses[row][column].moveTo(row, column);

    this.toggleSite();
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

  writeSite() {
    this.ctx.clearRect(120, 30, 20, 20);
    this.ctx.save();
    this.ctx.beginPath();

    // 写字
    this.ctx.font = "18px orbitron";
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`${SITE_NAME_MAP[this.site]} 执棋`, 120, 50, 200);

    this.ctx.restore();
    this.ctx.closePath();
  }

  writeChoicePos() {
    const [choiceChess, row, column] = this.choiceChess;
    const text = choiceChess !== null
      ? `选中: ${LEVEL_NAME_MAP[choiceChess.role]}[${row + 1}, ${column + 1}]`
      : '未选中';
    this.ctx.clearRect(120, 53, 200, 20);
    this.ctx.save();
    this.ctx.beginPath();

    // 写字
    this.ctx.font = "18px orbitron";
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(text, 120, 70, 200);

    this.ctx.restore();
    this.ctx.closePath();
  }

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
