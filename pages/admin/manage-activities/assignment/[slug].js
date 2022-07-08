import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminRoute from "../../../../components/routes/AdminRoute";
import axios from "axios";
import { PageHeader, Avatar, Statistic, Skeleton, Content, List, Row, Col, Card, Drawer, Space, Button, Typography, Divider, Tooltip , InputNumber, message, Tag} from "antd";
import {
    FileOutlined,
    LikeOutlined,
    CheckCircleOutlined,
    FilePdfTwoTone,
    FileWordTwoTone,
    FileTwoTone,
    FileImageTwoTone,
    PlaySquareTwoTone
} from "@ant-design/icons";
import moment from 'moment';
import { toast } from "react-toastify";

const AssignmentAdminView = () => {
    const { Title } = Typography;
    const router = useRouter();
    const { slug } = router.query;
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [grade, setGrade] = useState('');
    const [assignment, setAssignment] = useState({
        title:''
    });
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        setAssignment({});
        loadAssignment();
    }, [slug]);

    useEffect(() => {
        document.title=assignment.title
    }, [assignment]);

    const loadAssignment = async () => {
        const { data } = await axios.get(`/api/assignment/${slug}`);
        console.log("data", data)
        if(data){
          setAssignment(data.assignment);
          setSubmissions(data.submissions);
          setLoading(false)
        }
    };
    const Content = ({ children, extraContent }) => (
        <Row>
          <div style={{ flex: 1 }}>{children}</div>
          <div className="image">{extraContent}</div>
        </Row>
      );

      const openSubmission = (item) => {
        setGrade(item.grade)
        setVisible(true)
    }
    return (
        <AdminRoute>
            {loading ? <Skeleton avatar paragraph={{ rows: 2 }} />
            :
                <PageHeader
                    className="site-page-header-responsive gradient-banner text-white"
                    onBack={() => window.history.back()}
                    title={assignment.title}
                    subTitle={ assignment.access ?
                        <Tag color="#3b5999">
                            POSTED
                        </Tag>
                        :
                        <Tag color="#cd201f">
                            HIDDEN
                        </Tag>
                    }
                    extra={
                        <Content
                        extraContent={
                            <Statistic title="Submitted" value={submissions.length} prefix={<LikeOutlined />}/>
                        }
                    />
                    }
                >
                    <p className="m-0 font-italic" style={{color:'#f0eff3'}} > Due on {moment(assignment.deadline).format("MMMM Do YYYY, LT")} </p>
                    <Divider className="m-0" style={{backgroundColor:'#f0eff3'}}/>
                    <p className="mt-2">{assignment.description}</p>
                </PageHeader>
            }
            <Row gutter={[24, 0]}>
                <Col span={24}>
                    <Card
                    bordered={false}
                    className="circlebox mb-24"
                    title="Attachments"
                    >
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={assignment.attachment}
                            renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                avatar={
                                    <Avatar
                                    style={{ backgroundColor: '#e6f7ff' }}
                                    icon={item.key.match(new RegExp('[^.]+$'))[0] === 'pdf' ?
                                        <FilePdfTwoTone />
                                        : item.key.match(new RegExp('[^.]+$'))[0] === 'docx' ?
                                        <FileWordTwoTone />
                                        :  item.key.match(new RegExp('[^.]+$'))[0] === 'jpeg' || item.key.match(new RegExp('[^.]+$'))[0] === 'png' || item.key.match(new RegExp('[^.]+$'))[0] === 'jpg' ?
                                        <FileImageTwoTone />
                                        : item.key.match(new RegExp('[^.]+$'))[0] === 'mp4' || item.key.match(new RegExp('[^.]+$'))[0] === 'wmv' ?
                                        <PlaySquareTwoTone />
                                        :
                                        <FileTwoTone />
                                    }                                    >
                                    </Avatar>
                                    }
                                title={<a href={item.Location}>{item.name}</a>}
                                />
                            </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row><Row gutter={[24, 0]}>
                <Col span={24}>
                    <Card
                    bordered={false}
                    className="circlebox mb-24"
                    title="Submissions"
                    >
                    <div className="table-responsive">
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={submissions}
                            renderItem={(item, index) => (
                                <>
                                <a onClick={() => openSubmission(item)}>
                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar>{index + 1}</Avatar>}
                                        title={item.student?.name}
                                        description={
                                            <Space align="top">
                                                <p>Submitted on {moment(item.submissionDate).format("L")}</p>
                                                { moment(item.submissionDate).isAfter(assignment.deadline) &&
                                                    <Tag color="error">LATE</Tag>
                                                }
                                            </Space>
                                        }
                                        />
                                    </List.Item>
                                </a>
                                <Drawer
                                    title="Submission Detail"
                                    width={500}
                                    onClose={() => setVisible(false)}
                                    visible={visible}
                                    extra={
                                        <Button onClick={() => setVisible(false)}>Close</Button>
                                    }
                                >
                                    <Row>
                                        <Col span={17}>
                                            <Space align="center">
                                                <Avatar size={40} src={item.student?.picture ? item.student?.picture?.Location || item.student?.picture : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'} />
                                                <div>
                                                    <Title level={5} className="m-0">{item.student?.name}</Title>
                                                    <small className="text-muted">{item.student?.username}</small>
                                                </div>
                                                { moment(item.submissionDate).isAfter(assignment.deadline) &&
                                                    <Tag color="error">LATE</Tag>
                                                }
                                            </Space>

                                        </Col>
                                        <Col span={7}>
                                            <Statistic title="Grade" value={grade} suffix="/ 100" />
                                        </Col>
                                    </Row>
                                    <Divider />


                                    <Row className="mb-2">
                                        <Col span={16}>
                                            <h6>Files Submitted</h6>
                                        </Col>
                                        <Col span={8} style={{textAlignLast:'end'}}>
                                            {item.return && <Tag color="geekblue">RETURNED</Tag>}
                                        </Col>

                                    </Row>
                                    <List
                                        className="submission-files"
                                        itemLayout="horizontal"
                                        dataSource={item.content}
                                        renderItem={(cont, index) => (
                                            <Card key={index}>
                                                <Row>
                                                    <Col xs={2} sm={4} md={12} lg={8} xl={2}>
                                                        {/* {cont?.key?.match(new RegExp('[^.]+$'))[0] === 'pdf' ? <FilePdfTwoTone /> : item.key?.match(new RegExp('[^.]+$'))[0] === 'docx' ? <FileWordTwoTone /> : <FileTwoTone />} */}
                                                        {cont?.key?.match(new RegExp('[^.]+$'))[0] === 'pdf' ?
                                                            <FilePdfTwoTone />
                                                            : cont?.key?.match(new RegExp('[^.]+$'))[0] === 'docx' ?
                                                            <FileWordTwoTone />
                                                            : cont?.key?.match(new RegExp('[^.]+$'))[0] === 'jpeg' || cont?.key?.match(new RegExp('[^.]+$'))[0] === 'png' || cont?.key?.match(new RegExp('[^.]+$'))[0] === 'jpg' ?
                                                            <FileImageTwoTone />
                                                            : cont?.key?.match(new RegExp('[^.]+$'))[0] === 'mp4' || cont?.key?.match(new RegExp('[^.]+$'))[0] === 'wmv' ?
                                                            <PlaySquareTwoTone />
                                                            :
                                                            <FileTwoTone />
                                                        }
                                                    </Col>
                                                    <Col xs={22} sm={16} md={6} lg={16} xl={22}>
                                                        <a href={cont.Location}>{cont.name}</a>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        )}
                                    >

                                    </List>
                                </Drawer>
                                </>
                            )}
                        />
                    </div>
                    </Card>
                </Col>
            </Row>

        </AdminRoute>
    );
};

export default AssignmentAdminView;