import React, { memo, useRef, useEffect } from 'react';
import lottie from 'lottie-web'; // Assuming you have lottie-web installed

const LOTTIE_PATH = 'https://assets.codepen.io/3685267/cute-cat-works.json';

const Lottie = memo(({ className, path }) => {
    const elm = useRef();
    const animation = useRef();

    useEffect(() => {
        animation.current = lottie.loadAnimation({
            path,
            container: elm.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });

        // Cleanup function to destroy the animation instance when the component unmounts
        return () => {
            if (animation.current) {
                animation.current.destroy();
            }
        };
    }, [path]);

    return <div className={className} ref={elm} />;
});

function CatLoader() {
    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.75)'  // semi-transparent black
        }}>
            <Lottie className="container mx-auto" path={LOTTIE_PATH} style={{ width: '100px', height: '100px' }} />
        </div>
    );
}

export default CatLoader;
