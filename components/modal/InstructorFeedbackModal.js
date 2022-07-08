import { Modal, Row, Space, Col, Table, Rate, Card, Empty,Typography, Divider} from 'antd';
import React, {useEffect, useState } from "react";
const InstructorFeedbackModal = ({
    feedbackVisible,
    setFeedbackVisible,
    course,
    feedbacks = course.courseFeedbacks
}) => {
    const [rating, setRating] = useState(0);
    useEffect(() => {
        let sum = 0;
        feedbacks?.forEach(fb => {
            sum += Number(fb.overallExperience)
        });
        setRating(sum/feedbacks?.length)
      }, [course]);
    const scaleInt = [
        'The course stimulated the interest of my child in the subject matter.',
        'The course was well detailed and accurate.',
        'The course was well organized.',
    ];
    const columns = [
        {
          title: 'Criteria',
          dataIndex: 'criteria',
          width: "80%",
          render: (_,record,index) => (
            <span>{scaleInt[index]}</span>
          ),
        },
        {
          title: 'Rating',
          width: "20%",
          dataIndex: 'rating',
          render: (_,record,index) => (
            <span>{record}</span>
          ),
        }
      ];

    return (
        <>
            <Modal
                style={{top:'20px'}}
                title={`Course Feedbacks - ${course.name}`}
                visible={feedbackVisible}
                onCancel={()=> setFeedbackVisible(false)}
                footer={false}
                width={800}
                closable
            >
                { feedbacks && feedbacks.length !== 0 ?
                    <>
                    <Row>
                        <Col span={24} style={{textAlignLast:'end'}}>
                            <Space direction='vertical'>
                                <h6>Course Rating - {rating} Stars</h6>
                                <div>
                                    <Rate disabled allowHalf defaultValue={0} value={rating}/>

                                </div>
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Space>
                            <b>LEGEND: </b>
                            <small>
                                {"(1) Strongly Disagree"}
                                <Divider type="vertical" />
                                {"(2) Disagree"}
                                <Divider type="vertical" />
                                {"(3) Neutral"}
                                <Divider type="vertical" />
                                {"(4) Agree"}
                                <Divider type="vertical" />
                                {"(5) Strongly Agree"}
                                <Divider type="vertical" />
                            </small>
                        </Space>
                    </Row>
                    {feedbacks?.map((feedback, index) => {
                        return (
                            <Card
                            key={index}
                            className="header-solid h-full mb-4"
                            bordered={false}
                            style={{backgroundColor:'#f9f8fd'}}
                        >
                            <Row gutter={[32, 8]}>
                                <Col span={12}>
                                    <Table
                                        className='instructor-feedback-table'
                                        columns={columns}
                                        dataSource={[feedback.criterionOne,feedback.criterionTwo,feedback.criterionThree]}
                                        size="small"
                                        pagination={{ position: ['none','none'] }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Space direction='vertical'>
                                            <span>Overall Course Experience:</span>
                                            <Rate disabled value={feedback.overallExperience} />
                                        </Space>
                                    </Row>
                                    <Row>
                                        <span>Comments and/or Suggestions:</span>
                                    </Row>
                                    <Row>
                                        <span>{feedback.comment}</span>
                                    </Row>
                                </Col>

                            </Row>
                        </Card>
                        )
                    })}
                </>
                :
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                    height: 200,
                    }}
                    description={
                    <span>
                       No Feedbacks Yet
                    </span>
                    }
                >
                </Empty>

                }
            </Modal>
        </>
    );
};

export default InstructorFeedbackModal;