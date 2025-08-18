import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { AppDataSource } from 'db';
import { Article } from 'db/entity';
import { useState, useEffect } from 'react';
import {
  Input,
  Button,
  message,
  Divider,
  Typography,
  Switch,
  Form,
} from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import type { ArticleType } from 'types/model/article-data';
import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { TagType } from 'types/model/tag-data';
import Layout from '@/components/Layout';

import request from 'service/fetch';
import Dragger from 'antd/es/upload/Dragger';
import { CloseOutlined } from '@ant-design/icons';
import { uploader } from 'utils/qiniu';

interface ModifyEditorProps {
  article: ArticleType;
  articleId: string;
}

type FieldType = {
  title?: string,
  description?: string,
  content?: string,
  cover?: string,
  tags?: {lable:string,value: string}[],
  isCommentEnabled?: boolean,
};

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
  const [allTags, setAllTags] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tagIds, _setTagIds] = useState(
    article.tags ? article.tags.map((tag: TagType) => tag.id) : []
  );
  const [cover, setCover] = useState(article.cover);

  const [form] = Form.useForm();
  const { push } = useRouter();

  const handleUpdate = function () {
    form.submit();
  };

  useEffect(() => {
    request('/api/tags/get').then((res: any) => {
      if (res.code === '0') {
        const { allTags } = res.data;
        setAllTags(allTags);
      }
    });
  }, []);

  const onFinish = function (values: FieldType) {
    console.log(values);
    const { title, content, tags, isCommentEnabled,description} = values;
    request.post('/api/article/update', {
      title,
      content,
      articleId,
      tagIds: tags?.map(({value})=> value),
      cover,
      isCommentEnabled: isCommentEnabled === true ? 1 : 0,
      description
    })
    .then((res: any) => {
      if (res.code === '0') {
        message.success('更新成功');
        if (articleId) {
          push(`/article/${articleId}`);
        } else {
          push('/');
        }
      } else {
        message.error(res?.msg || '更新失败');
      }
    });
  };

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
    <Layout>
      <Form form={form} name="editArticle" onFinish={onFinish}>
        <div className="w-full flex items-center flex-col bg-white  min-h-full p-10">
          {/* <div className="p-4 pl-12 self-start antialiased">
          <h1>编辑文章</h1>
        </div> */}
          <div className="w-full max-w-7xl rounded-lg shadow-lg p-4 mb-5 border border-slate-100 flex flex-col">
            <div className="w-full">
              <p>详情</p>
              <Typography.Text type="secondary">
                标题, 简短描述, 图片...
              </Typography.Text>
            </div>
            <Divider />
            <div className="flex flex-col gap-3">
              <Form.Item
                name="title"
                initialValue={article.title}
                rules={[{ required: true, message: '请填写文章标题' }]}
              >
                <Input className="h-9" placeholder="文章标题"></Input>
              </Form.Item>

              <Form.Item
                name="description"
                initialValue={article?.description || ''}
                rules={[{ required: true, message: '请填写文章简介' }]}
              >
                <Input placeholder="描述" className="h-9"></Input>
              </Form.Item>

              <p>内容</p>
              <Form.Item
                name="content"
                initialValue={article.content}
                rules={[{ required: true, message: '请填写文章简介' }]}
              >
                <MDEditor
                  className="min-h-48"
                  // value={content}
                  // onChange={handleContetChange}
                />
              </Form.Item>

              <p>封面</p>
              <Form.Item
                name="cover"
                rules={[{ required: true, message: '请填写文章简介' }]}
              >
                <Dragger
                  maxCount={1}
                  showUploadList={false}
                  customRequest={(options) => {
                    const { file, onSuccess } = options;
                    // 测试上传接口
                    uploader(file, 'covers/', (domain: string, key: string) => {
                      const fileUrl = domain + key;
                      setCover(fileUrl);
                      onSuccess?.(fileUrl);
                    });
                  }}
                >
                  <div className="pl-4 pr-4 relative border-r min-h-60">
                    {cover ? (
                      <>
                        <img className="m-auto" src={cover} alt="" />
                        <div className="rounded-full w-8 h-8 bg-gray-700 bg-opacity-80 flex items-center justify-items-center absolute top-1 right-5 hover:bg-gray-500 hover:rotate-180 transition">
                          <CloseOutlined className="text-white m-auto " />
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="ant-upload-drag-icon">
                          <img
                            className="w-48 h-36 m-auto"
                            src="http://sl31ed3wk.hn-bkt.clouddn.com/upload-cover1.svg"
                            alt=""
                          />
                        </p>
                        <p className="ant-upload-text">拖放或选择您的文件</p>
                        <p className="ant-upload-hint">
                          支持单个文件上传，请勿上传与文章封面无关的文件
                        </p>
                      </div>
                    )}
                  </div>
                </Dragger>
              </Form.Item>

              <p>选择标签</p>
              <Form.Item
                name="tags"
                initialValue={defaultValue}
                rules={[{ required: true, message: '请选择标签' }]}
              >
                <Select
                  className="h-9"
                  mode="multiple"
                  placeholder="选择分类标签"
                  // onChange={handleSelectChange}
                  optionLabelProp="label"
                  options={options}
                  // defaultValue={defaultValue}
                  optionRender={(option) => (
                    <Space>
                      <span role="img" aria-label={option.data.label}>
                        {option.data.emoji}
                      </span>
                      {option.data.desc}
                    </Space>
                  )}
                />
              </Form.Item>
            </div>
          </div>

          <div className="pt-3 pb-10 flex w-full max-w-7xl justify-between">
            <div className="flex gap-1 items-center">
              <Form.Item
                name="isCommentEnabled"
                initialValue={true}
                rules={[{ required: true, message: '请选择标签' }]}
              >
                <span>开启评论</span>
                <Switch defaultChecked />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Button
                color="default"
                className="accent-pink-500 hover:scale-105"
                onClick={() => {}}
              >
                预览文章
              </Button>
              <Button
                color="default"
                className="accent-pink-500  hover:scale-105 border-none bg-stone-600 transition duration-300 ease-in-out"
                onClick={handleUpdate}
              >
                <span className="text-white "> 更新文章</span>
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Layout>
  );
};
ModifyEditor.layout = null;

export default observer(ModifyEditor);
