import { AppDataSource } from 'db';
import { Article } from 'db/entity';

import type { ArticleType } from 'types/model/article-data';
import styles from './index.module.scss';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';

import request from 'service/fetch';

export async function getServerSideProps({
  params,
}: {
  params: Record<string, any>,
}) {
  console.log('params😀', params);
  const articleId = params.id;

  const db = await AppDataSource;
  const ArticleRepo = await db.getRepository(Article);
  const article = await ArticleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'comments', 'comments.user'],
  });
  console.log('article😀', article);
  if (article) {
    // 阅读次数+1
    article.views = article.views + 1;
    await ArticleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
      articleId,
    },
  };
}

interface ArticleDetailProps {
  article: ArticleType;
  articleId: string;
}

const ArticleDetail = function (props: ArticleDetailProps) {
  const { article, articleId } = props;
  const {
    user: { nickname, avatar, id },
    comments,
  } = article;
  const store = useStore();
  const loginUserInfo = store.user.userInfo;
  const [inputVal, setInputVal] = useState('');
  const [commentsView, setCommentsView] = useState(comments);

  const handleInputValChange = function (e: ChangeEvent<HTMLTextAreaElement>) {
    setInputVal(e.target.value);
  };

  const handleComment = function () {
    request
      .post('/api/comment/publish', {
        content: inputVal,
        articleId,
        userId: id,
      })
      .then((res: any) => {
        if (res.code === '0') {
          message.success(res.msg || '发表成功');

          // 追加评论
          const newComment = [res.data];
          setCommentsView([...commentsView, ...newComment]);
          setInputVal('');
        } else {
          message.error(res.msg || '发表失败');
        }
      });
  };
  return (
    <div className={styles.article_detail}>
      <div className="content-layout">
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.user}>
          <Avatar src={'.' + avatar} />
          <div className={styles.info}>
            <div className={styles.nickname}>{nickname}</div>
            <div className={styles.date}>
              <div className={styles.update_time}>
                {format(new Date(article.update_time), 'yyyy-MM-dd HH:mm:ss')}
              </div>
              <div className={styles.views}>阅读 {article.views}</div>
              {Number(loginUserInfo.userId) === Number(id) ? (
                <Link
                  href={`/editor/${articleId}`}
                  className={styles.editorOperate}
                >
                  编辑
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <Markdown className={styles.markdown}>{article.content}</Markdown>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <h3>评论</h3>
        <div className={styles.comment}>
          {loginUserInfo.userId && (
            <div className={styles.enter}>
              <Avatar src={'.' + avatar} size={40}></Avatar>
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={handleInputValChange}
                />
                <Button
                  className={styles.comment_btn}
                  type="primary"
                  onClick={handleComment}
                >
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {commentsView.map((comment) => (
              <div className={styles.wrapper} key={comment.id}>
                <Avatar src={'.' + comment.user.avatar} size={40}></Avatar>
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div className={styles.nickname}>
                      {comment.user.nickname}
                    </div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment.content}</div>
                  <div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
