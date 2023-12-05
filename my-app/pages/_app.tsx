import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('app');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
