import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Tag, Descriptions, List, Avatar , PageHeader, Modal, Row, Col, Card, Button, Space, Select} from "antd";
import { useRouter } from "next/router";
import moment from 'moment';
import slugify from "slugify";

import {
    PlusOutlined
} from "@ant-design/icons";
const StudentRecord = ({

}) => {
    // router
    const router = useRouter();
    const { student } = router.query;
    const [studentInfo, setStudentInfo] = useState({
        fullName: ''
    });
    const [records, setRecords] = useState([]);

    useEffect(() => {
        setStudentInfo({})
        setRecords([])
        loadStudent();
    }, [student]);

    useEffect(()=>{
        document.title = studentInfo.fullName
    },[studentInfo])

    const loadStudent = async () => {
        try {
            const { data } = await axios.get(`/api/instructor/student/${student}`);
            setStudentInfo(data.student);
            setRecords(data.submissions)
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    const openModal = (item) => {
        let slug = slugify(item.title)
        if (item.itemType === 'Quiz') {
        router.push(`/instructor/quiz/view/${slug}`)
      } else if (item.itemType === 'Assignment') {
        router.push(`/instructor/assignment/view/${slug}`)
      } else {
        router.push(`/instructor/interactive/view/${slug}`)
      }
    }
    return (
        <InstructorRoute>
            <PageHeader
                className="site-page-header-responsive gradient-banner"
                onBack={() => window.history.back()}
                avatar={{ src: studentInfo.image?.Location }}
                title={studentInfo.fullName}
                tags={<Tag color="blue">{studentInfo.username}</Tag>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Birthdate">{studentInfo.birthDate}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{studentInfo.gender}</Descriptions.Item>
                    <Descriptions.Item label="Email">{studentInfo.email}</Descriptions.Item>
                    <Descriptions.Item label="Contact">{studentInfo.contact}</Descriptions.Item>
                    <Descriptions.Item label="Guardian">{studentInfo.guardian}</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Row gutter={[24, 0]}>
                <Col span={24}>
                    <Card
                    bordered={false}
                    className="circlebox mb-24"
                    title="Submission Records"
                    >
                        {console.log('records', records)}
                        <List
                            itemLayout="horizontal"
                            dataSource={records}
                            renderItem={(item, index) => (
                                <a onClick={()=>openModal(item)}>
                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar>{index + 1}</Avatar>}
                                        title={item.title}
                                        description={<span>Completed on {moment(item.submissionDate).format("MMMM Do YYYY, LT")}</span>}
                                    />
                                        {item.grade ? (<Space align="baseline">
                                            <h5 className="text-success">
                                                {item.grade}
                                            </h5>
                                            <small className="text-muted">points</small>
                                            </Space>)
                                        : ""
                                        }
                                    </List.Item>
                                </a>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </InstructorRoute>
    );
};

export default StudentRecord;