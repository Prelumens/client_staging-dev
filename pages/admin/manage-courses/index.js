import AdminRoute from "../../../components/routes/AdminRoute";
import { useState, useEffect } from "react";
import axios from 'axios'
import CourseCardAdmin from "../../../components/cards/CourseCardAdmin";
import { Tag, Avatar, Row, Col, Progress, Card } from "antd";
import Link from "next/link";

const ManageCourseIndex = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Manage Courses"
        const fetchCourses = async () => {
            const { data } = await axios.get('/api/courses');
            var coursesToDisplay = data.filter(course => {
                return course.instructor !== null;
            });
            setCourses(coursesToDisplay)
            setLoading(false)
        }
        fetchCourses()
    }, [])

    return (
        <AdminRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="student-enrolled-courses-banner-bg">
                        <h1 className="">Manage Courses</h1>
                    </div>
                    <Card loading={loading}>
                        <Row gutter={[32, 16]}>
                            {courses &&
                                courses.map((course) => (
                                    <Col key={course._id}>
                                        <Link
                                            href={`/admin/manage-courses/view/${course.slug}`}
                                            className="pointer"
                                        >
                                            <div className="enrolled-course-card h-full">
                                                <div className="enrolled-course-image">
                                                    <img src={course.image.Location} />
                                                </div>
                                                <div className="enrolled-course-content">
                                                    <div className="card-content-header">
                                                        <h2>{course.name}</h2>
                                                    </div>
                                                    <div className="card-content-meta">
                                                        <Tag color="#108ee9">{course.category}</Tag>
                                                        <div className="rating">

                                                        </div>
                                                    </div>
                                                    <div className="card-content-description">
                                                        {course.description.length > 200 ? (
                                                            <small className="mb-1 text-muted">{course.description.substr(0, 100) + "..."}</small>
                                                        ) : (
                                                            <small className="mb-1 text-muted">{course.description}</small>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="card-content-footer">
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
                                                </div>
                                            </div>
                                        </Link>
                                    </Col>
                                ))}
                        </Row>
                    </Card>
                </div>
            </div>

        </AdminRoute >
    );
};

export default ManageCourseIndex;
