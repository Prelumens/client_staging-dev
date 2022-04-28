import StudentRoute from "../../../components/routes/StudentRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import InteractiveCard from "../../../components/cards/InteractiveCard"
import { Affix, Tooltip, Modal, Text, Typography, Avatar, List, Button, BackTop } from 'antd';
import AnimatedBackground from "../../../components/AnimatedBackground"
import ReactPlayer from 'react-player'
import { SyncOutlined, SoundOutlined } from "@ant-design/icons";
import moment from 'moment';
import InteractiveIntro from '../../../components/InteractiveIntro'
import InteractiveOutro from '../../../components/InteractiveOutro'
import { Context } from "../../../context";

const SingleInteractive = (
) => {
    const {
        state: { user },
    } = useContext(Context);
    const { Text } = Typography;
    const [play, setPlay] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultPage, setResultPage] = useState(false);
    const [questionArray, setQuestionArray] = useState([]);
    const [answers, setAnswersArray] = useState([]);
    const [interactive, setInteractive] = useState({
        title: ''
    });
    const [score, setScore] = useState(0)
    const [id, setId] = useState(0)
    const [stage, setStage] = useState('start');

    const [state, setState] = useState({
        question: {},
        isLoading: true
    })

    const addPoint = () => {
        setScore(prevState => prevState + 1)
        console.log("scores", score)
    }

    // router
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadInteractive();
        setState({
            question: {},
            isLoading: true
        })
    }, [slug]);

    useEffect(()=>{
        document.title = interactive.title
    },[interactive.title])

    useEffect(() => {
        const questions = questionArray
        if (questionArray) {
            const currentQuestion = questions[id]
            const isLast = id === questions.length - 1
            setState({
                question: currentQuestion,
                isLoading: false,
                isLast: isLast
            })
        }
    }, [id, questionArray])

    const loadInteractive = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/student/interactive/${slug}`);
            console.log("data", data)
            if (data) {
                setInteractive(data);
                setQuestionArray(data.questions)
                setLoading(false);
                setPlay(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        try {
            const addToStudentActivity = async () => {
                if (user) {
                    try {
                        const { data } = await axios.put(`/api/student/completedInteractive/${user._id}`, {
                            title: "Interactive Completed",
                            description: `Your child completed the interactive ${interactive.title}`
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            const submit = async () => {
                const { res } = await axios.post("/api/interactive/submit", {
                    score,
                    submissionDate: moment(),
                    answers,
                    interactive
                });
                toast("Activity successfully submitted");
                setStage('end')
            }
            Modal.confirm({
                title: 'Are you sure you want to submit the activity?',
                onOk: () => {
                    addToStudentActivity()
                    submit()
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        setPlay(false);
    }, []);

    if (loading) return (<SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />)
    return (
        <StudentRoute>
            <ReactPlayer
                url="https://youtu.be/lIW2AveDMOo"
                playing={play}
                loop={true}
                width="0"
                height="0"
                volume="0.3"
            />

            {stage === 'start' ?
                <InteractiveIntro interactive={interactive} setStage={setStage} />
                : stage === 'ongoing' ?
                    <div style={{height: '100%', width: '100%', backgroundColor:'#4e54c8'}}>
                        <AnimatedBackground>
                            <BackTop />
                            <Affix>
                                <Tooltip title="Toggle Audio" onClick={() => setPlay(!play)} className="p-2">
                                    {play ?
                                        <span><a>MUTE</a></span> : <SoundOutlined style={{ fontSize: '18px' }} />
                                    }
                                </Tooltip>
                            </Affix>
                            <div className="interactive d-flex dynamic flex-column justify-content-center align-items-center py-5">
                                <div className="row container">
                                    <div className="offset-sm-1 offset-lg-3 col-12 col-sm-10 col-lg-6">
                                        <div className="header">
                                            <div >
                                                <div className="h1 bold">
                                                    {interactive.title}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="interactive-card data shadow-lg">
                                            <InteractiveCard
                                                id={id}
                                                setId={setId}
                                                questionArray={questionArray}
                                                addPoint={addPoint}
                                                state={state}
                                                slug={slug}
                                                handleSubmit={handleSubmit}
                                                answers={answers}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedBackground>
                    </div>
                    : <InteractiveOutro score={score} />
            }



        </StudentRoute>
    )
}
export default SingleInteractive;