export interface UserAttributes {
  id: number;
  nickname: string;
  job: string;
  avatar: string;
  introduce: string;
}

export interface ArticleAttributes {
  id: number;
  title: string;
  content: string;
  views: number;
  update_time: string;
  create_time: string;
  is_delete: number;
  user: UserAttributes;
  comments: CommentAttributes[];
  tags: TagAttributes[];
  description: string;
  is_comment_enabled: number;
  cover: string;
}

export interface CommentAttributes {
  id: number;
  content: string;
  update_time: string;
  create_time: string;
  is_delete: number;
  user: UserAttributes;
  article: ArticleAttributes;
}

export interface TagAttributes {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: UserAttributes[];
  articles: ArticleAttributes[];
}
