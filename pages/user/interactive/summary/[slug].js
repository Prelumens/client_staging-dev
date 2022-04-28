import UserRoute from "../../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import moment from 'moment';
import axios from "axios";
import {
  Col,
  Card,
  Typography,
  Row,
  Tag,
  Divider,
  Space,
  Button,
  message,
  List,
  Avatar,
  Image,
  Statistic
} from 'antd';
import {
  ToTopOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Context } from "../../../../context";

const InteractiveSummary = (

) => {

    const { Title, Text, Paragraph } = Typography;
    const [loading, setLoading] = useState(false);
    const [submission, setSubmission] = useState({});
    const [questionArray, setQuestionArray] = useState([]);
    const [interactive, setInteractive] = useState({
        title: ''
    });
    // router
    const router = useRouter();
    const { slug } = router.query;
    const loadInteractive = async () => {
        // let response;
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/student/interactive/${slug}`);
            if (data) {
                setInteractive(data);
                setQuestionArray(data.questions)
                const response = await axios.get(`/api/student/interactive-submission/${data._id}`);
                setSubmission(response.data)
                setLoading(false);
                console.log("response.data", response.data)
                // if (res) {
                //     setSubmission(res)
                //     setLoading(false);
                // }
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        loadInteractive();
    }, [slug]);

    return (
    <UserRoute>
        <Card
            bordered={false}
            className="circlebox mb-4"
            loading={loading}
            title={interactive.title}
            extra={
                <Statistic title="Score" value={submission.grade} suffix={`/${questionArray.length}`} />
            }
        >
            <Text type="secondary">by {interactive.instructor?.name} <Divider type="vertical" /> Completed on {moment(submission.submittedDate).format("MMMM Do YYYY, LT")}</Text>
            <Divider />
            <Paragraph className="lastweek">
            {interactive.description}
            </Paragraph>
        </Card>
        {questionArray?.map((question, index) => {
            return(
                <Card
                loading={loading}
                className="circlebox mb-2"
                key={index}
                title={question.titleField}
                extra={submission?.content && question.correctAnswer === submission?.content[index] ? <CheckCircleOutlined style={{fontSize: '24px'}} className="text-success"/> : <CloseCircleOutlined style={{fontSize: '24px'}} className="text-danger"/>}
                >
                <Row gutter={[40, 16]}>
                        {question && submission && question.choices.map((choice, ind) => (
                            <Col span={12} key={ind} className="text-center">
                                {!choice.image ? (
                                    <>
                                        {submission?.content && choice.text === question.correctAnswer && choice.text !== submission?.content[index] ?(
                                            <Button type="primary" shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        ): submission?.content && choice.text === question.correctAnswer && choice.text === submission?.content[index] ? (
                                            <Button shape="round" size="large" block style={{backgroundColor:'#28a745'}} className="text-white">
                                                {choice.text}
                                            </Button>
                                        ): submission?.content && choice.text !== question.correctAnswer && choice.text === submission?.content[index] ?
                                        (
                                            <Button style={{backgroundColor:'#dc3545'}} shape="round" size="large" block className="text-white">
                                                {choice.text}
                                            </Button>
                                        ):
                                            <Button shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        }
                                    </>
                                ):(
                                    <Space size="large" direction='vertical' align='center'>
                                        {submission?.content && choice.image.Key === question.correctAnswer && choice.image.Key !== submission?.content[index] ? (
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                                style={{border:'5px solid #1890ff'}}
                                            />
                                        ): submission?.content && choice.image.Key === question.correctAnswer && choice.image.Key === submission?.content[index] ? (
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                                style={{border:'5px solid #28a745'}}
                                            />
                                        ): submission?.content && choice.image.Key !== question.correctAnswer && choice.image.Key === submission?.content[index] ? (
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                                style={{border:'5px solid #ff4d4f'}}
                                            />
                                        ):
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                            />
                                        }
                                        {choice.text ?
                                            <Button type="secondary" shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        :''
                                        }
                                    </Space>
                                )
                                }
                            </Col>
                        ))}
                    </Row>
            </Card>
            )
        })}
    </UserRoute>
  )
}
export default InteractiveSummary;