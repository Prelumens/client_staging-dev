import StudentRoute from "../../../components/routes/StudentRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { Col, Card, Modal, Row, Typography, Avatar, Space, Button, message, Image, Spin } from 'antd';
import moment from 'moment';
import { AudioOutlined, AudioMutedOutlined, LoadingOutlined, CheckOutlined } from "@ant-design/icons";
import { useReactMediaRecorder } from "react-media-recorder";
import { ReactMediaRecorder } from "react-media-recorder";
import { Context } from "../../../context";

const SingleQuiz = (

) => {
    const {
        state: { user },
    } = useContext(Context);
    const { Title } = Typography;
    const [spin, setSpin] = useState(false);
    const [title, setTitle] = useState('')
    const [questionArray, setQuestionArray] = useState([]);
    const [description, setDescription] = useState('')
    const [quiz, setQuiz] = useState({
        title:''
    });
    const [mediaBlob, setMediaBlob] = useState();
    const [audio, setAudio] = useState({});
    const [attemptedQuestions, setAttemptedQuestions] = useState([])
    // router
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (slug) loadQuiz();
    }, [slug]);

    useEffect(()=>{
        document.title = title.toString()
    },[title])

    const loadQuiz = async () => {
        const { data } = await axios.get(`/api/user/single-quiz-student/${slug}`);
        setQuiz(data)
        setTitle(data.title)
        setDescription(data.description)
        setQuestionArray(data.questions)
        const temp = data.questions.map((question) => {
            return {
                title: question.title,
                optionType: question.optionType,
                selectedOptions: [],
            }
        })
        setAttemptedQuestions(temp)
    };

    const handleOptionSelect = (e, option, index) => {
        console.log('option',option)
        const temp = [...attemptedQuestions]
        const options = temp[index].selectedOptions
        if (!options.includes(option.text || option.image?.Location) && e.target.checked) {
            if (attemptedQuestions[index].optionType === 'radio') options[0] = option.image && !option.text ? option.image.Location : option.text
            else options.push(option.image && !option.text ? option.image.Location : option.text)
        }
        if (options.includes(option.text || option.image?.Location) && !e.target.checked) {
            const i = options.indexOf(option.image && !option.text ? option.image.Location : option.text)
            options.splice(i, 1)
        }
        temp[index].selectedOptions = options
        setAttemptedQuestions(temp)
    }

    const handleAudioSubmit = async (blob, index) => {
        const temp = [...attemptedQuestions]
        console.log('index', index)
        const options = temp[index].selectedOptions

        var reader = new FileReader();
        reader.onloadend = function () {
            submit(reader.result)
        };
        reader.readAsDataURL(mediaBlob)
        const submit = async (base) => {
            const { data } = await axios.post("/api/s3/audio-upload", {
                base: base
            });
            console.log('data', data)
            options.push(data.Location)
            temp[index].selectedOptions = options
            setAttemptedQuestions(temp)
            message.success('Audio recorded successfully.')
        }
    }

    const handleSubmit = () => {
        let answeredAll = true;
        attemptedQuestions.map((item) => {
            if(item.selectedOptions.length === 0){
                answeredAll = false
            }
        })
        if(!answeredAll){
            message.error("Please answer all questions")
        } else{
            try {
                setSpin(true)
                const addToStudentActivity = async () => {
                    if (user) {
                        try {
                            const { data } = await axios.put(`/api/student/completedQuiz/${user._id}`, {
                                title: "Quiz Completed",
                                description: `Your child completed the quiz ${quiz.title}`
                            })
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }

                const submit = async () => {
                    const { data } = await axios.post("/api/quiz/submit", {
                        quizId: quiz._id,
                        title: title,
                        questions: attemptedQuestions,
                        submitDate: moment()
                    });
                    toast("Quiz successfully submitted");
                    router.push(`/user/result/${quiz.slug}`);
                }

                Modal.confirm({
                    title: 'Are you sure you want to submit the quiz?',
                    onOk: () => {
                        addToStudentActivity()
                        submit()
                    }
                })
                setSpin(false)
            } catch (error) {
                console.log(error)
            }
        }


    }
    return (
        <StudentRoute>
                <div className="container-fluid p-3">
            <Spin spinning={spin}>

                    <div
                        className="profile-nav-bg"
                    ></div>

                    <Card
                        className="card-quiz-head"
                        title={
                            <Row justify="space-between" align="middle" gutter={[24, 0]}>
                                <Col span={24} md={12} className="col-info">
                                    <Space>
                                        <Avatar size={74} shape="square" src="../../gif/notebook.gif" />
                                            <h4 className="font-semibold m-0">{title}</h4>
                                    </Space>
                                </Col>
                                <Col
                                    span={24}
                                    md={12}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                </Col>
                            </Row>
                        }
                    >
                        <p className="text-muted">{description}</p>
                    </Card>

                    <Row gutter={[24, 0]}>
                        <Col span={24} className="mb-24">
                            {questionArray.map((question, index) => (
                                <div className='attempQuestionCard' key={index}>
                                    <Card
                                        title={<h6 className="font-semibold m-0">Question {index + 1}</h6>}
                                        className="header-solid h-full card-quiz-information"
                                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                                    >
                                        <div className='text-center'>
                                            {question.image && <Image width={300} src={question.image.Location}/>}
                                        </div>
                                        <p className="text-dark">
                                            {question.title}
                                        </p>
                                        <hr className="my-25" />
                                        {question.optionType !== 'audio' ? (
                                            <div className='option-div'>
                                                {question.options.map((option, ind) => (
                                                    <div className="ml-md-3 ml-sm-3 pt-sm-0 pt-3" id="options" key={ind}>
                                                        {question.optionType === 'radio' ? (
                                                            <label className="options">
                                                                {option.text.length !== 0 && !option.image?.Location ?
                                                                <p>
                                                                    {!option.text.includes('.jpeg' || '.png' || '.jpg') ? option.text : ''}
                                                                </p>
                                                                : option.text.length !== 0 ||  option.image.Location ?
                                                                    <div>
                                                                        <p>{!option.text.includes('.jpeg' || '.png' || '.jpg') ? option.text : ''}</p>
                                                                        <Image width={200} src={option.image.Location}/>
                                                                    </div>
                                                                :''
                                                                }
                                                                <input
                                                                    type="radio"
                                                                    hidden
                                                                    name={`option${index}`}
                                                                    onChange={(e) =>
                                                                        handleOptionSelect(e, option, index)
                                                                    }
                                                                />
                                                                <span className="radio"></span>
                                                            </label>
                                                        ) : (
                                                            <label className="options">
                                                                {option.text.length !== 0 && !option.image?.Location ?
                                                                <p>
                                                                    {!option.text.includes('.jpeg' || '.png' || '.jpg') ? option.text : ''}
                                                                </p>
                                                                : option.text.length !== 0 ||  option.image.Location ?
                                                                    <div>
                                                                        <p>{!option.text.includes('.jpeg' || '.png' || '.jpg') ? option.text : ''}</p>
                                                                        <Image width={200} src={option.image.Location}/>
                                                                    </div>
                                                                :''
                                                                }
                                                                <input
                                                                    type='checkbox' name='option'
                                                                    onChange={(e) =>
                                                                        handleOptionSelect(e, option, index)
                                                                    }
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <ReactMediaRecorder
                                                    audio
                                                    blobOptions={{ type: "audio/wav" }}
                                                    onStop={(blobUrl, blob) => {
                                                        setMediaBlob(blob)
                                                    }}
                                                    render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                                                        <Space className="p-2 pl-4 recordings" size="large">
                                                            {status === 'idle' || status === 'stopped' ?
                                                                <Button onClick={startRecording} type="primary" icon={<AudioOutlined />} shape="circle" size="large" />
                                                                : (
                                                                    <>
                                                                        <Button onClick={stopRecording} type="danger" icon={<AudioMutedOutlined />} shape="circle" size="large" />
                                                                        <h5>Recording... {<LoadingOutlined spin />}</h5>
                                                                    </>
                                                                )
                                                            }

                                                            {status === 'stopped' ?
                                                                <>
                                                                    <audio src={mediaBlobUrl} controls autoPlay />
                                                                    <Button onClick={() => handleAudioSubmit(mediaBlob, index)} icon={<CheckOutlined />} shape="circle" size="large" style={{ backgroundColor: '#5cb85c', color: '#fff' }} />
                                                                </>
                                                                : ''
                                                            }
                                                        </Space>
                                                    )}
                                                />
                                            </>
                                        )
                                        }
                                    </Card>
                                </div>
                            ))}
                        </Col>
                    </Row>

                    <div className="quiz">
                        <div className="d-flex align-items-center pt-3">
                            <div className="ml-auto mr-sm-5">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
            </Spin>
                </div>
        </StudentRoute>
    )
}
export default SingleQuiz;