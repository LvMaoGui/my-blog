import { TagType } from 'types/model/tag-data';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/components/ui/badge';
import { Button } from '@/components/components/ui/button';
import { Filter, X } from 'lucide-react';
import request from 'service/fetch';

interface TagFilterProps {
  tags: TagType[];
  setArticlesData: (data: any)=>void;
}

const TagFilter = ({ tags, setArticlesData }: TagFilterProps) => {
  const [selectedTags, setSelectedTags] = useState<{tag:string,id:number}[]>([]);

  const handleTagToggle = (tag: string, id: number) => {
    const isSelected = selectedTags.some((stag) => stag.id === id);
    const nextSelectedTags = isSelected
      ? selectedTags.filter((t) => t.id !== id)
      : [...selectedTags, { tag, id }];

    setSelectedTags(nextSelectedTags);
  };

  const handleClearAll = () => {
    setSelectedTags([]);
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
  }, [selectedTags, setArticlesData]);

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">标签筛选</span>
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5">
              {selectedTags.length}
            </Badge>
          )}
        </div>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            清除
          </Button>
        )}
      </div>

      {/* Compact Tags */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const isSelected = selectedTags.some((stag) => stag.id === tag.id);
            return (
              <Badge
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105 text-xs px-2.5 py-1
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 shadow-sm'
                      : 'border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20'
                  }
                `}
                onClick={() => handleTagToggle(tag.title, tag.id)}
              >
                {tag.title}
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <span className="text-sm">暂无标签</span>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
