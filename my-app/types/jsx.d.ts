// 为了兼容 react-markdown@7.0.1 与 React 19 的类型定义
// React 19 不再全局暴露 JSX 命名空间，但旧版本的 react-markdown 依赖它

import { JSX as ReactJSX } from 'react/jsx-runtime';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
    interface Element extends ReactJSX.Element {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
    interface LibraryManagedAttributes<C, P> extends ReactJSX.LibraryManagedAttributes<C, P> {}
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
  }
}

export {};