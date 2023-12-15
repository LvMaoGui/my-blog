import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { AppDataSource } from 'db';
import { Article } from 'db/entity';
import { ChangeEvent, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import type { ArticleType } from 'types/model/article-data';
import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { TagType } from 'types/model/tag-data';

import request from 'service/fetch';

interface ModifyEditorProps {
  article: ArticleType;
  articleId: string;
}

export async function getServerSideProps({
  params,
}: {
  params: Record<string, any>,
}) {
  const articleId = params.id;

  const db = await AppDataSource;
  const ArticleRepo = await db.getRepository(Article);
  const article = await ArticleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'tags'],
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
      articleId,
    },
  };
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

const ModifyEditor = function (props: ModifyEditorProps) {
  const { article, articleId } = props;
  const [content, setContent] = useState(article.content);
  const [title, setTitle] = useState(article.title);
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState(
    article.tags ? article.tags.map((tag: TagType) => tag.id) : []
  );

  const { push } = useRouter();

  const handleUpdate = function () {
    if (!title) {
      message.warning('请输入文章标题');
      return;
    } else {
      request
        .post('/api/article/update', {
          title,
          content,
          articleId,
          tagIds,
        })
        .then((res: any) => {
          if (res.code === '0') {
            message.success('更新成功');
            articleId ? push(`/article/${articleId}`) : push('/');
          } else {
            message.error(res?.msg || '更新失败');
          }
        });
    }
  };

  const handleContetChange = function (value?: string) {
    setContent(value || '');
  };

  const handleTitelChange = function (e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  };

  const handleSelectChange = function (value: any) {
    setTagIds(value);
  };

  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res.code === '0') {
        const { allTags } = res.data;
        setAllTags(allTags);
      }
    });
  }, []);

  const defaultValue = tagIds.map((tagId) => {
    const { title } =
      article.tags.find((tag: TagType) => tag.id === tagId) || {};
    return { lable: title, value: +tagId };
  });

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
          defaultValue={defaultValue}
          optionRender={(option) => (
            <Space>
              <span role="img" aria-label={option.data.label}>
                {option.data.emoji}
              </span>
              {option.data.desc}
            </Space>
          )}
        />
        <Button type="primary" onClick={handleUpdate}>
          更新文章
        </Button>
      </div>
      <MDEditor height={1080} value={content} onChange={handleContetChange} />;
    </div>
  );
};
ModifyEditor.layout = null;

export default observer(ModifyEditor);
