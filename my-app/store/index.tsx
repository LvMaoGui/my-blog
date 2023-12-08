import React, { ReactElement, createContext, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createState, { RootStore } from './rootStore';

interface StoreProvideProps {
  initialValue: Record<any, any>;
  children: ReactElement;
}

// 设置是否为响应式 true:非响应式 false:响应式
enableStaticRendering(!process.browser);

const StoreContext = createContext({});

export const StoreProvide = function (props: StoreProvideProps) {
  const { initialValue, children } = props;

  const store: RootStore = useLocalObservable(createState(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

// 定义store hook
export const useStore = function () {
  const store: RootStore = useContext(StoreContext) as RootStore;
  if (!store) {
    throw new Error('数据不存在');
  } else {
    return store
  }
};
