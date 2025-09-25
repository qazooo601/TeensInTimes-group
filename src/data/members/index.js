// 導入所有成員詳細資料
import { maJiaQiDetails } from './maJiaQi.js';
import { dingChengXinDetails } from './dingChengXin.js';
import { songYaXuanDetails } from './songYaXuan.js';
import { liuYaoWenDetails } from './liuYaoWen.js';
import { zhangZhenYuanDetails } from './zhangZhenYuan.js';
import { yanHaoXiangDetails } from './yanHaoXiang.js';
import { heJunLinDetails } from './heJunLin.js';

// 統一導出所有成員詳細資料
export { maJiaQiDetails, dingChengXinDetails, songYaXuanDetails, liuYaoWenDetails, zhangZhenYuanDetails, yanHaoXiangDetails, heJunLinDetails };

// 成員代碼對應表
export const memberCodeMap = {
  'MJQ': 'maJiaQiDetails',
  'DLS': 'dingChengXinDetails',
  'SJY': 'songYaXuanDetails',
  'LWH': 'liuYaoWenDetails',
  'ZJY': 'zhangZhenYuanDetails',
  'YHX': 'yanHaoXiangDetails',
  'HJL': 'heJunLinDetails'
};

// 根據成員代碼獲取詳細資料的函數
export const getMemberDetails = (memberCode) => {
  const memberDetailsMap = {
    'MJQ': maJiaQiDetails,
    'DLS': dingChengXinDetails,
    'SJY': songYaXuanDetails,
    'LWH': liuYaoWenDetails,
    'ZJY': zhangZhenYuanDetails,
    'YHX': yanHaoXiangDetails,
    'HJL': heJunLinDetails
  };

  return memberDetailsMap[memberCode] || null;
};

// 獲取所有成員的詳細資料
export const getAllMembersDetails = () => {
  return {
    'MJQ': maJiaQiDetails,
    'DLS': dingChengXinDetails,
    'SJY': songYaXuanDetails,
    'LWH': liuYaoWenDetails,
    'ZJY': zhangZhenYuanDetails,
    'YHX': yanHaoXiangDetails,
    'HJL': heJunLinDetails
  };
};
