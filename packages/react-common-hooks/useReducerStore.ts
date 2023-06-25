import React, { useReducer, useMemo } from 'react';

export const useReducerStore = function(
  actions,
  reducer,
  initialState,
  init
) {
  const [state, dispatch] = useReducer(reducer, initialState, init || ((initialArg) => initialArg));
  const action  = useMemo(() => {
    const filterAction = (fn, payload) => {
      // eslint-disable-next-line no-underscore-dangle
      const _fn = fn(payload);
      if (typeof _fn == 'object') {
        dispatch(_fn);      // 同步action直接派发
      } else {
        // 异步action,执行此方法
        _fn(dispatch, state);
      }
    };
    return Object.keys(actions).reduce((res, actionName) => {
      const fn = (payload) => { filterAction(actions[actionName], payload); };
      res[actionName] = fn;
      return res;
    }, {});
  }, []);
  return { state, dispatch, action };
};