import { ArticleAttributes } from 'types/model-attribute';
import { UserType } from 'types/common/user-data';
import { CommentType } from './comment.-data';

export type ArticleType = Pick<
  ArticleAttributes,
  | 'id'
  | 'content'
  | 'title'
  | 'create_time'
  | 'update_time'
  | 'is_delete'
  | 'user'
  | 'views'
  | 'comments'
> & {
  user: UserType,
  comments: CommentType[],
};
