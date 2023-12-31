import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { StoreProvide } from 'store';
import ErrorBoundary from '@/components/ErrorBoundary';

interface MyAppProps extends AppProps {
  initialValue: Record<string, any>;
}

function MyApp({ Component, pageProps, initialValue }: MyAppProps) {
  const renderLayout = function () {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };

  return (
    <ErrorBoundary>
      <StoreProvide initialValue={initialValue}>{renderLayout()}</StoreProvide>
    </ErrorBoundary>
  );
}

MyApp.getInitialProps = async function ({ ctx }: { ctx: any }) {
  const { userId, avatar, nickname } = ctx?.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          avatar,
          nickname,
        },
      },
    },
  };
};

export default MyApp;
