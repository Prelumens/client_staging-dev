import UserRoute from "../../components/routes/UserRoute"
import { useState, useEffect, useContext } from "react";
import axios from "axios"
import { List, Avatar, Empty } from "antd";
import {
    BookOutlined,
    QuestionOutlined,
    BarsOutlined,
    CheckCircleOutlined,
    MessageOutlined,
    PushpinOutlined
} from "@ant-design/icons";
import { Context } from "../../context";

const StudentActivity = () => {
    const [tableLoad, setTableLoad] = useState(false);
    const [activities, setActivities] = useState([]);
    const {
        state: { user },
    } = useContext(Context);

    useEffect(() => {
        document.title = "Activity Log"
        loadStudent()
    }, [user])

    const loadStudent = async () => {
        if (user) {
            const { data } = await axios.get(`/api/student/student-activity/${user.username}`)
            console.log("STUDENT ACTIVITY=>", data)
            if (data.studentActivity) {
                setActivities(data.studentActivity.reverse())
            }
        }
    };

    return (
        <UserRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="instructorbanner-bg">
                        <h1 className="">Student Activity Log</h1>
                    </div>
                </div>
                <div
                    id="scrollableDiv"
                    className="mt-4"
                    style={{
                        height: 450,
                        overflow: 'auto',
                        padding: '0 16px',
                    }}
                >
                    {activities.length > 0 ?
                        <List
                            loading={tableLoad}
                            itemLayout="horizontal"
                            dataSource={activities}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            // View Course
                                            item.studentActivityType == "viewCourse" ?
                                                < Avatar
                                                    style={{ backgroundColor: '#FFFBE6' }}
                                                    size="large"
                                                    icon={<BookOutlined className='text-warning' />}
                                                />
                                                :
                                                item.studentActivityType == "completedCourse" ?
                                                    < Avatar
                                                        style={{ backgroundColor: '#FFFBE6' }}
                                                        size="large"
                                                        icon={<CheckCircleOutlined className='text-warning' />}
                                                    />
                                                    :
                                                    //View Lesson
                                                    item.studentActivityType == "viewLesson" ?
                                                        < Avatar
                                                            style={{ backgroundColor: '#E6F7FF' }}
                                                            size="large"
                                                            icon={<BarsOutlined className='text-info' />}
                                                        />
                                                        :
                                                        //Lesson Completed
                                                        item.studentActivityType == "completedLesson" ?
                                                            < Avatar
                                                                style={{ backgroundColor: '#E6F7FF' }}
                                                                size="large"
                                                                icon={<CheckCircleOutlined className='text-info' />}
                                                            />
                                                            :
                                                            item.studentActivityType == "message" ?
                                                                < Avatar
                                                                    style={{ backgroundColor: '#F9F0FF' }}
                                                                    size="large"
                                                                    icon={<MessageOutlined style={{ color: "magenta", opacity: "50%" }} />}
                                                                />
                                                                :
                                                                item.studentActivityType == "viewInteractive" || item.studentActivityType == "viewAssignment" || item.studentActivityType == "viewQuiz" ?
                                                                    <Avatar
                                                                        style={{ backgroundColor: '#F6FFED' }}
                                                                        size="large"
                                                                        icon={<PushpinOutlined className='text-success' />}
                                                                    />
                                                                    :
                                                                    item.studentActivityType == "completedInteractive" || item.studentActivityType == "completedAssignment" || item.studentActivityType == "completedQuiz" ?
                                                                        <Avatar
                                                                            style={{ backgroundColor: '#F6FFED' }}
                                                                            size="large"
                                                                            icon={<CheckCircleOutlined className='text-success' />}
                                                                        />
                                                                        :
                                                                        < Avatar
                                                                            size="large"
                                                                            icon={<QuestionOutlined />}
                                                                        />
                                        }
                                        title={item.title}
                                        description={item.description}
                                    />
                                    <small className="text-muted mr-4">{item.date} at {item.time}</small>
                                </List.Item>
                            )}
                        />
                        :
                        <Empty
                            image="https://cdn.dribbble.com/users/220043/screenshots/6288970/dttr_loaderricerca_ac_ver1.gif"
                            imageStyle={{
                                height: 350,
                            }}
                            description={
                                <span className="text-muted">
                                    Your child doesn't have any activities yet
                                </span>
                            }
                        >
                        </Empty>

                    }

                </div>
            </div>
        </UserRoute>
    )
}

export default StudentActivity