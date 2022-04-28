import InstructorRoute from "../../components/routes/InstructorRoute";
import { Context } from "../../context";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { MenuUnfoldOutlined, RightOutlined, BlockOutlined, PushpinOutlined, FormOutlined } from '@ant-design/icons'
import moment from 'moment'
import {
    Row,
    Col,
    Card,
    Divider,
    Button,
    List,
    Descriptions,
    Avatar,
    Tag,
    Space,
    Empty
} from "antd";
const InstructorIndex = () => {
    const { state, dispatch } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [activities, setActivities] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [interactive, setInteractive] = useState([]);
    const router = useRouter();

    useEffect(() => {
        document.title = "Dashboard"
        loadCourses();
        loadActivities()
    }, []);

    //fetch courses from backend
    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
        setLoading(false)
    };
    //fetch assignment from backend
    const loadActivities = async () => {
        const { data } = await axios.get("/api/instructor-activity");
        setAssignment(data.assignments);
        setInteractive(data.interactives)
        setQuiz(data.quizzes)
        setActivities([...data.assignments, ...data.interactives, ...data.quizzes].sort((a, b) => a - b).reverse())
        setActivities([...data.assignments, ...data.interactives, ...data.quizzes].sort((a, b) => a - b).reverse())
        setLoading(false)
    };

    //View Page action
    const onView = (activity) => {
        if (quiz.includes(activity)) {
            router.push(`/instructor/quiz/view/${activity.slug}`)
        } else if (assignment.includes(activity)) {
            router.push(`/instructor/assignment/view/${activity.slug}`)
        } else if ((interactive.includes(activity))) {
            router.push(`/instructor/interactive/view/${activity.slug}`)
        }
    }
    const { user } = state;
    return (
        <InstructorRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="instructor-dashboard-banner-bg">
                        <h1 className="">Hello {user && user.name}!</h1>
                        <h3>Let's start teaching!</h3>
                    </div>
                    <Row gutter={[24, 0]} className="dashboard">
                        <Col span={24} md={16} className="mb-24">
                            <Card
                                className="header-solid h-full pt-0"
                                bordered={false}
                                title={[<h6 className="font-semibold m-0">Courses</h6>]}
                                extra={<a href="/instructor/list-course">More</a>}
                            >
                                {courses.length > 0 ?
                                    <Row gutter={[16, 24]}>
                                        {courses &&
                                            courses.slice(0, 5).map((course, index) => (
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
                                className="header-solid h-full"
                                title={<h6 className="font-semibold m-0">Activities</h6>}
                            >
                                <List
                                    loading={loading}
                                    size='small'
                                    header={<h6>NEWEST</h6>}
                                    className="transactions-list ant-newest"
                                    itemLayout="horizontal"
                                    dataSource={activities.slice(0, 5)}
                                    renderItem={(item, index) => (
                                        <a onClick={() => onView(item)}>
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                        style={{ backgroundColor: '#e6f7ff', color:'#1890ff' }}
                                                        icon={ quiz.includes(item) ? <FormOutlined /> : assignment.includes(item) ? <PushpinOutlined /> : <BlockOutlined />}
                                                        >
                                                        </Avatar>
                                                        }
                                                    title={item.title}
                                                    description={
                                                        item.description.length > 50 ? (
                                                            <small>{item.description.substr(0, 50) + "..."}</small>
                                                        ) : (
                                                            <small>{item.description}</small>
                                                        )
                                                    }
                                                />
                                                <small className="text-muted">{moment(item.deadline).format("L")}</small>
                                            </List.Item>
                                        </a>
                                    )}
                                />
                                <Button
                                    type="primary"
                                    block
                                    href="/instructor/list-activity"
                                >
                                    {<MenuUnfoldOutlined />} SEE ALL
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </InstructorRoute>
    );
};

export default InstructorIndex;
