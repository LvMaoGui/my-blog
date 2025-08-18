import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message, Upload } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadLoading, _setUploadLoading] = useState(false)
  const [avatar, setAvatar] = useState('')

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
    request.get('/api/user/detail').then((res) => {
      if (res.code === '0') {
        const {avatar} = res.data.userInfo
        form.setFieldsValue(res.data.userInfo);
        if(avatar){
          setAvatar(avatar)
        }
      }
    });
  }, [form]);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="max-w-7xl w-full bg-white mx-auto h-svh flex p-5">
      <div className='w-full'>
        <h2 className={styles.title}>个人资料</h2>
        <div>
          <Form
            form={form}
            className='min-w-0 w-full mt-16'
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
            <Form.Item label="头像" name="avatar">
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                // beforeUpload={beforeUpload}
                // onChange={handleChange}
                customRequest={() => {

                }}
              >
                {avatar ? <img src={avatar} alt="" />  : uploadButton}
              </Upload>
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
