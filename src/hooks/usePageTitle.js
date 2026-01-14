import { useEffect } from 'react';

/**
 * 設定瀏覽器分頁 Title 的自訂 Hook
 * @param {string} title 要顯示的標題文字
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);
};


