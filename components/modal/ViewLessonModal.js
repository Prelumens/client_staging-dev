import { Modal, Row, Col, List, Avatar } from 'antd';
import ReactPlayer from "react-player";
import {
    FilePdfTwoTone,
    FileWordTwoTone,
    FileTwoTone
} from "@ant-design/icons";
const ViewLessonModal = ({
    setLessonView,
    lessonView,
    activeLesson
}) => {
    return (
        <>
            <Modal
                style={{ top: '20px' }}
                title={activeLesson.title}
                visible={lessonView}
                onCancel={() => setLessonView(false)}
                footer={false}
                width={720}
                centered
            >
                <Row gutter={[16, 16]}>
                    <Col span={16} >
                        <div className="course-description mt-0">
                            <h6>Lesson Description</h6>
                            <p>{activeLesson.content}</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="wrapper" style={{ alignSelf: 'center' }}>
                            <ReactPlayer
                                url={activeLesson.video?.Location}
                                playing={false}
                                controls={true}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </Col>
                </Row>
                {activeLesson.wikis?.length !== 0 &&
                    <Row>
                        <Col span={24}>
                            <List
                                header={<h6 className='mb-0'>Additional Resources</h6>}
                                itemLayout="horizontal"
                                dataSource={activeLesson.wikis}
                                renderItem={(item, index) => (
                                    <a href={item.Location}
                                    >
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        style={{ backgroundColor: '#e6f7ff' }}
                                                        icon={item.key.match(new RegExp('[^.]+$'))[0] === 'pdf' ? <FilePdfTwoTone /> : item.key.match(new RegExp('[^.]+$'))[0] === 'docx' ? <FileWordTwoTone /> : <FileTwoTone />}
                                                    >
                                                    </Avatar>
                                                }
                                                title={item.name}
                                            >
                                            </List.Item.Meta>
                                        </List.Item>
                                    </a>
                                )}
                            >
                            </List>
                        </Col>
                    </Row>

                }
            </Modal>
        </>
    );
};

export default ViewLessonModal;