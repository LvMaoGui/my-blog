import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { StoreProvide } from 'store';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/components/ui/toaster';
import { ThemeProvider } from '@/components/hooks/use-theme';
import { Fragment } from 'react';

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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <StoreProvide initialValue={initialValue}>
          <Fragment>
            {renderLayout()}
            <Toaster />
          </Fragment>
        </StoreProvide>
      </ThemeProvider>
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
