import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List, Row, Col, Card, Badge, Drawer, message, Skeleton, Divider, Tag } from "antd";
import {
    EditOutlined,
    CheckOutlined,
    UploadOutlined,
    QuestionOutlined,
    CloseOutlined,
    UserOutlined,
    BellOutlined,
    InfoCircleOutlined,
    FileTextOutlined,
    ContainerOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import ViewLessonModal from '../../../../components/modal/ViewLessonModal'
import { toast } from "react-toastify";
import moment from 'moment';
import Item from "antd/lib/list/Item";
import AddStudentFormInstructor from "../../../../components/forms/AddStudentFormInstructor";
import NotificationModal from "../../../../components/modal/NotificationModal";

const CourseView = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({
        name: ''
    });
    const [uploaded, setUploaded] = useState([]);

    const [todos, setTodos] = useState([]);
    const [listLoad, setListLoad] = useState([])
    const [fileList, setFileList] = useState([]);
    const [lessons, setLessons] = useState([]);

    // for lessons visibility
    const [visible, setVisible] = useState(false);
    const [lessonView, setLessonView] = useState(false);
    const [activeLesson, setActiveLesson] = useState({});

    //states for lesson
    const [values, setValues] = useState({
        title: "",
        content: "",
        video: {}
    });
    const [uploading, setUploading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
    //progress bar state
    const [progress, setProgress] = useState(0);

    //student count
    const [students, setStudents] = useState(0)

    //get enrollment key
    const [otherDetails, setOtherDetails] = useState(false)

    //manage student
    const [manageStudent, setManageStudent] = useState(false)
    const [studentList, setStudentList] = useState([])

    //for notification
    const [visibleNotification, setVisibleNotification] = useState(false);

    const [canAddStudent, setCanAddStudent] = useState(true)

    const [assignment, setAssignment] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [interactive, setInteractive] = useState([]);

    useEffect(() => {
        loadCourse();
    }, [slug]);

    useEffect(() => {
        loadActivities()
    }, []);
    //fetch assignment from backend
    const loadActivities = async () => {
        const { data } = await axios.get("/api/instructor-activity");
        setAssignment(data.assignments);
        setInteractive(data.interactives)
        setQuiz(data.quizzes)
        setLoading(false)
    };
    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        console.log(data.course)
        setCourse(data.course);
        setLessons(data.course.lessons)
        setTodos([...data.activities].sort((a, b) => a - b).reverse())
        var temporaryListLoad = [...data.activities].sort((a, b) => a - b).reverse()
        if (temporaryListLoad) {
            setListLoad(temporaryListLoad.slice(0, 3))
        }

        if (data.course.lessons.length > 0) {
            setCanAddStudent(false)
        }
        setLoading(false)
    };

    useEffect(() => {
        document.title = course.name
        course && studentCount()
    }, [course]);

    const studentCount = async () => {
        const { data } = await axios.post(`/api/instructor/student-count`, {
            courseId: course._id
        })
        setStudents(data.length)
        setLoading(false)
    }

    //FUNCTIONS FOR ADD LESSONS
    const handleAddLesson = async (e) => {
        e.preventDefault();
        let fail = false;
        if (fileList.length > 0 && uploaded.length === 0) {
            message.error("Please upload the attached files.")
            fail = true;
        }
        if (!values.title) {
            message.error("Lesson title is required.")
            fail = true;
        }
        if (!values.content) {
            message.error("Lesson content is required.")
            fail = true;
        }
        if (!fail) {
            try {
                let tempWiki = []
                const { data } = await axios.post(
                    `/api/course/lesson/${slug}/${course.instructor._id}`,
                    {
                        values,
                        uploaded
                    }
                );
                // console.log(data)
                setProgress(0)
                setUploadButtonText("Upload video");
                let allLessons = lessons;
                uploaded.map((item) => {
                    tempWiki.push(item)
                })
                values.wikis = tempWiki
                allLessons.push(values)
                setLessons(allLessons)
                setVisible(false);
                setCourse(data);
                setValues({ ...values, title: "", content: "", video: {} });
                toast("Lesson added");

                // window.location.reload();
            } catch (err) {
                console.log(err);
                toast("Lesson add failed");
            }
        }
    };


    const handleVideo = async (e) => {
        console.log(course.instructor._id)
        try {
            const file = e.target.files[0];
            setUploadButtonText(file.name);
            setUploading(true);

            const videoData = new FormData();
            videoData.append("video", file);
            // save progress bar and send video as form data to backend
            const { data } = await axios.post(
                `/api/s3/video-upload/${course.instructor._id}`,
                videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                },
            });
            // once response is received
            console.log(data);
            setValues({ ...values, video: data });
            setUploading(false);
        } catch (err) {
            console.log(err);
            setUploading(false);
            toast("Video upload failed");
        }
    };

    const handleVideoRemove = async () => {
        // console.log('Handle remove video');
        try {
            setUploading(true)
            // const { data } = await axios.post(
            //     `/api/course/video-remove/${course.instructor._id}`, values.video
            // )
            // console.log(data);
            setValues({ ...values, video: {} })
            setUploading(false)
            setUploadButtonText('Upload Video')
        } catch (err) {
            console.log(err);
            setUploading(false);
            toast("Video remove failed");
        }
    }

    const handlePublish = async (e, courseId) => {
        try {
            const publish = async () => {
                const { data } = await axios.put(`/api/course/publish/${courseId}`)
                setCourse(data)
                toast('Course published successfully!')
                // window.location.reload()
            }
            if (courseId) {
                Modal.confirm({
                    title: 'Are you sure you want to publish this course?',
                    onOk: () => {
                        publish()
                    }
                })
            }
        } catch (err) {
            toast('Course publish failed. Try again')
        }
    }

    const handleUnpublish = async (e, courseId) => {
        try {
            const unpublish = async () => {
                const { data } = await axios.put(`/api/course/unpublish/${courseId}`)
                setCourse(data)
                toast('Course unpublished successfully!')
                // window.location.reload();
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

    const handleOpenOtherDetails = () => {
        setOtherDetails(true)
    }

    const handleCloseOtherDetails = () => {
        setOtherDetails(false)
    }

    const handleCloseManageStudent = () => {
        setManageStudent(false)
        window.location.reload();
    }

    useEffect(() => {
        getStudentEnrollmentStatusList();
    }, [course])

    const getStudentEnrollmentStatusList = async () => {
        try {
            const { data } = await axios.get(`/api/instructor/course/student-enrollment-status-list/${course._id}`)
            setStudentList(data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleOpenNotification = () => {
        setVisibleNotification(true)
    }

    const handleCloseNotification = () => {
        setVisibleNotification(false)
    }

    const handleUpload = async () => {
        try {
            const { data } = await axios.post(`/api/s3/upload-file`,
                {
                    fileList,
                    folder: 'course/lesson'
                });
            toast("Files uploaded successfully!")
            setUploaded(data)
        } catch (error) {
            console.log(error)
        }
    };
    //View Page action
    const onView = (activity) => {
        let quizType = quiz.filter((item) => {
            return item._id === activity._id
        })
        let assignmentType = assignment.filter((item) => {
            return item._id === activity._id
        })
        let interactiveType = interactive.filter((item) => {
            return item._id === activity._id
        })
        if (quizType.length > 0) {
            router.push(`/instructor/quiz/view/${activity.slug}`)
        } else if (assignmentType.length > 0) {
            router.push(`/instructor/assignment/view/${activity.slug}`)
        } else if (interactiveType.length > 0) {
            router.push(`/instructor/interactive/view/${activity.slug}`)
        }
    }
    return (
        <InstructorRoute>
            <div className="contianer-fluid pt-3 layout-default content">
                {course && (
                    <div className="container-fluid pt-1">
                        <div>
                            <div className="media pt-2">
                                <Avatar
                                    size={80}
                                    src={course.image?.Location}
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
                                            <Tooltip title="Edit">
                                                <EditOutlined
                                                    onClick={() =>
                                                        router.push(`/instructor/course/edit/${slug}`)
                                                    }
                                                    className="h5 pointer text-warning mr-4"
                                                />
                                            </Tooltip>

                                            {course.lessons && course.lessons.length < 1 ? (
                                                <Tooltip title="Min of 1 lesson to publish this course and be able to add student">
                                                    <QuestionOutlined className="h5 pointer text-danger mr-4" />
                                                </Tooltip>
                                            ) : (
                                                course.published ? (
                                                    <Tooltip title="Unpublish">
                                                        <CloseOutlined
                                                            onClick={(e) => handleUnpublish(e, course._id)}
                                                            className="h5 pointer text-danger mr-4" /
                                                        >
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Publish">
                                                        <CheckOutlined
                                                            onClick={(e) => handlePublish(e, course._id)}
                                                            className="h5 pointer text-success mr-4"
                                                        />
                                                    </Tooltip>
                                                )
                                            )}

                                            {/* notification */}
                                            <Tooltip title="Record of History">
                                                <Badge size="small" className="mr-4">
                                                    <ContainerOutlined
                                                        className="h5 pointer text-info"
                                                        onClick={handleOpenNotification}
                                                    />
                                                </Badge>
                                            </Tooltip>

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
                            {/* buttons*/}
                            <div className="row mb-4">
                                <Button
                                    onClick={() => setVisible(true)}
                                    className="col-md-2 mr-2 text-center"
                                    type="primary"
                                    shape="round"
                                    icon={<UploadOutlined />}
                                    size="medium"
                                >
                                    Add Lesson
                                </Button>

                                {lessons.length > 0 ?
                                    <Button
                                        onClick={() => setManageStudent(true)}
                                        className="col-md-2 mr-2 text-center"
                                        type="primary"
                                        shape="round"
                                        icon={<UserOutlined />}
                                        size="medium"
                                    >
                                        Manage Student
                                    </Button>
                                    :
                                    <Button
                                        onClick={() => setManageStudent(true)}
                                        className="col-md-2 mr-2 text-center"
                                        type="primary"
                                        shape="round"
                                        icon={<UserOutlined />}
                                        size="medium"
                                        disabled="true"
                                    >
                                        Manage Student
                                    </Button>
                                }

                            </div>

                            <div className="row">
                                <div className="col">
                                    <ReactMarkdown>
                                        {course.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                        <Modal
                            title="👩🏻‍🏫 Add Lesson"
                            centered
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                            width={1000}
                        >
                            <AddLessonForm
                                values={values}
                                setValues={setValues}
                                handleAddLesson={handleAddLesson}
                                uploading={uploading}
                                uploadButtonText={uploadButtonText}
                                handleVideo={handleVideo}
                                progress={progress}
                                handleVideoRemove={handleVideoRemove}
                                handleUpload={handleUpload}
                                fileList={fileList}
                                setFileList={setFileList}
                            />
                        </Modal>


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

                        <Modal
                            title="👨‍🏫 Manage Student"
                            centered
                            visible={manageStudent}
                            onCancel={() => setManageStudent(false)}
                            footer={
                                <Button key="submit" type="primary" onClick={handleCloseManageStudent}>
                                    Close
                                </Button>
                            }
                            width='600px'
                        >
                            <AddStudentFormInstructor students={studentList} courseId={course._id} />
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

                        <div>
                            <Row gutter={[24, 0]}>
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
                                            dataSource={lessons}
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
                                                <a onClick={() => onView(item)}
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
                        </div>
                        <ViewLessonModal
                            setLessonView={setLessonView}
                            lessonView={lessonView}
                            activeLesson={activeLesson}
                        />
                    </div>
                )}
            </div>
        </InstructorRoute>
    );
};

export default CourseView;