import { useState, useEffect, useRef } from 'react';

import styles from './index.module.scss'

interface CountProps {
  time: number;
  onEnd: Function;
}
const CountDown = function (props: CountProps) {
  const { time, onEnd } = props;

  const [count, setCount] = useState(time || 60);

  const interval = useRef(null) as any;

  useEffect(() => {
    if (!interval.current) {
      interval.current = setInterval(() => {
        setCount((preCount) => {
          return preCount - 1;
        });
      }, 1000);
    }
  }, []);

  useEffect(()=>{
    if(count < 0){
      clearInterval(interval.current)
      typeof onEnd === "function" && onEnd()
    }
  },[count,onEnd])

  return <div className={styles.countDown}>{count}</div>;
};

export default CountDown;
