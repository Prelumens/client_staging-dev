import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Tag, Avatar, Row, Col, Progress, Card, Empty, Skeleton } from "antd";
import Link from "next/link";
import { SyncOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const EnrolledCourses = () => {
    const {
        state: { user },
    } = useContext(Context);

    //router
    const router = useRouter();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "My Courses"
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const { data } = await axios.get("/api/user-courses");
            var coursesToDisplay = data.filter(course => {
                return course.instructor !== null;
            });
            setCourses(coursesToDisplay);
            setLoading(false);

        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleViewCourse = async (slug) => {
        console.log(slug)
        if (user && user.parentMode == false) {
            try {
                const { data } = await axios.put(`/api/student/viewCourse/${user._id}`)
            } catch (error) {
                console.log(error)
            }

            console.log("CURRENT USER =>", user._id)
        }
        router.push(`/user/course/${slug}`)
    }

    return (
        <UserRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="student-enrolled-courses-banner-bg">
                        <h1 className="">Enrolled Courses</h1>
                    </div>
                    <Card>
                        {courses.length > 0 ?
                            <Row gutter={[32, 16]}>
                                {loading && <Skeleton />}
                                {courses &&
                                    courses.map((course, index) => (
                                        <Col key={index}>
                                            <div className="enrolled-course-card h-full dashboard">
                                                <div className="enrolled-course-image">
                                                    <img src={course.image.Location} />
                                                </div>
                                                <div className="enrolled-course-content">
                                                    {course.progress == 100 ?
                                                        <Tag color="green">Course Completed</Tag> :
                                                        <Tag color="blue">Course Progress : {course.progress}%</Tag>
                                                    }
                                                    <Progress percent={course.progress} showInfo={false} />
                                                    <div className="card-content-header">
                                                        <h6>{course.name}</h6>
                                                    </div>
                                                    <div className="card-content-meta">
                                                        <Tag color="#108ee9">{course.category}</Tag>
                                                        <div className="rating">

                                                        </div>
                                                    </div>
                                                    <div className="card-content-description">
                                                        {course.description.length > 50 ? (
                                                            <p className="mb-1">{course.description.substr(0, 50) + "..."}</p>
                                                        ) : (
                                                            <p className="mb-1">{course.description}</p>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="card-content-footer mb-5">
                                                        <div className="teacher-info">
                                                            <div className="teacher-image">
                                                                {course.instructor.picture ?
                                                                    <Avatar src={course.instructor?.picture?.Location} /> :
                                                                    <Avatar src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" />
                                                                }
                                                            </div>
                                                            <div className="teacher-name">
                                                                <p className="name">{course.instructor?.name}</p>
                                                                <p className="church">Instructor</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="more-button">
                                                        <a
                                                            onClick={() => handleViewCourse(course.slug)}
                                                            className="text-primary"
                                                        >
                                                            View Course <RightOutlined />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
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
                                        No Enrolled Courses Yet
                                    </span>
                                }
                            >
                            </Empty>
                        }

                    </Card>
                </div>
            </div>
        </UserRoute>
    );
};

export default EnrolledCourses;
