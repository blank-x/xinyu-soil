export const StoreContext = React.createContext<{ dispatch?: any; getState?:() => object }>({});

export const useStore = () => {
  const { getState = () => ({}) } = useContext(StoreContext);
  const store: { basic?: { powerInfo?: {}; merchantId?: string; bmsBasicInfo?: any }} = getState() || {};
  return store;
};