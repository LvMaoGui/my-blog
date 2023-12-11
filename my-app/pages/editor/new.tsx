import type { NextPage } from 'next';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import { Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useRouter } from 'next/router';

import request from 'service/fetch'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

const NewEditor: NextPage = function () {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');

  const store = useStore();
  const { userId } = store.user.userInfo
  const { push } = useRouter()

  const handlePublish = function () {
    if(!title){
      message.warning('请输入文章标题')
      return;
    } else {
      request.post('/api/article/publish',{
        title,
        content
      }).then((res:any)=>{
        if(res.code === '0'){
          message.success('发布成功')
          userId ? push(`/user/${userId}`) : push('/')
          // Todo跳转
        }else {
          message.error(res?.msg || '发布失败')
        }
      })
    }
  };

  const handleContetChange = function (value?: string) {
    setContent(value || '');
  };

  const handleTitelChange = function (e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitelChange}
        ></Input>
        <Button type="primary" onClick={handlePublish}>
          发布文章
        </Button>
      </div>
      <MDEditor height={1080} value={content} onChange={handleContetChange} />;
    </div>
  );
};

(NewEditor as any).layout = null;

export default observer(NewEditor);
