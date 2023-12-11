export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布文章失败',
  },
  UPDATE_FAILES: {
    code: 2002,
    msg: '更新文章失败',
  },
  NOT_FOUND: {
    code: 2003,
    msg: '文章未找到',
  },
};

export const EXCEPTION_USER = {};
export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表评论失败',
  },
  PUBLISH_ASSOCFAILED: {
    code: 4002,
    msg: '发表评论失败, 用户或文章信息有误',
  },
};
