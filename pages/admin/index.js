import AdminRoute from "../../components/routes/AdminRoute";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
    Card,
    Col,
    Row,
    Typography,
    List,
    Avatar,
    Button
} from "antd";
import {
    MenuUnfoldOutlined,
    EditOutlined, BlockOutlined, PushpinOutlined, FormOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

const AdminIndex = () => {
    const router = useRouter()
    const [stats, setStats] = useState([]);
    const [courses, setCourses] = useState([])
    const [activities, setActivities] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [interactive, setInteractive] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
        fetchCourses()
        fetchActivities()
        document.title = "Dashboard"
    }, []);
    const fetchActivities = async () => {
        const { data } = await axios.get('/api/activities');
        var assignmentsToDisplay = data.assignments.filter(assignment => {
            return assignment.instructor !== null;
        });

        var interactivesToDisplay = data.interactives.filter(interactive => {
            return interactive.instructor !== null;
        });

        var quizzesToDisplay = data.quizzes.filter(quiz => {
            return quiz.instructor !== null;
        });

        setActivities([...quizzesToDisplay, ...assignmentsToDisplay, ...interactivesToDisplay].sort((a, b) => a - b).reverse())
        setQuizzes(quizzesToDisplay.sort((a, b) => a - b).reverse())
        setAssignment(assignmentsToDisplay);
        setInteractive(interactivesToDisplay)
        setLoading(false)
    }
    const fetchCourses = async () => {
        const { data } = await axios.get('/api/courses');
        var coursesToDisplay = data.filter(course => {
            return course.instructor !== null;
        });
        setCourses(coursesToDisplay.sort((a, b) => a - b).reverse())
        setLoading(false)
    }
    const loadStats = async () => {
        try {
            const { data } = await axios.get("/api/admin");
            setStats(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false)
    };

    //View Page action
    const onView = (activity) => {
        if (quizzes.includes(activity)) {
            router.push(`/admin/manage-activities/quiz/${activity.slug}`)
        } else if (assignment.includes(activity)) {
            router.push(`/admin/manage-activities/assignment/${activity.slug}`)
        } else if ((interactive.includes(activity))) {
            router.push(`/admin/manage-activities/interactive/${activity.slug}`)
        }
    }

    const { Title } = Typography;

    //profile svg icon
    const profile = [
        <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={0}
        >
            <path
                d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
                fill="#fff"
            ></path>
            <path
                d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
                fill="#fff"
            ></path>
            <path
                d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
                fill="#fff"
            ></path>
            <path
                d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
                fill="#fff"
            ></path>
        </svg>,
    ];

    const count = [
        {
            title: "Students",
            count: stats && stats.student && stats.student[1],
            icon: profile,
        },
        {
            title: "Instructors",
            count: stats && stats.instructor && stats.instructor[1],
            icon: profile,
        },
        {
            title: "Admins",
            count: stats && stats.admin && stats.admin[1],
            icon: profile,
        },
        {
            title: "Courses",
            count: stats.course,
            icon: profile,
        }
    ];
    return (
        <AdminRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="admin-dashboard-banner-bg">
                        <h1 className="">Admin Dashboard</h1>
                    </div>
                    <div className="layout-content">
                        <Row className="mb-2" gutter={[24, 0]}>
                            {count.map((c, index) => (
                                <Col
                                    key={index}
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    className="mb-24"
                                >
                                    <Card bordered={false} className="circlebox " loading={loading}>
                                        <div className="number">
                                            <Row align="middle" >
                                                <Col xs={18}>
                                                    <span>{c.title}</span>
                                                    <Title level={3}>
                                                        {c.count}
                                                    </Title>
                                                </Col>
                                                <Col xs={6}>
                                                    <div className="icon-box">{c.icon}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Row gutter={[24, 0]} className='admin-dashboard dashboard'>
                            <Col span={24} md={8} className="mb-24">
                                <Card
                                    className="header-solid h-full"
                                    bordered={false}
                                    title={[<h6 className="font-semibold m-0">Courses</h6>]}
                                    bodyStyle={{ paddingTop: "0" }}
                                >
                                    <List
                                        loading={loading}
                                        size='small'
                                        header={<small>NEWEST</small>}
                                        className="course-list ant-newest mb-5"
                                        itemLayout="horizontal"
                                        dataSource={courses.slice(0, 3)}
                                        renderItem={(course, index) => (
                                            <a href={`/admin/manage-courses/view/${course.slug}`}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar size="large" src={course.image.Location} />
                                                        }
                                                        title={course.name}
                                                        description={
                                                            course.description.length > 50 ?
                                                                <span>{course.description.substr(0, 50) + "..."} </span>
                                                                : <span>{course.description} </span>
                                                        }
                                                    />
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    <div className="more-button">
                                        <Button
                                            type="primary"
                                            block
                                            href="/admin/manage-courses"
                                        >
                                            {<MenuUnfoldOutlined />} SEE ALL
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={24} md={8} className="mb-24">
                                <Card
                                    bordered={false}
                                    bodyStyle={{ paddingTop: 0 }}
                                    className="header-solid h-full"
                                    title={<h6 className="font-semibold m-0">Activities</h6>}
                                >
                                    <List
                                        loading={loading}
                                        size='small'
                                        header={<small>NEWEST</small>}
                                        className="course-list ant-newest mb-5"
                                        itemLayout="horizontal"
                                        dataSource={activities.slice(0, 3)}
                                        renderItem={(activity, index) => (
                                            <a onClick={() => onView(activity)}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                                                                icon={assignment.includes(activity) ? <PushpinOutlined /> : <BlockOutlined />}
                                                            >
                                                            </Avatar>
                                                        }
                                                        title={activity.title}
                                                        description={
                                                            activity.description.length > 50 ?
                                                                <span>{activity.description.substr(0, 50) + "..."} </span>
                                                                : <span>{activity.description} </span>
                                                        }
                                                    />
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    <div className="more-button">
                                        <Button
                                            type="primary"
                                            block
                                            href="/admin/manage-activities"
                                        >
                                            {<MenuUnfoldOutlined />} SEE ALL
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={24} md={8} className="mb-24">
                                <Card
                                    bordered={false}
                                    bodyStyle={{ paddingTop: 0 }}
                                    className="header-solid h-full"
                                    title={<h6 className="font-semibold m-0">Quizzes</h6>}
                                >
                                    <List
                                        loading={loading}
                                        size='small'
                                        header={<small>NEWEST</small>}
                                        className="course-list ant-newest mb-5"
                                        itemLayout="horizontal"
                                        dataSource={quizzes.slice(0, 3)}
                                        renderItem={(quiz, index) => (
                                            <a onClick={() => onView(quiz)}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                                                                icon={<FormOutlined />}
                                                            >
                                                            </Avatar>
                                                        }
                                                        title={quiz.title}
                                                        description={
                                                            quiz.description.length > 50 ?
                                                                <span>{quiz.description.substr(0, 50) + "..."} </span>
                                                                : <span>{quiz.description} </span>
                                                        }
                                                    />
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    <div className="more-button">
                                        <Button
                                            type="primary"
                                            block
                                            href="/admin/manage-activities"
                                        >
                                            {<MenuUnfoldOutlined />} SEE ALL
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>


                </div>
            </div>
        </AdminRoute>
    )
}
export default AdminIndex;