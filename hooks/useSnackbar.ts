import { useCallback } from 'react';

export function useSnackbar() {
  const showError = useCallback((message: string) => {
    // 这里实现错误提示逻辑
    console.error(message);
    // 可以使用 toast 或其他提示组件
  }, []);

  return {
    showError
  };
} 