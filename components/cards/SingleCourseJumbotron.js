import SingleCourse from "../../pages/course/[slug]";
import { Badge, Modal, Button, Card, Row, Col, Avatar, Tag, Tooltip } from "antd";
import { useState } from "react";
import ReactPlayer from "react-player";
import { LoadingOutlined, SafetyOutlined, InfoCircleOutlined } from "@ant-design/icons"

const SingleCourseJumbotron = ({
    course,
    showModal,
    setShowModal,
    setPreview,
    preview,
    loading,
    user,
    handleFreeEnrollment,
    enrolled,
    setEnrolled
}) => {

    //desctruct course
    const { name, description, instructor, updatedAt, lessons, image, category } = course;
    const [showDescriptionModal, setShowDescriprionModal] = useState(false)

    const openDescriptionModal = () => {
        Modal.info({
            title: 'Description of the Course',
            content: (
                <div>
                    <p >{description}</p>
                </div>
            ),
            onOk() { },
        });
    }
    console.log('course', course)

    return (
        <div className="container-fluid p-3">

            <div
                className="course-enrollment-bg"
            ></div>

            <Card
                className="course-enrollment-card"
                bodyStyle={{ display: "none" }}
                title={
                    <Row justify="space-between" align="middle" gutter={[24, 0]}>
                        <Col span={24} md={12} className="col-info">
                            <Avatar.Group>
                                <Avatar size={100} shape="square" src="../../gif/light.gif" className="mr-1" />
                                <div className="avatar-info">
                                    <h4 className="font-semibold m-0">
                                        {name}
                                        <Tooltip title="View Description">
                                            <InfoCircleOutlined
                                                onClick={openDescriptionModal}
                                                className="ml-2 text-info"
                                                style={{
                                                    fontSize: "20px",
                                                    backgroundColor: '#E6F7FF'
                                                }}
                                            />
                                        </Tooltip>
                                    </h4>
                                    {/* <p>{description}</p> */}
                                    {/* <Badge count={category} style={{ backgroundColor: "#03a9f4" }} className="pb-4 mr-2" /> */}
                                    <div className="pb-4 mr-2">
                                        <Tag >{category}</Tag>
                                    </div>

                                    {/* display course author */}
                                    <p>Created by {instructor.name}</p>
                                    <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
                                </div>
                            </Avatar.Group>
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
                            {loading ? (
                                <div className="d-flex justify-content-center">
                                    <LoadingOutlined className="h1 text-danger" />
                                </div>
                            ) : (
                                <Button
                                    className="mb-3 mt-3"
                                    type="primary"
                                    style={{ backgroundColor: "#03a9f4", borderRadius: "10px" }}
                                    icon={<SafetyOutlined />}
                                    disabled={loading}
                                    onClick={handleFreeEnrollment}
                                >
                                    {user ?
                                        enrolled.status ? "Go to course" : "Enroll to this Course"
                                        : "Login to enroll"}
                                </Button>
                            )}
                        </Col>

                    </Row>
                }
            ></Card>
        </div>
    )
}

export default SingleCourseJumbotron;