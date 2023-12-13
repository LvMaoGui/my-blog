import { TagAttributes } from 'types/model-attribute';

export type TagType = Pick<
  TagAttributes,
  | 'id'
  | 'title'
  | 'icon'
  | 'follow_count'
  | 'article_count'
  | 'articles'
  | 'users'
>;
