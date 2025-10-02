// 導入所有綜藝節目資料
import { selfMadeVariety } from './selfMade.js';
import { documentaryRecord } from './documentary.js';
import { birthdayRecord } from './birthday.js';
import { externalVariety } from './external.js';
import { performanceVariety } from './performance.js';
import { tfFamilyPeriodVariety } from './tfFamily.js';
import { tytPeriodVariety } from './tytPeriod.js';

// 統一導出所有綜藝節目資料
export {
  selfMadeVariety,
  documentaryRecord,
  birthdayRecord,
  externalVariety,
  performanceVariety,
  tfFamilyPeriodVariety,
  tytPeriodVariety
};

// 綜藝節目分類對應表
export const varietyCategoryMap = {
  'selfMade': 'selfMadeVariety',
  'documentary': 'documentaryRecord',
  'birthday': 'birthdayRecord',
  'external': 'externalVariety',
  'performance': 'performanceVariety',
  'tfFamilyPeriod': 'tfFamilyPeriodVariety',
  'typhoonPeriod': 'tytPeriodVariety'
};

// 根據分類獲取綜藝節目資料的函數
export const getVarietyData = (category) => {
  const varietyDataMap = {
    'selfMade': selfMadeVariety,
    'documentary': documentaryRecord,
    'birthday': birthdayRecord,
    'external': externalVariety,
    'performance': performanceVariety,
    'tfFamilyPeriod': tfFamilyPeriodVariety,
    'typhoonPeriod': tytPeriodVariety
  };

  return varietyDataMap[category] || null;
};

// 獲取所有綜藝節目資料
export const getAllVarietyData = () => {
  return {
    selfMade: selfMadeVariety,
    documentary: documentaryRecord,
    birthday: birthdayRecord,
    external: externalVariety,
    performance: performanceVariety,
    tfFamilyPeriod: tfFamilyPeriodVariety,
    typhoonPeriod: tytPeriodVariety
  };
};

// 單一物件輸出（與原 varietyData.js 保持兼容）
export const varietyDetails = {
  selfMade: selfMadeVariety,
  documentary: documentaryRecord,
  birthday: birthdayRecord,
  external: externalVariety,
  performance: performanceVariety,
  traineePeriod: tfFamilyPeriodVariety,
  typhoonPeriod: tytPeriodVariety
};
