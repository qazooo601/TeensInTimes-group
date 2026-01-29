import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 滾動位置恢復 Hook
 * - 記錄每個路由的滾動位置
 * - 返回時恢復滾動位置
 * - 進入新頁面時滾動到頂部
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const previousPathname = useRef(location.pathname);
  const isPopState = useRef(false);

  useEffect(() => {
    // 監聽 popstate 事件（瀏覽器返回/前進按鈕）
    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener('popstate', handlePopState);

    // 檢查是否有保存的滾動位置
    const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
    const navigationType = sessionStorage.getItem(`nav_type_${location.pathname}`);

    // 判斷是否需要恢復滾動位置
    const shouldRestore = navigationType === 'back' && savedPosition && savedPosition !== '0';

    // 對於需要等待資料載入的頁面（如 /members, /music, /concerts），不立即執行滾動恢復
    // 讓頁面自己的邏輯來處理滾動恢復
    const pagesWithCustomScrollRestore = ['/members', '/music', '/concerts'];
    const hasCustomScrollRestore = pagesWithCustomScrollRestore.includes(location.pathname);

    if (shouldRestore && !hasCustomScrollRestore) {
      // 返回時恢復滾動位置（僅對沒有自定義滾動恢復的頁面）
      const position = parseInt(savedPosition, 10);
      // 使用 setTimeout 確保 DOM 已渲染完成
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'auto'
        });
      }, 100);
      // 清除標記，下次進入時視為新頁面
      sessionStorage.removeItem(`nav_type_${location.pathname}`);
    } else if (!hasCustomScrollRestore) {
      // 新頁面或前進導航，滾動到頂部（僅對沒有自定義滾動恢復的頁面）
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
    // 對於有自定義滾動恢復的頁面，不清除 nav_type，讓頁面自己處理

    // 重置 popstate 標記
    if (isPopState.current) {
      isPopState.current = false;
    }

    // 監聽滾動事件，記錄當前位置
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentPosition = window.scrollY;
          sessionStorage.setItem(`scroll_${location.pathname}`, currentPosition.toString());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 更新前一個路徑
    previousPathname.current = location.pathname;

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
      // 在離開頁面前保存當前滾動位置
      // 但不要覆蓋已經明確保存的位置（例如點擊卡片時保存的位置）
      const currentPosition = window.scrollY;
      const existingPosition = sessionStorage.getItem(`scroll_${previousPathname.current}`);
      // 只有在沒有現有位置，或者當前位置不是 0 時才保存
      // 這樣可以避免在導航時覆蓋已經保存的位置
      if (!existingPosition || (currentPosition > 0 && parseInt(existingPosition, 10) < currentPosition)) {
        sessionStorage.setItem(`scroll_${previousPathname.current}`, currentPosition.toString());
      }
    };
  }, [location.pathname]);
};

