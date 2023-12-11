import { UserAttributes } from 'types/model-attribute';

export type UserType = Pick<
  UserAttributes,
  'id' | 'avatar' | 'introduce' | 'job' | 'nickname'
>;
