import React from 'react';
import { Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const UpdateTime = ({
  date = '2025年12月28日',
  style = {},
  showIcon = false,
  size = 'small',
  align = 'left',
  iconOnly = false,
  showLabel = true
}) => {
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
      <Text style={combinedStyle} title={`最後更新：${date}`}>
        <ClockCircleOutlined />
      </Text>
    );
  }

  return (
    <Text style={combinedStyle}>
      {showIcon ? <ClockCircleOutlined style={{ marginRight: 4 }} /> : null}
      {showLabel ? '最後更新：' : ''}{date}
    </Text>
  );
};

export default UpdateTime;
