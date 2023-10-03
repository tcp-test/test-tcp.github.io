'use client'
import  { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
 
export default function Animation(props:any) {
    const { renderer, loop, path, canvasStyle }  = props;
 
    const lottieRef = useRef(null);
    const [, setLottie] = useState<AnimationItem>();
    useEffect(() => {
        setLottie(
            lottie.loadAnimation({
                container: lottieRef.current,
                // 渲染方式
                renderer,
                // autoplay 自动播放
                // 是否循环播放
                loop,
                // 路径
                path,
            })
        );
    }, []);

    return (
        <div>
            <div ref={lottieRef} className="lottie" style={canvasStyle}></div>
        </div>
    )
  }
  