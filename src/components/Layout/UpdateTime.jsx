import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { dbService } from '../../services/database';

const { Text } = Typography;

const UpdateTime = ({
  date, // 移除預設值，改為從資料庫載入
  style = {},
  showIcon = false,
  size = 'small',
  align = 'left',
  iconOnly = false,
  showLabel = true
}) => {
  const [latestDate, setLatestDate] = useState(date || '');
  const [formattedDate, setFormattedDate] = useState('');

  // 從資料庫載入最新更新日期
  useEffect(() => {
    const loadLatestDate = async () => {
      try {
        const dateStr = await dbService.getLatestUpdate();
        if (dateStr) {
          setLatestDate(dateStr);
        }
      } catch (error) {
        console.error('載入最新更新日期失敗:', error);
        // 如果載入失敗，使用傳入的 date prop 或預設值
        if (!date) {
          setLatestDate('2026年1月26日');
        }
      }
    };

    // 如果有傳入 date prop，優先使用
    if (date) {
      setLatestDate(date);
    } else {
      loadLatestDate();
    }
  }, [date]);

  // 格式化日期為「YYYY年M月D日」，直接從字串提取數字，不轉換時區
  useEffect(() => {
    if (!latestDate) {
      setFormattedDate('');
      return;
    }

    try {
      const dateStr = String(latestDate);

      // 如果是 YYYY-MM-DD 格式，直接提取數字
      if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        // 直接使用字串中的數字，不轉換時區
        setFormattedDate(`${year}年${parseInt(month)}月${parseInt(day)}日`);
      } else if (dateStr.includes('年')) {
        // 如果已經是「YYYY年M月D日」格式，直接使用
        setFormattedDate(dateStr);
      } else {
        // 其他格式（如 "Tue Dec 01 2025"），嘗試解析
        const dateObj = new Date(dateStr);
        if (!Number.isNaN(dateObj.getTime())) {
          // 直接從 Date 物件提取年月日數字，不轉換時區
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          setFormattedDate(`${year}年${month}月${day}日`);
        } else {
          // 無法解析，顯示原始字串
          setFormattedDate(dateStr);
        }
      }
    } catch (error) {
      console.error('格式化日期失敗:', error);
      setFormattedDate(String(latestDate));
    }
  }, [latestDate]);

  const defaultStyle = {
    fontSize: size === 'small' ? '12px' : '14px',
    color: '#999',
    fontStyle: 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
  };

  const combinedStyle = { ...defaultStyle, ...style };

  if (iconOnly) {
    return (
      <Text style={combinedStyle} title={`最後更新：${formattedDate || latestDate}`}>
        <ClockCircleOutlined />
      </Text>
    );
  }

  return (
    <Text style={combinedStyle}>
      {showIcon ? <ClockCircleOutlined style={{ marginRight: 4 }} /> : null}
      {showLabel ? '最後更新：' : ''}{formattedDate || latestDate}
    </Text>
  );
};

export default UpdateTime;
