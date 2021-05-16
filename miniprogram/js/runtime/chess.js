import Sprite from '../base/sprite'
import { CHESS_STATUS } from '../constant';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BORDER_CHESS = 20;
const CHESSBOARD_SIZE = Math.min(screenHeight, screenWidth);
const CELL_SIZE = (CHESSBOARD_SIZE - BORDER_CHESS * 2) / 6;
const TOP = (Math.max(screenHeight, screenWidth) - CHESSBOARD_SIZE) / 2;


const getChessSrc = (status, site, role) => {
  if (status === CHESS_STATUS.INITIALIZED) {
    return 'images/chess-init.png';
  }
  if (status === CHESS_STATUS.TURNED) {
    return `images/chess-${site}-level-${role}.png`;
  }

  return 'images/chess-init.png';
}

const getChessPosX = (column) => {
  return column * CELL_SIZE + BORDER_CHESS
}

const getChessPosY = (row) => {
  return row * CELL_SIZE + TOP + BORDER_CHESS;
}

export default class Chess extends Sprite {
  // 提供 ctx 画板
  // rowIndex 第几行
  // columnIndex 第几列
  // status 是啥状态，初始化 or 被翻牌
  // role 角色 是啥角色
  // site 红色方还是蓝色方
  constructor(ctx, rowIndex, columnIndex, status, role, site) {
    super(
      getChessSrc(status, site, role),
      CELL_SIZE,
      CELL_SIZE,
      getChessPosX(columnIndex),
      getChessPosY(rowIndex),
    );
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    
    // 设置状态
    this.status = status;
    // 设置角色
    this.role = role;
    // 设置
    this.site = site;
    
    this.imgSrc = getChessSrc(this.status, this.site, this.role);
    this.ctx = ctx;
    this.render(ctx);
  }

  moveTo(rowIndex, columnIndex) {
    this.clearChessPos();

    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    this.x = getChessPosX(this.columnIndex);
    this.y = getChessPosY(this.rowIndex);

    this.clearChessPos();
    this.imgSrc = getChessSrc(this.status, this.site, this.role);
    this.render()
  }

  // 反转棋子
  turnChess() {
    if (this.status === CHESS_STATUS.TURNED) return;

    this.status = CHESS_STATUS.TURNED;
    this.imgSrc = getChessSrc(this.status, this.site, this.role);
    this.setImgSrc(this.imgSrc);
    this.clearChessPos();
    this.render();
  }

  clearChessPos() {
    this.ctx.clearRect(
      getChessPosX(this.columnIndex),
      getChessPosY(this.rowIndex),
      CELL_SIZE - 2, 
      CELL_SIZE - 2
    );
  }

  render() {
    this.img.onload = () => {
      this.drawToCanvas(this.ctx);
    }
    this.drawToCanvas(this.ctx);
    // this.ctx.beginPath();
    // this.ctx.arc(200, 200, 100, 0, 2 * Math.PI);
    // this.ctx.closePath();
    // const gradient =  this.ctx.createRadialGradient(200, 200, 50, 200, 200, 20); 
    // gradient.addColorStop(0, '#0a0a0a');
    // gradient.addColorStop(1, '#636766');
    // this.ctx.fillStyle = gradient; 
    // this.ctx.fill();
  }
}
