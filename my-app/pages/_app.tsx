import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { StoreProvide } from 'store';

interface MyAppProps extends AppProps {
  initialValue: Record<string, any>;
}

function MyApp({ Component, pageProps, initialValue }: MyAppProps) {
  return (
    <StoreProvide initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvide>
  );
}

MyApp.getInitialProps = async function ({ ctx }: { ctx: any }) {
  const { userId, avatar, nickname } = ctx?.req.cookies || {};
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
