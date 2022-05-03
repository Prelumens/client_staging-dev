import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";
import { Context } from "../../context";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { MenuUnfoldOutlined, RobotOutlined, RightOutlined, BlockOutlined, PushpinOutlined, FormOutlined } from '@ant-design/icons'
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Progress,
    Button,
    List,
    Modal,
    Avatar,
    Tag,
    Empty
} from "antd";
import CalendarModal from '../../components/modal/CalendarModal';
const UserIndex = () => {
    const router = useRouter();
    const {
        state: { user },
    } = useContext(Context);

    const [active, setActive] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [interactives, setInteractives] = useState([]);
    const [welcomeBanner, setWelcomeBanner] = useState(true)
    const [visible, setVisible] = useState(false);

    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        document.title = "Dashboard"
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/current-userNavbar");
            console.log("CURRENT MODE =>", data.parentMode);
            setCurrentUser(data)
            // if (data.parentMode || welcomeBanner == false) {
            //     router.push('/user')
            // } else {
            //     router.push('/user/welcome')
            //     setWelcomeBanner(false)
            // }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadCourses();
        loadTodo()
    }, [user]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/user-courses");
            var coursesToDisplay = data.filter(course => {
                return course.instructor !== null;
            });
            console.log('course', coursesToDisplay)
            // for (var courseToDisplay in coursesToDisplay) {
            //     if (courseToDisplay.progress == null) {
            //         courseToDisplay.progress = '0'
            //     }
            // }
            setCourses(coursesToDisplay);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const loadTodo = async () => {
        const { data } = await axios.get(`/api/to-do/`)
        setAssignments(data.assignment)
        setQuizzes(data.quiz)
        setInteractives(data.interactive)
        setActive([...data.quiz.active, ...data.assignment.active, ...data.interactive.active]);

    };

    const handleViewCourse = async (slug) => {
        console.log(slug)
        if (user && currentUser && currentUser.parentMode == false) {
            try {
                const { data } = await axios.put(`/api/student/viewCourse/${slug}/${user._id}`)
            } catch (error) {
                console.log(error)
            }
        }
        router.push(`/user/course/${slug}`)
    }

    const attempt = (item) => {
        if (!currentUser.parentMode) {
            try {
                if (quizzes.active.includes(item)) {
                    Modal.confirm({
                        title: 'Are you ready to take the Quiz?',
                        okText: "Let's go!",
                        onOk: async () => {
                            if (user) {
                                try {
                                    const { data } = await axios.put(`/api/student/viewQuiz/${user._id}`, {
                                        title: "View Quiz",
                                        description: `Your child viewed the quiz ${item.title}`
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            router.push(`/user/quiz/${item.slug}`);
                        }
                    })
                } else if (assignments.active.includes(item)) {
                    Modal.confirm({
                        title: 'Are you ready to take the Assignment?',
                        okText: "Let's go!",
                        onOk: async () => {
                            if (user) {
                                try {
                                    const { data } = await axios.put(`/api/student/viewAssignment/${user._id}`, {
                                        title: "View Assignment",
                                        description: `Your child viewed the assignment ${item.title}`
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            router.push(`/user/assignment/${item.slug}`);
                        }
                    })

                } else {
                    Modal.confirm({
                        title: 'Are you ready to take the Interactive?',
                        okText: "Let's go!",
                        onOk: async () => {
                            if (user) {
                                try {
                                    const { data } = await axios.put(`/api/student/viewInteractive/${user._id}`, {
                                        title: "View Interactive",
                                        description: `Your child viewed the interactive ${item.title}`
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            router.push(`/user/interactive/${item.slug}`);
                        }
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <UserRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="student-dashboard-banner-bg">
                        {currentUser && currentUser.parentMode ?
                            <>
                                <h1 className="">Hello Guardian!</h1>
                                <h3>Let's start to educate your child</h3>
                            </>
                            :
                            <>
                                <h1 className="">Welcome {user && user.name}!</h1>
                                <h3>Let's start learning!</h3>
                            </>
                        }
                        <div>
                            {currentUser && currentUser.parentMode ?
                                <Tag icon={<RobotOutlined />} color="blue">Account Mode : Parent</Tag>
                                :
                                <Tag icon={<RobotOutlined />} color="blue">Account Mode : Student</Tag>
                            }

                        </div>
                    </div>

                    <div className="dashboard-items dashboard">
                        <Row gutter={[24, 0]}>
                            <Col span={24} md={16} className="mb-24">
                                <Card
                                    className="header-solid h-full pt-0"
                                    bordered={false}
                                    title={<h6 className="font-semibold m-0">Courses</h6>}
                                    extra={<a href="/user/enrolled-courses">More</a>}
                                >
                                    {courses.length > 0 ?
                                        <>
                                            <Row gutter={[16, 24]}>
                                                {courses &&
                                                    courses.slice(0, 5).map((course, index) => (
                                                        <Col span={8} key={index}>
                                                            <div className="enrolled-course-card h-full">
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
                                        </>
                                        :
                                        <Empty
                                            // image="https://i.gifer.com/B0eS.gif"
                                            image="https://cdn.dribbble.com/users/665029/screenshots/16162764/media/3ea69cb1655fba401acc6c4328d38633.gif"
                                            // image="https://sunnybrook.ca/research/focusedultrasound/images/bg-transparent.gif"
                                            imageStyle={{
                                                height: 200,
                                            }}
                                            description={
                                                <span className="text-muted">
                                                    No Courses Yet
                                                </span>
                                            }
                                        >
                                        </Empty>
                                    }

                                </Card>
                            </Col>
                            <Col span={24} md={8} className="mb-24">
                                <Card
                                    bordered={false}
                                    bodyStyle={{ paddingTop: 0 }}
                                    className="header-solid h-full  ant-list-yes"
                                    title={<h6 className="font-semibold m-0">To Do</h6>}
                                    extra={<Button onClick={() => setVisible(true)}>Calendar</Button>}
                                >
                                    <List
                                        header={<h6>NEWEST</h6>}
                                        className="transactions-list ant-newest"
                                        itemLayout="horizontal"
                                        dataSource={active.slice(0, 10)}
                                        renderItem={(item, index) => (
                                            <a onClick={() => attempt(item)}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                                                                icon={quizzes.active.includes(item) ? <FormOutlined /> : assignments.active.includes(item) ? <PushpinOutlined /> : <BlockOutlined />}
                                                            >
                                                            </Avatar>
                                                        }
                                                        title={item.title}
                                                        description={
                                                            item.description.length > 50 ? (
                                                                <p className="mb-1">{item.description.substr(0, 50) + "..."}</p>
                                                            ) : (
                                                                <p className="mb-1">{item.description}</p>
                                                            )

                                                        }
                                                    />
                                                    <small className="text-muted">{moment(item.deadline).format("L")}</small>
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    <div className="more-button">
                                        <Button
                                            type="primary"
                                            block
                                            href="/user/list-activity"
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
            <CalendarModal visible={visible} setVisible={setVisible} active={active} />
        </UserRoute>
    );
};

export default UserIndex;