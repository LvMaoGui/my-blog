import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import { ConfigProvider, type ColorPickerProps, type GetProp, Button } from 'antd';
import { ReactNode } from 'react';
import React from 'react';
import { useState } from 'react';

type Color = Extract<GetProp<ColorPickerProps, 'value'>, { cleared: any }>;

type ThemeData = {
  borderRadius: number,
  colorPrimary: string,
  Button?: {
    colorPrimary: string,
    algorithm?: boolean,
  },
};

const defaultData: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#1677ff',
  Button: {
    colorPrimary: '#00B96B',
  },
};

const Layout = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ThemeData>(defaultData);
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: data.colorPrimary,
            borderRadius: data.borderRadius,
          },
          components: {
            Button: {
              colorPrimary: data.Button?.colorPrimary,
              algorithm: data.Button?.algorithm,
            },
          },
        }}
      >
        <Navbar />
        <Button>123</Button>
        <main className="pt-16 shadow-md">{children}</main>
        <Footer />
      </ConfigProvider>
    </div>
  );
};

export default Layout;
