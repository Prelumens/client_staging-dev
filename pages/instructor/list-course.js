import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar, Tooltip, Row, Col, Card, Button, Empty, Tag, Divider } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, RightOutlined } from "@ant-design/icons";

const InstructorCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "List of Courses"
        loadCourses();
    }, []);

    //fetch courses from backend
    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
        setLoading(false)
    };

    // customized style
    const myStyle = { marginTop: "-15px", fontSize: "10px" };

    return (
        <InstructorRoute>
            <div className="layout-default">
                <div className="content">
                    <div className="instructorbanner-bg">
                        <h1 className="">List of Courses</h1>
                    </div>
                    <div className="container">
                        <div className="list-of-course">
                            <Card
                                loading={loading}
                                className="header-solid h-full pt-0"
                                bordered={false}
                                title={[<h6 className="font-semibold m-0">Courses</h6>]}
                            >
                                {courses.length > 0 ?
                                    <Row gutter={[16, 24]}>
                                        {courses &&
                                            courses.map((course, index) => (
                                                <Col span={24} key={index}>
                                                    <Card className="header-solid h-full">
                                                        <Row gutter={[16, 24]}>
                                                            <Col xs={8} sm={5} md={8} lg={7} xl={5}>
                                                                <Avatar size={100} src={course.image.Location} />
                                                            </Col>
                                                            <Col xs={16} sm={19} md={16} lg={17} xl={19}>
                                                                <div className="">
                                                                    <h6>{course.name}</h6>
                                                                    <Tag color="geekblue">{course.category}</Tag>
                                                                    <Divider className="m-2 " />
                                                                    {course.description.length > 100 ? (
                                                                        <small className="mb-1">{course.description.substr(0, 100) + "..."}</small>
                                                                    ) : (
                                                                        <small className="mb-1">{course.description}</small>
                                                                    )
                                                                    }
                                                                    <div className="text-right">
                                                                        <a href={`/instructor/course/view/${course.slug}`}>
                                                                            View Course<RightOutlined />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            ))}
                                    </Row>
                                    :
                                    <Empty
                                        image="https://i.gifer.com/B0eS.gif"
                                        imageStyle={{
                                            height: 350,
                                        }}
                                        description={
                                            <span className="text-muted">
                                                No Created Course Yet
                                            </span>
                                        }
                                    >
                                    </Empty>
                                }

                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </InstructorRoute>
    );
};

export default InstructorCourse;
