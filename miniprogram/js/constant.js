export const CHESS_STATUS = {
  UNINITIALIZED: 0, // 未初始化
  INITIALIZED: 1, // 已初始化
  TURNED: 2, // 已经翻牌
};

export const ROLE = {
  UNINITIALIZED: 0, // 未初始化
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
  LEVEL_6: 6,
};

export const SITE = {
  UNINITIALIZED: 'null', // 未初始化
  RED: 'red', // 红色
  BLUE: 'blue', // 蓝色
};

// 不同棋子的数量
export const CHESS_COUNT = {
  LEVEL_1: 8,
  LEVEL_2: 4,
  LEVEL_3: 2,
  LEVEL_4: 2,
  LEVEL_5: 1,
  LEVEL_6: 1,
};

export const CELL_NUM = 6;

// 吃棋子规则
export const EAT_RULE = {
  [ROLE.LEVEL_1]: [ROLE.LEVEL_6, ROLE.LEVEL_1],
  [ROLE.LEVEL_2]: [ROLE.LEVEL_2, ROLE.LEVEL_1],
  [ROLE.LEVEL_3]: [ROLE.LEVEL_3, ROLE.LEVEL_2, ROLE.LEVEL_1],
  [ROLE.LEVEL_4]: [ROLE.LEVEL_4, ROLE.LEVEL_3, ROLE.LEVEL_2, ROLE.LEVEL_1],
  [ROLE.LEVEL_5]: [ROLE.LEVEL_5, ROLE.LEVEL_4, ROLE.LEVEL_3, ROLE.LEVEL_2, ROLE.LEVEL_1],
  [ROLE.LEVEL_6]: [ROLE.LEVEL_6, ROLE.LEVEL_5, ROLE.LEVEL_4, ROLE.LEVEL_3, ROLE.LEVEL_2],
};

export const LEVEL_NAME_MAP = {
  [ROLE.LEVEL_6]: '猫皇帝',
  [ROLE.LEVEL_5]: '猫将军',
  [ROLE.LEVEL_4]: '猫校尉',
  [ROLE.LEVEL_3]: '猫箭士',
  [ROLE.LEVEL_2]: '猫小兵',
  [ROLE.LEVEL_1]: '猫刺客',
  [ROLE.UNINITIALIZED]: '初始化'
};

export const SITE_NAME_MAP = {
  [SITE.UNINITIALIZED]: '系统',
  [SITE.BLUE]: '蓝方',
  [SITE.RED]: '红方',
};