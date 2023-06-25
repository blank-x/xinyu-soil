export const useDebounce = (fn: (params: any, query?: any) => any, depen: Array<any>, t?: number, trailing?: boolean, leading?: boolean) => {
  const time = t || 2000;
  return useCallback(
    debounce(fn, time, { leading: leading === undefined ? true : leading, trailing: !!trailing }), [...depen]
  );
};