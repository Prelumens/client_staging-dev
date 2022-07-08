import UserRoute from "../../components/routes/UserRoute";
import { useState, useEffect, useContext } from "react";
import slugify from "slugify";
import axios from 'axios'
import { Tabs, List, Avatar, Card, Space, Modal, Empty, Button } from 'antd';
import { useRouter } from "next/router";
import {
    ClockCircleOutlined,
    ConsoleSqlOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Context } from "../../context";
import CalendarModal from "../../components/modal/CalendarModal";
const ListQuiz = () => {
    const {
        state: { user },
    } = useContext(Context);

    const { TabPane } = Tabs;
    const [tableLoad, setTableLoad] = useState(true);
    const [actives, setActives] = useState([]);
    const [missed, setMissed] = useState([]);
    const [completeds, setCompleteds] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [interactives, setInteractives] = useState([]);
    const [visible, setVisible] = useState(false);

    // router
    const router = useRouter();
    const { slug } = router.query;
    useEffect(() => {
        loadTodo();
        document.title = "To do"
    }, []);

    const loadTodo = async () => {
        let tempMissed = []
        let tempActive = []
        const { data } = await axios.get(`/api/to-do/`)
        if (data) {
            setAssignments(data.assignment)
            setQuizzes(data.quiz)
            setInteractives(data.interactive)
            tempMissed = [...data.quiz.active, ...data.assignment.active, ...data.interactive.active].filter((item) => {
                return moment().isAfter(item.deadline)
            })
            tempActive = [...data.quiz.active, ...data.assignment.active, ...data.interactive.active].filter((item) => {
                return moment().isBefore(item.deadline)
            })
            setMissed(tempMissed)
            setActives(tempActive)
            setCompleteds(data.sortedTodos)
            setTableLoad(false);
        }
    };

    const setTimeOutDisabled = async () => {
        try {
            const { data } = await axios.put(`/api/setTimeOutEnabled/${user._id}`);
        } catch (error) {
            console.log(error)
        }
    }

    const attempt = (item) => {
        try {
            if (quizzes.active.includes(item)) {
                const takeQuiz = async () => {
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

                Modal.confirm({
                    title: 'Are you ready to take the Quiz?',
                    okText: "Let's go!",
                    onOk: () => {
                        setTimeOutDisabled()
                        takeQuiz()
                    },
                })
            } else if (assignments.active.includes(item)) {
                const takeAssignment = async () => {
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
                Modal.confirm({
                    title: 'Are you ready to take the Assignment?',
                    okText: "Let's go!",
                    onOk: () => {
                        setTimeOutDisabled()
                        takeAssignment()
                    },
                })

            } else {
                const takeInteractive = async () => {
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
                Modal.confirm({
                    title: 'Are you ready to take the Interactive?',
                    okText: "Let's go!",
                    onOk: () => {
                        setTimeOutDisabled()
                        takeInteractive()
                    },
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const viewActivity = (item) => {
        console.log(item)
        if (item.itemType === "Quiz" && item.return){
            router.push(`/user/quiz-summary/${slugify(item.title.toLowerCase())}`)
        } else if (item.itemType === "Assignment"){
            router.push(`/user/assignment/summary/${slugify(item.title.toLowerCase())}`)
        } else  if (item.itemType === "Interactive"){
            router.push(`/user/interactive/summary/${slugify(item.title.toLowerCase())}`)
        }
    }
    return (
        <UserRoute>
            <div className="layout-default header-solid h-full">
                <div className="content">
                    <div className="student-dashboard-banner-bg">
                        <h1 className="">To-do</h1>
                    </div>
                    <Card
                        extra={<Button onClick={()=>setVisible(true)}>Calendar</Button>}
                    >
                        <Tabs defaultActiveKey="1" size='large' style={{ marginBottom: 32 }}>

                            <TabPane tab="Active" key="1">
                                {actives.length > 0 ?
                                    <List
                                        loading={tableLoad}
                                        itemLayout="horizontal"
                                        dataSource={actives}
                                        renderItem={item => (
                                            <a onClick={() => attempt(item)}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar
                                                            style={{ backgroundColor: '#FFFBE6' }}
                                                            size="large"
                                                            icon={<ClockCircleOutlined className='text-warning' />}
                                                        />}
                                                        title={item.title}
                                                        description={item.description}
                                                    />
                                                    <small className="text-muted">Due on {moment(item.deadline).format("MMMM Do YYYY, LT")}</small>
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    :
                                    <Empty
                                        image="https://cdn.dribbble.com/users/2077326/screenshots/4097154/kitty_walk_cycle_2.gif"
                                        imageStyle={{
                                            height: 300,
                                        }}
                                        description={
                                            <span className="text-muted">
                                                No Activities Yet
                                            </span>
                                        }
                                    >
                                    </Empty>
                                }

                            </TabPane>
                            <TabPane tab="Missed" key="2">
                                {missed.length > 0 ?
                                    <List
                                        loading={tableLoad}
                                        itemLayout="horizontal"
                                        dataSource={missed}
                                        renderItem={item => (
                                            <a onClick={() => attempt(item)}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar
                                                            style={{ backgroundColor: '#FFFBE6' }}
                                                            size="large"
                                                            icon={<ClockCircleOutlined className='text-danger' />}
                                                        />}
                                                        title={item.title}
                                                        description={item.description}
                                                    />
                                                    <small className="text-muted">Due on {moment(item.deadline).format("MMMM Do YYYY, LT")}</small>
                                                </List.Item>
                                            </a>
                                        )}
                                    />
                                    :
                                    <Empty
                                        // image="https://cdn.dribbble.com/users/2077326/screenshots/4097154/kitty_walk_cycle_2.gif"
                                        // image="https://cdn.dribbble.com/users/1201194/screenshots/7197395/media/d5d300c76b56aa290f34cfc39de99c2d.gif"
                                        // image="https://i.pinimg.com/originals/e3/67/d3/e367d3f39a03ce8fad62b8da76a889ca.gif"
                                        image="https://cdn.dribbble.com/users/1084043/screenshots/5611088/purple-birb.gif"
                                        imageStyle={{
                                            height: 300,
                                        }}
                                        description={
                                            <span className="text-muted">
                                                No Missed Activities
                                            </span>
                                        }
                                    >
                                    </Empty>
                                }

                            </TabPane>
                            <TabPane tab="Completed" key="3">
                                {completeds.length > 0 ?
                                    <List
                                        loading={tableLoad}
                                        itemLayout="horizontal"
                                        dataSource={completeds}
                                        renderItem={item => (
                                            <a onClick={() => viewActivity(item)}>
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar
                                                        style={{ backgroundColor: '#D1F9D1' }}
                                                        size="large"
                                                        icon={<FileDoneOutlined className='text-success' />}
                                                    />}
                                                    title={item.title}
                                                    description={<span>Completed on {moment(item.submissionDate).format("MMMM Do YYYY, LT")}</span>}
                                                />
                                                {item.grade && item.return ? (<Space align="baseline">
                                                    <h5 className="text-success">
                                                        {Number(item.grade)}
                                                    </h5>
                                                    <small className="text-muted">points</small>
                                                </Space>)
                                                    : ""
                                                }
                                            </List.Item>
                                            </a>
                                        )}
                                    />
                                    :
                                    <Empty
                                        // image="https://cdn.dribbble.com/users/2077326/screenshots/4097154/kitty_walk_cycle_2.gif"
                                        image="https://cdn.dribbble.com/users/1201194/screenshots/7197395/media/d5d300c76b56aa290f34cfc39de99c2d.gif"
                                        // image="https://i.pinimg.com/originals/e3/67/d3/e367d3f39a03ce8fad62b8da76a889ca.gif"
                                        // image="https://cdn.dribbble.com/users/1084043/screenshots/5611088/purple-birb.gif"
                                        imageStyle={{
                                            height: 300,
                                        }}
                                        description={
                                            <span className="text-muted">
                                                No Completed Activities
                                            </span>
                                        }
                                    >
                                    </Empty>
                                }

                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
            <CalendarModal visible={visible} setVisible={setVisible} active={[...actives,...missed]} completeds={completeds}/>
        </UserRoute >
    );
};

export default ListQuiz;
