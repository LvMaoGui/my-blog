import React, { useState, useEffect } from 'react';
import type { TagType } from 'types/model/tag-data';
import { Tabs, Button, message } from 'antd';
import type { TabsProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import request from 'service/fetch';
import styles from './index.module.scss';
import * as ANTD_ICONS from '@ant-design/icons';

const Tag = () => {
  const store = useStore();
  const [followTags, setFollowTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { userId } = store.user.userInfo;
  const [needRefresh,setNeedRefresh] = useState(false)

  const handleUnFollow = function(tagId:number){
    request.post('/api/tag/follow',{
      tagId,
      type:'unfollow'
    }).then((res: any) => {
      if (res.code === '0') {
        message.success('取关成功')
        setNeedRefresh(!needRefresh)
      }else{
        message.error(res.msg || '取关失败')
      }
    });
  }

  const handleFollow = function(tagId:number){
    request.post('/api/tag/follow',{
      tagId,
      type:'follow'
    }).then((res: any) => {
      if (res.code === '0') {
        message.success('关注成功')
        setNeedRefresh(!needRefresh)
      }else{
        message.error(res.msg || '关注失败')
      }
    });
  }

  const tagComponent = function(Tags:any[]){
    return (
      <div style={{display:'flex',justifyContent:'flex-start'}}>
      {Tags.map((tag:TagType) => (
        <div 
          key={tag.title} 
          style={{
            width:'200px',
            height:'200px',
            border:'1px soild #f3f3f3',
            padding:'20px',
            marginLeft:'20px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
          }}>
          <div> {(ANTD_ICONS as any)[tag.icon].render()}</div>
          <div style={{fontSize:'15px',fontWeight:'bold'}}>{tag.title}</div>
          <div><span>{tag.follow_count} 关注</span> <span>{tag.article_count} 文章</span></div>
          {
            tag?.users?.find((user)=> Number(user.id)===Number(userId)) ?  <Button onClick={()=>handleUnFollow(tag.id)}  type='primary'>已关注</Button> : <Button onClick={()=>handleFollow(tag.id)}>关注</Button>
          }
        </div>
      ))}
    </div>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: 'follow',
      label: '已关注标签',
      children: tagComponent(followTags),
      className: styles.tags,
    },
    {
      key: 'all',
      label: '全部标签',
      children: tagComponent(allTags),
      className: styles.tags,
    }
  ];

  useEffect(() => {
    request('api/tag/get').then((res: any) => {
      if (res.code === '0') {
        const { followTags = [], allTags = [] } = res.data;
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    });
  }, [userId, needRefresh]);

  const handleChange = function () {};
  return (
    <div className="content-layout">
      <Tabs defaultActiveKey="all" items={items} onChange={handleChange} className={styles.tagsTab}/>
    </div>
  );
};

export default observer(Tag);
