import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import ActivityQuestions from "../../../../components/lists/ActivityQuestions"
import axios from "axios";
import { Avatar, Drawer, Button, List, Row, Col, Space, Card, PageHeader, Skeleton, Divider, Statistic, Image, Typography, Modal, Tag } from "antd";
import {
    LikeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import moment from 'moment';

const InteractiveView = () => {
    const { Title } = Typography;
    const router = useRouter();
    const { slug } = router.query;
    const [loading, setLoading] = useState(true);
    const [interactive, setInteractive] = useState({
        title:''
    });
    const [instructionSet, setInstructionSet] = useState([])
    const [questionArray, setQuestionArray] = useState([])
    const [responses, setResponses] = useState([]);
    const [visible, setVisible] = useState(false);
    const [singleView, setSingleView] = useState({});
    const [activeContent, setActiveContent] = useState({});

    useEffect(() => {
        document.title= interactive.title
    }, [interactive]);

    useEffect(() => {
        setInteractive({});
        loadInteractive();
    }, [slug]);

    const loadInteractive = async () => {
        const { data } = await axios.get(`/api/interactive/${slug}`);
        console.log("data", data)
        if (data) {
            setInteractive(data.interactive);
            setInstructionSet(data.interactive.instructions)
            setQuestionArray(data.interactive.questions)
            var responsestoDisplay = data.responses.filter(response => {
                return response.student !== null;
            });
            setResponses(responsestoDisplay);
            setLoading(false)
        }
    };

    const openModal = (item) => {
        setSingleView(item)
        setVisible(true)
        setActiveContent(item.content)
    }
    return (
        <InstructorRoute>
            <div className="content">
                {loading ? <Card className="circlebox mb-24" loading={loading}></Card>
                :
                    <PageHeader
                        className="site-page-header-responsive gradient-banner text-white"
                        onBack={() => window.history.back()}
                        title={interactive.title}
                        subTitle={ interactive.access ?
                            <Tag color="#3b5999">
                                POSTED
                            </Tag>
                            :
                            <Tag color="#cd201f">
                                HIDDEN
                            </Tag>

                    }
                        extra={
                            <Statistic title="Responses" value={responses.length} prefix={<LikeOutlined />} />
                        }
                    >
                        <p className="m-0 font-italic" style={{color:'#f0eff3'}} > Due on {moment(interactive.deadline).format("MMMM Do YYYY, LT")} </p>
                        <p className="mt-2">{interactive.description}</p>
                        <Divider style={{ backgroundColor: '#fff' }} />
                        <h6>Instructions:</h6>
                        {instructionSet.map((item, index) => (
                            <div className="instruction-list-item" key={index}>
                                <Space>
                                    <Avatar size="small" >{index + 1}</Avatar>
                                    <li key={item}>{item}</li>
                                </Space>
                            </div>
                        ))}
                    </PageHeader>
                }
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                        <Card
                            loading={loading}
                            bordered={false}
                            className="circlebox mb-24 h-full"
                            title="Activity Questions"
                        >
                            <ActivityQuestions
                                questionArray={questionArray}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                        <Card
                            bordered={false}
                            bodyStyle={{ paddingTop: 0 }}
                            className="circlebox h-full"
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
                                                        { moment(item.submissionDate).isAfter(interactive.deadline) &&
                                                            <Tag color="error">LATE</Tag>
                                                        }
                                                    </Space>
                                                }
                                            />
                                            <span className="score">
                                                {item.grade}
                                            </span>
                                        </List.Item>
                                    </a>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title='Student Responses'
                    style={{ top: 20 }}
                    footer={false}
                    onCancel={() => setVisible(false)}
                    visible={visible}
                    width={1000}
                    closable
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
                                    { moment(singleView.submissionDate).isAfter(interactive.deadline) &&
                                        <Tag color="error">LATE</Tag>
                                    }
                                </Space>
                            </Col>
                            <Col span={7} className="text-right">
                                <Statistic
                                    title="Score"
                                    value={singleView.grade}
                                    suffix={`/${questionArray.length}`}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[24, 16]}>
                            {questionArray && questionArray.map((item, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card
                                            bordered={false}
                                            title={
                                                <Row>
                                                    <Col span={18}>
                                                        <b>Question {index + 1} </b>
                                                    </Col>
                                                    <Col span={6} className="text-right">
                                                        {item.correctAnswer === activeContent[index] ?
                                                            <CheckCircleOutlined className="text-success" style={{ fontSize: '24px' }} />
                                                            : <CloseCircleOutlined className="text-danger" style={{ fontSize: '24px' }} />
                                                        }
                                                    </Col>
                                                </Row>
                                            }
                                            className="response-card pt-2 h-full"
                                        >
                                            <Space direction="vertical">
                                                <b>{item.titleField}</b>
                                                {item.type === 'plain-text' ?
                                                    <p className="text-primary">{singleView && activeContent[index]}</p>
                                                    :
                                                    item.choices.map((choice, ind) => {
                                                        return (
                                                            choice.image.Key === activeContent[index] ?
                                                                <Avatar size={64} key={ind} src={
                                                                    <Image
                                                                        src={choice.image.Location}
                                                                    />
                                                                } /> : ''

                                                        )
                                                    })
                                                }
                                            </Space>

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

export default InteractiveView;