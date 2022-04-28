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

    return (
        <AdminRoute>
            {loading ? <Skeleton avatar paragraph={{ rows: 2 }} />
            :
                <PageHeader
                    className="site-page-header-responsive gradient-banner text-white"
                    onBack={() => window.history.back()}
                    title={assignment.title}
                    subTitle={
                        <> Due on {moment(assignment.deadline).format("MMMM Do YYYY, LT")} </>
                    }
                    extra={
                        <Content
                        extraContent={
                            <Statistic title="Submitted" value={submissions.length} prefix={<LikeOutlined />}/>
                        }
                    />
                    }
                >
                <p>{assignment.description}</p>
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
                                <a>
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