import type { NextPage } from 'next';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useRouter } from 'next/router';
import type { SelectProps } from 'antd';
import { Select, Space } from 'antd';
import { TagType } from 'types/model/tag-data';

import request from 'service/fetch';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

const NewEditor: NextPage = function () {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState<number[]>([]);

  const store = useStore();
  const { userId } = store.user.userInfo;
  const { push } = useRouter();

  const handlePublish = function () {
    if (!title) {
      message.warning('请输入文章标题');
      return;
    } else {
      request
        .post('/api/article/publish', {
          title,
          content,
          tagIds,
        })
        .then((res: any) => {
          if (res.code === '0') {
            message.success('发布成功');
            if(userId){
              push(`/user/${userId}`)
            } else {
              push('/')
            }
            // Todo跳转
          } else {
            message.error(res?.msg || '发布失败');
          }
        });
    }
  };

  useEffect(() => {
    request('/api/tags/get').then((res: any) => {
      if (res.code === '0') {
        const { allTags } = res.data;
        setAllTags(allTags);
      }
    });
  }, []);

  const handleContetChange = function (value?: string) {
    setContent(value || '');
  };

  const handleTitelChange = function (e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  };

  const handleSelectChange = function (value:any[]) {
    setTagIds(value);
  };

  const options: SelectProps['options'] = allTags.map((tag: TagType) => {
    return {
      label: tag.title,
      value: tag.id,
      desc: tag.title,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitelChange}
        ></Input>
        <Select
          mode="multiple"
          className={styles.selectTags}
          placeholder="选择分类标签"
          onChange={handleSelectChange}
          optionLabelProp="label"
          options={options}
          optionRender={(option) => (
            <Space>
              <span role="img" aria-label={option.data.label}>
                {option.data.emoji}
              </span>
              {option.data.desc}
            </Space>
          )}
        />
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
