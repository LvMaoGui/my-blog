import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';
import { useRouter } from 'next/router';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4 },
};

type FormValus = {
  nickname: string,
  job: string,
  introduce: string,
};

const UserProfile = function () {
  const [form] = Form.useForm();
  const { push } = useRouter();

  const handSubmit = function (values: FormValus) {
    request
      .post('/api/user/update', {
        userInfo: values,
      })
      .then((res: any) => {
        if (res.code === '0') {
          message.success('修改成功');
          const userId = res.data.userInfo.id;
          push(`/user/${userId}`);
        } else {
          message.error(res.msg || '修改失败');
        }
      });
  };

  useEffect(() => {
    request('/api/user/detail').then((res: any) => {
      if (res.code === '0') {
        form.setFieldsValue(res.data.userInfo);
      }
    });
  }, [form]);

  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2 className={styles.title}>个人资料</h2>
        <div>
          <Form
            form={form}
            className={styles.form}
            onFinish={handSubmit}
            {...layout}
          >
            <Form.Item label="用户名" name="nickname">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="职位" name="job">
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item label="个人介绍" name="introduce">
              <Input placeholder="请输入个人介绍" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(UserProfile);
