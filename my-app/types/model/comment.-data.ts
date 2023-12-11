import { UserType } from 'types/common/user-data';
import { ArticleType } from './article-data';
import { CommentAttributes } from 'types/model-attribute';

export type CommentType = Pick<
  CommentAttributes,
  | 'id'
  | 'content'
  | 'create_time'
  | 'update_time'
  | 'is_delete'
  | 'user'
  | 'article'
> & {
  user: UserType,
  article: ArticleType,
};
