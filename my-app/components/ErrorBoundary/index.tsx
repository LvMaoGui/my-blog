import React from 'react';
import styles from './index.module.scss'

type ErrorState = {
  hasError: boolean,
};

class ErrorBoundary extends React.Component {
  state: ErrorState;
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    console.log(error);
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 可以在此处打印错误日志 进行错误上报等操作
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2>不好意思，页面发生错误了</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className={styles.tryAgainBtn}
          >
            重试一次试试
          </button>
        </div>
      );
    } else {
      return (this.props as any).children;
    }
  }
}

export default ErrorBoundary;
