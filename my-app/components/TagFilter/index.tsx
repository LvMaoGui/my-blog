import { TagType } from 'types/model/tag-data';
import React, { useEffect, useState } from 'react';
import { Space, Tag } from 'antd';
import styles from './index.module.scss';

import request from 'service/fetch';

const { CheckableTag } = Tag;

interface TagFilterProps {
  tags: TagType[];
  setArticlesData: (data: any)=>void;
}

const TagFilter = ({ tags, setArticlesData }: TagFilterProps) => {
  const [selectedTags, setSelectedTags] = useState<{tag:string,id:number}[]>([]);

  const handleChange = (tag: string, id: number, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, { tag, id }]
      : selectedTags.filter((t) => t.id !== id);

    setSelectedTags(nextSelectedTags);
  };

  useEffect(() => {
    request
      .post('/api/article/get', {
        tagIds: selectedTags.map((tag) => tag.id),
      })
      .then((res: any) => {
        if (res.code === '0') {
          setArticlesData(res.data);
        }
      });
  }, [selectedTags,setArticlesData]);

  return (
    <div className={styles.container}>
      <Space size={[0, 8]} wrap>
        {tags.map((tag) => (
          <CheckableTag
            key={tag.title}
            checked={selectedTags.some((stag) => stag.id === tag.id)}
            onChange={(checked) => handleChange(tag.title, tag.id, checked)}
          >
            {tag.title}
          </CheckableTag>
        ))}
      </Space>
    </div>
  );
};

export default TagFilter;
