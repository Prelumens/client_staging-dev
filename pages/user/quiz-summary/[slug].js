import StudentRoute from "../../../components/routes/StudentRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Divider, Button, Card, Collapse, Row, Col, Avatar, Space, Image, Tag } from 'antd';
import {
    CheckCircleOutlined,
    FileDoneOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
  } from '@ant-design/icons';
import moment from 'moment';
const QuizSummary = (

) => {
    const { Panel } = Collapse;
	const [result, setResult] = useState({})
    const [quiz, setQuiz] = useState({});
    const [questionArray, setQuestionArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [studentAnswer, setStudentAnswer] = useState([]);
    const [total, setTotal] = useState('');
    // router
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        setQuestionArray([])
        setQuiz({})
        setResult({})
        if(slug)
        loadResult()
      }, [slug]);

    useEffect(() => {
        document.title = "Quiz Summary"
    }, []);

    const loadResult = async () => {
        const { data } = await axios.get(`/api/student/quiz/summary/${slug}`);
        // setResult(data.studentQuizInfo)
        if(data){
            setQuiz(data.quiz)
            setStudentAnswer(data.resultData.content)
            setQuestionArray(data.quiz.questions)
            setResult(data.resultData)
            console.log("data",data)
        }
    }
    return(

        <StudentRoute>
                <div className="container-fluid p-3">
                <div
                    className="summary-bg"
                >
                    <h1 className="text-center text-white pt-5">QUIZ SUMMARY</h1>
                </div>
                <Card
                    className="card-quiz-head"
                    title={
                    <Row justify="space-between" align="top" gutter={[24, 0]}>
                        <Col span={24} md={12} className="col-info">
                            <Space>
                                <Avatar size={74} shape="square" src="../../gif/apple.gif"/>
                                <h4 className="font-semibold m-0">{quiz.title}</h4>
                                <Tag color="geekblue">RETURNED</Tag>
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
                            <Space direction="vertical" align="center">
                            <p>SCORE</p>
                            <span>{Number(result.grade)} / {questionArray.length} </span>
                            </Space>
                        </Col>
                    </Row>
                    }
                >
                    <p className="text-muted"><FileDoneOutlined className='text-success' /> Completed on {moment(result.submissionDate).format("MMMM Do YYYY, LT")}</p>
                    <p>{quiz.description}</p>
                </Card>
                    <Row gutter={[24, 0]}>
                        <Col span={24} className="mb-24">
                            {questionArray.map((question, index) => (
                                <div className='attempQuestionCard' key={index}>
                                    <Card
                                        title={<h6 className="font-semibold m-0">Question {index+1}</h6>}
                                        className="header-solid h-full card-quiz-information"
                                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                                    >
                                        <div className='text-center'>
                                            {question.image && <Image  className="circlebox" width={300} src={question.image.Location}/>}
                                        </div>
                                        <p className="text-dark">
                                            {question.title}
                                        </p>
                                        <Divider/>
                                        {question.optionType !== 'audio' ? (
                                            <>
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
                                                                    disabled
                                                                    hidden
                                                                    name={`option${index}`}
                                                                    onChange={(e) =>
                                                                        handleOptionSelect(e, option.text, index)
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
                                                                        hidden
                                                                        disabled
                                                                        type='checkbox'name='option'
                                                                        onChange= {(e) =>
                                                                            handleOptionSelect(e, option.text, index)
                                                                        }
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Divider/>
                                                <div className="student-answer">
                                                    <Row>
                                                        <Col span={22}>
                                                            <h6>Your Answer:</h6>
                                                            {studentAnswer[index].selectedOptions.map((answer, ansInd) => (
                                                                <p className="pl-4 m-0" key={ansInd}>
                                                                    {!answer.includes('.jpeg' || '.png' || '.jpg') ? answer : <Image width={100} src={answer} />}
                                                                </p>
                                                            ))}
                                                        </Col>
                                                        <Col span={2}>
                                                            {studentAnswer[index].selectedOptions.includes(question.correctAnswer[0]?.text) ? (
                                                                <CheckCircleOutlined style={{fontSize: '36px'}} className="text-success"/>
                                                            ):(
                                                                <CloseCircleOutlined style={{fontSize: '36px'}} className="text-danger"/>
                                                            )
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                                {!studentAnswer[index].selectedOptions.includes(question.correctAnswer[0]?.text) &&
                                                    <div className="correct-answer">
                                                        <h6>Correct Answer:</h6>
                                                        {question.correctAnswer.map((correct, correctInd) => (
                                                            <p className="pl-4 m-0" key={correctInd}>
                                                                {!correct.text.includes('.jpeg' || '.png' || '.jpg') ? correct.text : <Image width={100} src={correct.text} />}
                                                            </p>
                                                        ))}
                                                    </div>
                                                }
                                            </>
                                        ) : <div className="student-answer">
                                                <h6>Your Answer:</h6>
                                                <audio src={studentAnswer[index].selectedOptions[0]} controls />
                                            </div>
                                        }
                                    </Card>
                                </div>
                            ))}
                        </Col>
                    </Row>
                    <div className="d-flex align-items-center pt-3">
                        <div className="ml-auto mr-sm-5">
                            <Button
                            type="primary"
                            href="/user">
                                Home
                            </Button>
                        </div>
                    </div>
                </div>

        </StudentRoute>
    )
}
export default QuizSummary;