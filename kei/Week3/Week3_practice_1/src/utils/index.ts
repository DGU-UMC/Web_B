// 현재 경로 가져오기
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

// 경로 이동하기
export const navigateTo = (path: string): void => {
  window.history.pushState({}, '', path);
  // 페이지 전체를 새로고침하지 않고 경로만 바꾸는 방식
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};