import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import QuestionsCreatedCard from "../../../../components/cards/QuestionsCreatedCard"
import axios from "axios";
import { Button, Popconfirm, PageHeader, Divider, Tag, Typography, Skeleton, Tooltip, Row, Col, Card, List, Avatar, Image, Space, Checkbox, Statistic, Modal } from 'antd'
import { EditOutlined, DeleteOutlined, MenuUnfoldOutlined, RollbackOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { toast } from "react-toastify";
import moment from 'moment';

const QuizView = (
) => {
    const { Paragraph, Title } = Typography;
    const [questionArray, setQuestionArray] = useState([]);
    const [quiz, setQuiz] = useState({
        title:''
    });
    const [responses, setResponses] = useState([]);
    const [visible, setVisible] = useState(false);
    const [questionSet, setQuestionSet] = useState([]);
    const [singleView, setSingleView] = useState({});
    const [grade, setGrade] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        document.title= quiz.title
    }, [quiz]);

    useEffect(() => {
        slug && loadQuestions();
    }, [slug]);

    const loadQuestions = async () => {
        try {
            const { data } = await axios.get(`/api/quiz-data/${slug}`);
            // setQuiz({title: data.title, slug:data.slug, access: data.access, questions:data.questions})
            setQuiz(data.quiz)
            setQuestionArray(data.quiz.questions)
            var responsestoDisplay = data.responses.filter(response => {
                return response.student !== null;
            });
            setResponses(responsestoDisplay)
            console.log(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (quizId) => {
        try {
            const { deletedQuiz } = await axios.put(`/api/quiz/delete/${slug}`);
            console.log(deletedQuiz)
            toast.success("Quiz deleted")
            router.push(`/instructor/course/view/${slug}`);
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    const openModal = (item) => {
        setQuestionSet(item.content)
        setSingleView(item)
        setVisible(true)
        setGrade(item.grade)
    }
    function onChange(e) {
        console.log('e.target.checked', e.target.checked)
        let score = grade
        if (grade <= questionSet.length && e.target.checked) {
            score++
        } else if (grade > 0) {
            score--
        }
        if ((grade <= questionSet.length) === true) setGrade(score)
    }
    const submitGrade = async () => {
        try {
            const { data } = await axios.put(`/api/quiz/update-score/`, {
                grade: Number(grade),
                submission: singleView,
            });
            toast("Saved successfully!");
            window.location.reload(false);
        } catch (error) {
            console.log("error")
        }
    }

    const returnGrade = async (item) => {
        try {
            const { data } = await axios.put(`/api/quiz/return/`, {
                submission: item,
            });
            toast("Quiz returned successfully!");
            window.location.reload(false);
        } catch (error) {
            console.log("error")
        }
    }
    return (
        <InstructorRoute>
            <div className="container-fluid pt-3 layout-default content">
            {loading ? <Skeleton avatar paragraph={{ rows: 2 }} />
            :
                <PageHeader
                    className="site-page-header-responsive gradient-banner"
                    onBack={() => window.history.back()}
                    title={quiz.title}
                    tags={quiz.access ? (
                        <Tag color="#3b5999">POSTED</Tag>
                    ) : (
                        <Tag color="#cd201f">HIDDEN</Tag>
                    )}
                    extra={[
                        <Button
                            type="secondary"
                            shape="round"
                            icon={<EditOutlined />}
                            onClick={() =>
                                router.push(`/instructor/quiz/edit/${slug}`)
                            }
                        >
                            EDIT
                        </Button>,
                        <Popconfirm
                            placement="topRight"
                            title="Are you sure you want to delete?"
                            onConfirm={() => handleDelete(quiz._id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                shape="round"
                                icon={<DeleteOutlined />}
                            >
                                DELETE
                            </Button>
                        </Popconfirm>,
                    ]}
                >
                    <Row>
                        <Col span={20}>
                            <span style={{color:'#f0eff3'}} className="m-0 font-italic">Due on {moment(quiz.deadline).format("MMMM Do YYYY, LT")}</span>
                            <Divider className="m-0" style={{backgroundColor:'#f0eff3'}}/>
                            <Paragraph style={{color:'#f0eff3'}}>
                                {quiz.description}
                            </Paragraph>
                        </Col>
                        <Col span={4}>
                            <Statistic className="text-right" title="Responses" value={responses.length} />
                        </Col>
                    </Row>
                </PageHeader>
            }
                <Row gutter={[24, 0]} className="mt-5">
                    <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                        <Card bordered={false} className="criclebox cardbody h-full" loading={loading}>
                            <div className="created-questions">
                                <QuestionsCreatedCard
                                    questionArray={questionArray}
                                    viewPage={true}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                        <Card
                            bordered={false}
                            bodyStyle={{ paddingTop: 0 }}
                            className="header-solid h-full  ant-list-yes"
                            title={<h6 className="font-semibold m-0">Responses</h6>}
                            extra={
                                <p className="card-header-date">
                                    as of {moment().format("L")}
                                </p>
                            }
                        >
                            <List
                                loading={loading}
                                className="response-list"
                                itemLayout="horizontal"
                                dataSource={responses}
                                renderItem={(item, index) => (
                                    <a
                                        className="pointer"
                                        onClick={() => openModal(item)}
                                    >
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar size="small">{index + 1}</Avatar>
                                                }
                                                title={item.student?.name}
                                                description={
                                                    <Space>
                                                        <small>{moment(item.submissionDate).format("L")}</small>
                                                        { moment(item.submissionDate).isAfter(quiz.deadline) &&
                                                            <Tag color="error">LATE</Tag>
                                                        }
                                                    </Space>
                                                    }
                                            />

                                            {!item.return ?
                                                <Space>
                                                    <span className="score text-center">
                                                        {item.grade}
                                                    </span>
                                                    <Tooltip title='Return Score'>
                                                        <Button type='primary' icon={<RollbackOutlined />} shape='square' size='small' onClick={() => returnGrade(item)} />
                                                    </Tooltip>
                                                </Space>
                                                : <Space direction="vertical" size={0} style={{ textAlign: 'center' }}>
                                                    <span className="score text-center">
                                                        {item.grade}
                                                    </span>
                                                    <small className="text-success">RETURNED</small>
                                                </Space>
                                            }
                                        </List.Item>
                                    </a>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title='Student Responses'
                    placement="right"
                    size='large'
                    onCancel={() => setVisible(false)}
                    onOk={() => submitGrade()}
                    visible={visible}
                    closable
                    width={1000}
                >
                    <div className="site-card-wrapper response-modal">
                        <Row>
                            <Col span={17}>
                                <Space align="center">
                                    <Avatar size={40} src={singleView.student?.picture?.Location ? singleView.student?.picture?.Location : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'} />
                                    <div>
                                        <Title level={5} className="m-0">{singleView.student?.name}</Title>
                                        <small className="text-muted">{singleView.student?.username}</small>
                                    </div>
                                    { moment(singleView.submissionDate).isAfter(quiz.deadline) &&
                                        <Tag color="error">LATE</Tag>
                                    }
                                </Space>
                            </Col>
                            <Col span={7} className="text-right">
                                <Statistic
                                    title="Score"
                                    value={grade}
                                    suffix={`/${questionSet.length}`}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[24, 16]}>
                            {questionSet && questionSet.map((item, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card
                                            bordered={false}
                                            title={item.optionType === 'audio' ?
                                                <Row>
                                                    <Col span={18}>
                                                        <b>Question {index + 1} </b>
                                                    </Col>
                                                    <Col span={6} className="text-right">
                                                        {!singleView.return ?
                                                            <Checkbox onChange={onChange}></Checkbox>
                                                            : <Checkbox disabled></Checkbox>
                                                        }
                                                    </Col>
                                                </Row>
                                                : <b>Question {index + 1} </b>
                                            }
                                            className="response-card pt-2 h-full"
                                        >
                                            <div className="text-center">
                                                {questionArray[index].image?.Location && <Image width={200} src={questionArray[index].image.Location} />}
                                            </div>
                                            <b>{item.title}</b>
                                            {item.optionType === 'audio' ?
                                                <div className="pt-2">
                                                    <audio src={item.selectedOptions[0]} controls style={{ width: '100%' }} />
                                                </div>
                                                :
                                                <>
                                                    {item.selectedOptions.map((ans, ind) => {
                                                        return (
                                                            <Row key={ind}>
                                                                <Col span={18}>
                                                                    <p className="text-primary">
                                                                        { questionArray[index]?.options[ind]?.image && !questionArray[index]?.options[ind]?.text || questionArray[index]?.options[ind]?.text.includes('prelms')?
                                                                            <Image width={100} src={ans} />
                                                                        :
                                                                            ans
                                                                        }
                                                                    </p>
                                                                </Col>
                                                                <Col span={6} className="text-right">
                                                                    {questionArray[index]?.correctAnswer[ind]?.text === ans ?
                                                                        <CheckOutlined className="text-success" />
                                                                        : <CloseOutlined className="text-danger" />
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}
                                                </>
                                            }

                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div>
                </Modal>
            </div>
        </InstructorRoute>
    );
};

export default QuizView;