import React from 'react'
import { Button, Space } from 'antd'
import ReactCanvasConfetti from "react-canvas-confetti";
import { useCallback, useRef, useEffect } from "react";
const InteractiveOutro = ({score}) => {
    useEffect(() => {
        fire()
    }, [score]);
    const canvasStyles = {
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
      };
      const refAnimationInstance = useRef(null);

        const getInstance = useCallback((instance) => {
          refAnimationInstance.current = instance;
        }, []);

        const makeShot = useCallback((particleRatio, opts) => {
          refAnimationInstance.current &&
            refAnimationInstance.current({
              ...opts,
              origin: { y: 0.7 },
              particleCount: Math.floor(200 * particleRatio)
            });
        }, []);

        const fire = useCallback(() => {
          makeShot(0.25, {
            spread: 26,
            startVelocity: 55
          });

          makeShot(0.2, {
            spread: 60
          });

          makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
          });

          makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
          });

          makeShot(0.1, {
            spread: 120,
            startVelocity: 45
          });
        }, [makeShot]);
    return (
        <div className='interactive-end text-center'>
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
            <Space direction='vertical' className='mt-5'>
                <h1>Activity Result</h1>
                <h3>Good job! You got {<b className='text-warning'>{score}</b>} points!</h3>
                <h6>You've learn new things today. Let's keep on learning!</h6>
                <Button size='large' type="primary" href="/user" className="mb-4">Home</Button>
            </Space>
        </div>
    )
}

export default InteractiveOutro