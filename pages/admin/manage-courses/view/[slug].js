import React, { useState, useEffect } from "react";
import AdminRoute from "../../../../components/routes/AdminRoute";
import axios from "axios";
import { Avatar, Tooltip, List, Button, Modal, Badge, Drawer, Col, Card, Row, Tag, Divider } from "antd";
import {
    QuestionOutlined,
    CloseOutlined,
    UserSwitchOutlined,
    UserOutlined,
    BellOutlined,
    LockOutlined,
    InfoCircleOutlined,
    ContainerOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";
import { useRouter } from "next/router";
import AddStudentForm from "../../../../components/forms/AddStudentForm";
import NotificationModal from "../../../../components/modal/NotificationModal";
import ViewLessonModal from "../../../../components/modal/ViewLessonModal";
import moment from 'moment';

const CourseView = () => {
    const router = useRouter();
    const { slug } = router.query
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({
        name: ''
    });

    const [todos, setTodos] = useState([]);
    const [listLoad, setListLoad] = useState([])
    const [fileList, setFileList] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [interactive, setInteractive] = useState([]);
    const [assignment, setAssignment] = useState([]);

    //student count
    const [students, setStudents] = useState(0)
    const [visible, setVisible] = useState(false);

    //for notification
    const [visibleNotification, setVisibleNotification] = useState(false);

    //add student | list of students
    const [studentList, setStudentList] = useState([])

    //get enrollment key
    const [otherDetails, setOtherDetails] = useState(false)

    // for lessons visibility
    const [lessonView, setLessonView] = useState(false);
    const [activeLesson, setActiveLesson] = useState({});

    const [canAddStudent, setCanAddStudent] = useState(false)

    useEffect(() => {
        loadCourse();
    }, [slug]);

    useEffect(() => {
        getStudentEnrollmentStatusList();
    }, [course])

    useEffect(() => {
        document.title = course.name
        course && studentCount()
    }, [course]);

    useEffect(() => {
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

          setQuiz(quizzesToDisplay)
          setAssignment(assignmentsToDisplay);
          setInteractive(interactivesToDisplay)
        }
        fetchActivities()
      }, [])

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        console.log(data.course.lessons.length)
        setCourse(data.course);
        setLessons(data.course.lessons)
        setTodos([...data.activities].sort((a, b) => a - b).reverse())
        var temporaryListLoad = [...data.activities].sort((a, b) => a - b).reverse()
        if (temporaryListLoad) {
            setListLoad(temporaryListLoad.slice(0, 3))
        }

        if (data.course.lessons.length > 0) {
            setCanAddStudent(true)
        }
        setLoading(false)
    };

    //View Page action
    const onView = (record) => {
        console.log('record',record)
        let quizType = quiz.filter((item) => {
            return item._id === record._id
        })
        let assignmentType = assignment.filter((item) => {
            return item._id === record._id
        })
        let interactiveType = interactive.filter((item) => {
            return item._id === record._id
        })
        console.log('interactiveType',interactiveType)

        if (quizType.length > 0) {
            router.push(`/admin/manage-activities/quiz/${record.slug}`)
        } else if (assignmentType.length > 0) {
            router.push(`/admin/manage-activities/assignment/${record.slug}`)
        } else if (interactiveType.length > 0) {
            router.push(`/admin/manage-activities/interactive/${record.slug}`)
        }
    }

    const studentCount = async () => {
        const { data } = await axios.post(`/api/admin/student-count`, {
            courseId: course._id
        })
        console.log('STUDENT COUNT =>', data)
        setStudents(data.length)
    }

    const getStudentEnrollmentStatusList = async () => {
        try {
            const { data } = await axios.get(`/api/admin/course/student-enrollment-status-list/${course._id}`)
            // console.log("SLUG =>", slug)
            setStudentList(data)
            console.log("STUDENT LIST => ", data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnpublish = async (e, courseId) => {
        try {
            const unpublish = async () => {
                const { data } = await axios.put(`/api/admin/course/unpublish/${courseId}`)
                setCourse(data)
                toast('Course unpublished successfully!')
                window.location.reload();
            }
            if (courseId) {
                Modal.confirm({
                    title: 'Are you sure you want to unpublish this course?',
                    onOk: () => {
                        unpublish()
                    }
                })
            }
        } catch (err) {
            toast('Course unpublish failed. Try again')
        }
    }

    const handleClose = () => {
        setVisible(false);
        window.location.reload();
    };

    const handleOpenNotification = () => {
        setVisibleNotification(true)
    }

    const handleCloseNotification = () => {
        setVisibleNotification(false)
    }

    const handleOpenOtherDetails = () => {
        setOtherDetails(true)
    }

    const handleCloseOtherDetails = () => {
        setOtherDetails(false)
    }

    return (
        <AdminRoute>
            <div className="contianer-fluid pt-3">
                {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
                {course && (
                    <div className="container-fluid pt-1">
                        <div className="media pt-2">
                            <Avatar
                                size={80}
                                src={course.image ? course.image.Location : "/course.png"}
                            />

                            <div className="media-body pl-2">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="mt-2 text-primary">{course.name}</h5>
                                        <p style={{ marginTop: "-10px" }}>
                                            {course.lessons && course.lessons.length} Lessons
                                            <Divider type="vertical" />
                                            {course.category}
                                        </p>
                                        <div style={{ marginTop: "-10px" }}>
                                            {course.published ? <Tag color="processing">PUBLISHED</Tag> : <Tag color="default">UNPUBLISHED</Tag>}
                                        </div>
                                    </div>

                                    <div className="d-flex pt-4">
                                        {/* publish or unpublish course */}
                                        {course.published ? (
                                            <Tooltip title="Unpublish">
                                                <CloseOutlined
                                                    onClick={(e) => handleUnpublish(e, course._id)}
                                                    className="h5 pointer text-danger mr-4"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Only the instructor can publish this course">
                                                <QuestionOutlined className="h5 pointer text-warning mr-4" />
                                            </Tooltip>
                                        )}

                                        {/* Manage Student */}
                                        {canAddStudent &&
                                            <Tooltip title="Manage Student">
                                                <Badge size="small" className="mr-4">
                                                    <UserOutlined
                                                        className="h5 pointer text-warning"
                                                        onClick={() => setVisible(true)}
                                                    />
                                                </Badge>
                                            </Tooltip>
                                        }

                                        {/* notification */}
                                        <Tooltip title="Record of History">
                                            <Badge size="small" className="mr-4">
                                                <ContainerOutlined
                                                    className="h5 pointer text-info"
                                                    onClick={handleOpenNotification}
                                                />
                                            </Badge>
                                        </Tooltip>

                                        {/* other details */}
                                        <Tooltip title="Other Details">
                                            <InfoCircleOutlined
                                                className="h5 pointer mr-4"
                                                onClick={handleOpenOtherDetails}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <ReactMarkdown>
                                    {course.description}
                                </ReactMarkdown>
                            </div>
                        </div>


                        <br />

                        <div className="row pb-5">
                            <div className="col lesson-list">
                                <Row>
                                    <Col span={24} md={16} className="mb-24">
                                        <Card
                                            className="header-solid h-full"
                                            bordered={false}
                                            title={[<h6 className="font-semibold m-0">{course && course.lessons && course.lessons.length} Lesson/s</h6>]}
                                            bodyStyle={{ paddingTop: "0" }}
                                        >
                                            <List
                                                loading={loading}
                                                itemLayout="horizontal"
                                                dataSource={course.lessons}
                                                renderItem={(item, index) => (
                                                    <a
                                                        onClick={() => {
                                                            setLessonView(true)
                                                            setActiveLesson(item)
                                                        }
                                                        }
                                                    >
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar size="small">{index + 1}</Avatar>}
                                                                title={item.title}
                                                            >
                                                            </List.Item.Meta>
                                                        </List.Item>
                                                    </a>
                                                )}
                                            >

                                            </List>
                                        </Card>
                                    </Col>
                                    <Col span={24} md={8} className="mb-24">
                                        <Card
                                            bordered={false}
                                            bodyStyle={{ paddingTop: 0 }}
                                            className="header-solid h-full  ant-list-yes"
                                            title={<h6 className="font-semibold m-0">Activities</h6>}
                                            extra={listLoad.length <= 3 && <a onClick={() => setListLoad(todos)} className="text-primary">See All</a>}
                                            >
                                            <List
                                                loading={loading}
                                                itemLayout="horizontal"
                                                dataSource={listLoad}
                                                renderItem={(item, index) => (
                                                    <a
                                                        onClick={()=>onView(item)}
                                                    >
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={
                                                                    <Avatar size="small">{index + 1}</Avatar>
                                                                }
                                                                title={item.title}
                                                                description={
                                                                    <span>Due on {moment(item.deadline).format("L")}</span>
                                                                }
                                                            />
                                                            <div className="status">
                                                                {!item.access ? (
                                                                    <span className="text-danger" >HIDDEN</span>
                                                                ) : (
                                                                    <span className="text-success" >POSTED</span>
                                                                )

                                                                }
                                                            </div>
                                                        </List.Item>
                                                    </a>
                                                )}
                                            />
                                        </Card>
                                    </Col>
                                </Row>

                                {/* <List
                                    itemLayout="horizontal"
                                    dataSource={course.lessons}
                                    renderItem={(item, index) => (
                                        <Item>
                                            <Item.Meta
                                                avatar={<Avatar>{index + 1}</Avatar>}
                                                title={item.title}
                                            >

                                            </Item.Meta>
                                        </Item>
                                    )}
                                >

                                </List> */}
                            </div>
                        </div>
                        <Modal
                            title="👨‍🏫 Manage Student"
                            centered
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={
                                <Button key="submit" type="primary" onClick={handleClose}>
                                    Close
                                </Button>
                            }
                            width='600px'
                        >
                            {/* <pre>{JSON.stringify(studentList, null, 4)}</pre> */}
                            {/* <p>Student List</p>
                            <pre>{JSON.stringify(studentList, null, 4)}</pre>
                            <br />


                            {studentList.map((student) =>

                                <pre key={student._id}>
                                    {JSON.stringify(student.student.name, null, 4)}
                                    -----
                                    {JSON.stringify(student.enrollmentStatus, null, 4)}
                                </pre>
                            )} */}

                            <AddStudentForm students={studentList} courseId={course._id} />
                        </Modal>

                        <Drawer
                            placement="right"
                            title="Record of History"
                            visible={visibleNotification}
                            onClose={handleCloseNotification}
                            footer={
                                <Button key="submit" type="primary" onClick={handleCloseNotification}>
                                    Close
                                </Button>
                            }
                            width='600px'
                        >
                            {/* <pre>{JSON.stringify(course.notifications, null, 4)}</pre> */}
                            <NotificationModal notifications={course.notifications} />
                        </Drawer>

                        <Modal
                            title="ℹ Other Details"
                            centered
                            visible={otherDetails}
                            onCancel={handleCloseOtherDetails}
                            footer={
                                <Button key="submit" type="primary" onClick={handleCloseOtherDetails}>
                                    Close
                                </Button>
                            }
                            width='500px'
                        >
                            <p style={{ fontSize: "15px", marginBottom: "0px" }}>
                                Enrollment Key : {course.enrollmentKey}
                            </p>
                            <p style={{ fontSize: "15px", marginBottom: "0px" }}>
                                No of Students: {students} student/s
                            </p>
                        </Modal>
                    </div>
                )}

                <ViewLessonModal
                    setLessonView={setLessonView}
                    lessonView={lessonView}
                    activeLesson={activeLesson}
                />
            </div>
        </AdminRoute>
    );
};

export default CourseView;