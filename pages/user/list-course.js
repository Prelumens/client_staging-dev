import UserRoute from "../../components/routes/UserRoute";
import { useState, useEffect } from "react";
import CourseCard from '../../components/cards/CourseCard'
import axios from 'axios'
import { Card, Row, Col, Button, Progress, Empty } from 'antd'
import { useContext } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";

const ListCourse = () => {
    const {
        state: { user },
    } = useContext(Context);

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        document.title = "List of Courses"
    }, []);
    useEffect(() => {
        const fetchCourses = async () => {
            console.log(user)
            if (user) {
                setLoading(true)
                var availableCourses = [];
                var enrolledCourses = [];
                var unEnrolledCourses = [];

                //get all available courses
                try {
                    const { data } = await axios.get('/api/courses');
                    availableCourses = data;
                    for (let c = 0; c < availableCourses.length; c++) {
                        unEnrolledCourses.push(availableCourses[c])
                    }
                    setLoading(false)
                } catch (error) {
                    console.log(error)
                }

                //get all enrolled courses
                try {
                    const { data } = await axios.get("/api/user-enrolledCourses");
                    enrolledCourses = data;
                    for (let i = availableCourses.length - 1; i >= 0; i--) {
                        for (let j = 0; j < enrolledCourses.length; j++) {
                            if (availableCourses[i]._id == enrolledCourses[j]._id) {
                                unEnrolledCourses.splice(i, 1)
                                console.log("Course to removed => ", unEnrolledCourses)
                                // console.log("same")
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }

                var unEnrolledCoursesToDisplay = unEnrolledCourses.filter(course => {
                    return course.instructor !== null;
                });
            }
            setCourses(unEnrolledCoursesToDisplay)
            setLoading(false)
        }
        fetchCourses()
    }, [user])

    return (
        <UserRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="student-list-of-courses-banner-bg">
                        <h1 className="">List of Courses</h1>
                    </div>
                    {courses && courses.length > 0 ?
                        <Row >
                            {loading && (
                                <SyncOutlined
                                    spin
                                    className="d-flex justify-content-center display-1 text-danger p-5"
                                />
                            )}
                            {courses && courses.map((course) =>
                                <Col key={course._id}>
                                    <div className="template-container course-card card-profile-information">
                                        <div className="template">
                                            <div className="course-preview p-0"
                                                style={{
                                                    backgroundImage: 'url(' + course.image.Location + ')',
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    color: "#f5f5f5",
                                                    width: "30vw"
                                                }}
                                            >
                                            </div>
                                            <div className="course-info">
                                                <div className="progress-container">
                                                    {/* <Progress percent={50} showInfo={false} /> */}
                                                    <span className="progress-text">
                                                        {course.lessons.length} Lesson/s
                                                    </span>
                                                </div>
                                                <h6>{course.category}</h6>
                                                <h4>{course.name}</h4>
                                                {course.description.length > 200 ? (
                                                    <p className="mb-1">{course.description.substr(0, 200) + "..."}</p>
                                                ) : (
                                                    <p className="mb-1">{course.description}</p>
                                                )
                                                }
                                                <p className="instructor-name">{course.instructor?.name}</p>
                                                <Button type="primary" href={`/course/${course.slug}`}>View Course</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                        :
                        <Card>
                            <Empty
                                image="https://cdn.dribbble.com/users/1222536/screenshots/4821341/____.gif"
                                imageStyle={{
                                    height: 300,
                                }}
                                description={
                                    <span className="text-muted">
                                        No Courses to Show
                                    </span>
                                }
                            >
                            </Empty>
                        </Card>
                    }
                </div>
            </div>
        </UserRoute>
    );
};

export default ListCourse;
