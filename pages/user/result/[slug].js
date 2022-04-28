import StudentRoute from "../../../components/routes/StudentRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Result, Button } from 'antd';
import { useCallback, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
const QuizResult = (

) => {
  useEffect(() => {
      document.title = "Result"
  }, []);
    const canvasStyles = {
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
      };
    // router


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
    return(
        <>
            <StudentRoute>
                <div className="contianer-fluid pt-3" onLoad={fire}>
                <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
                    <Result
                        icon = {<img src="../../gif/apple.gif" alt="apple" className="result-gif"/>}
                        title= {<span>Good Job! You have successfully answered this quiz! Wait for your instructor to return your grade.</span>}
                        subTitle="Good job! You have accomplished another milestone. Let's learn more!"
                        extra={[
                        <Button href="/user" >Home</Button>,
                        // <Button onClick={() => router.push(`/user/quiz-summary/${slug}`)} >View Summary</Button>,
                        ]}
                    />
                </div>
            </StudentRoute>
        </>
    )
}
export default QuizResult;