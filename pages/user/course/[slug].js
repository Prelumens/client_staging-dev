import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Input, Table, Divider, message, Modal, Timeline,Rate, Layout, PageHeader, Tag, Drawer, Card, Collapse, Avatar, List, Row, Col, Space } from "antd";
import ReactPlayer from "react-player";
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  PlayCircleOutlined,
  CheckCircleFilled,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileTwoTone,
  LikeOutlined,
} from "@ant-design/icons";
import { Context } from "../../../context";
const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
const { TextArea } = Input;
const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [course, setCourse] = useState({
    name: ''
  });
  const [feedback, setFeedback] = useState({
    criterionOne: '',
    criterionTwo: '',
    criterionThree: '',
    overallExperience: '',
    comment:''
  });
  const [completedLessons, setCompletedLessons] = useState([]);
  // force state update
  const [updateState, setUpdateState] = useState(false);
  const [visibleQuiz, setVisibleQuiz] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [actives, setActives] = useState([]);
  const [completeds, setCompleteds] = useState([]);

  const [currentUser, setCurrentUser] = useState()
  const feedbackDesc = ['Unsatisfactory ', 'Good', 'Very Good', 'Excellent', 'Outstanding'];
  const scaleInt = ['Strongly Disagree ', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  const [rating, setRating] = useState(0);
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-userNavbar");
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

  const {
    state: { user },
  } = useContext(Context);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      loadCourse();
      loadCourseActivities()
    }
  }, [slug]);
  // This effect runs once, after the first render
  useEffect(() => {
    document.title = "Course"
  }, [])
  useEffect(() => {
    if (course) {
      document.title = course.name
      loadCompletedLessons();
    }
  }, [course]);


  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
    if(data){
    data.courseFeedbacks.forEach(fb => {
      if(fb.student === user?._id){
        setFeedbackSent(true)
        setFeedback(fb)
        console.log('matched',fb)
      }
    });
    }
  };

  const loadCourseActivities = async () => {
    const { data } = await axios.get(`/api/to-do/${slug}`);
    setActives([...data.quiz.active, ...data.assignment.active, ...data.interactive.active])
    setCompleteds([...data.quiz.completed, ...data.assignment.completed, ...data.interactive.completed])
    // console.log(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    // console.log("COMPLETED LESSONS => ", data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-completed`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
    } catch (error) {
      console.log(error)
    }

    if (user && currentUser && currentUser.parentMode == false) {
      console.log(user)
      try {
        const { data } = await axios.put(`/api/student/completedLesson/${user._id}`, {
          title: "Lesson Completed",
          description: `Your child completed the lesson ${course.lessons[clicked].title} in ${course.name}`
        })
      } catch (error) {
        console.log(error)
      }
    }

    if (user && currentUser && currentUser.parentMode == false) {
      try {
        const { data } = await axios.put(`/api/student/completedCourse/${user._id}/${course._id}`)
      } catch (error) {
        console.log(error)
      }
    }

    // console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
    if([...completedLessons, course.lessons[clicked]._id].length === course?.lessons?.length){
      toast.success('Congratulations! You have finished all the lessons.')
    }
  };

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log("ALL => ", all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log("ALL WITHOUT REMOVED => ", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //FUNCTIONS FOR ADD FEEDBACK
  const handleAddFeedback = async (e) => {
    e.preventDefault();
      let fail = false;
      if (!feedback.criterionOne || !feedback.criterionTwo || !feedback.criterionThree || !feedback.overallExperience) {
          message.error("Please rate all criteria.")
          fail = true;
      }
      if (!fail) {
          try {
              const { data } = await axios.post(
                  `/api/course/feedback/${slug}`,
                  {
                      feedback
                  }
              );
              toast("Feedback submitted!");
              window.location.reload();
          } catch (err) {
              console.log(err);
              toast("Feedback submit failed");
          }
      }
  };
  const columns = [
    {
      title: 'Criteria',
      dataIndex: 'criteria',
      width: "60%",
    },
    {
      title: 'Rating',
      width: "40%",
      dataIndex: 'rating',
      render: (_,record) => (
        <Rate
          tooltips={scaleInt}
          defaultValue={0}
          disabled={feedbackSent}
          onChange={function name(value) {
            setFeedback({...feedback,[record.key]: value});
          }}
          value={feedback[record.key]}
          character={({ index }) => index + 1}
        />
      ),
    }
  ];
  const data = [
    {
      key: 'criterionOne',
      criteria: 'The course stimulated the interest of my child in the subject matter.',
    },
    {
      key: 'criterionTwo',
      criteria: 'The course was well detailed and accurate.',
    },
    {
      key: 'criterionThree',
      criteria: 'The course was well organized.',
    },
  ];
  return (
    <StudentRoute>
      <Layout>
        <Sider
          theme='light'
          breakpoint="lg"
          // collapsible = {true}
          collapsedWidth="0"
          onBreakpoint={broken => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
        >
          <Timeline className="pl-4 pt-4">
            <h5 className="text-center">LESSONS</h5>
            {course.lessons?.map((lesson, index) => (
              <a className='btn' key={index}>
                <Timeline.Item
                  className='pb-0'
                  style={{ textAlign: "left" }}
                  onClick={async () => {
                    setClicked(index)
                    if (user && currentUser && currentUser.parentMode == false) {
                      console.log(currentUser)
                      try {
                        const { data } = await axios.put(`/api/student/viewLesson/${user._id}`, {
                          title: "View Lesson",
                          description: `Your child viewed lesson ${lesson.title} in ${course.name}`
                        })
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }}
                  key={index}
                  color="gray"
                  dot={completedLessons.includes(lesson._id) ? (
                    <CheckCircleFilled
                      className="text-primary"
                    />
                  ) : ''
                  }
                >
                  <p className={`p-2 ${index === clicked ? 'selected-lesson' : ''}`} style={{ borderRadius: "10px" }}>
                    {lesson.title.substring(0, 30)}{" "}
                  </p>
                </Timeline.Item>
              </a>
            ))}
          </Timeline>

        </Sider>
        <Layout>
          <Content>
            <div className="content" style={{ padding: 24, minHeight: '100vh' }}>
              <PageHeader
                ghost={false}
                className="site-page-header containers-shadowed"
                title={course.name}
                tags={<Tag color="blue">{course.category}</Tag>}
                avatar={{ src: course.image ? course.image.Location : "/course.png" }}
                extra={[
                  <Button type="primary" onClick={() => setVisibleQuiz(true)}>Activities</Button>,
                  completedLessons?.length === course?.lessons?.length &&
                    <Button
                      type="primary"
                      onClick={() => setFeedbackVisible(true)}
                      icon={<LikeOutlined />}
                      >
                        Course Feedback
                    </Button>
                ]}
              >
                <Content
                >
                  {course.description}
                </Content>
              </PageHeader>
              {clicked !== -1 ? (
                <>
                  <Card className="containers-shadowed p-3">
                    <div className="col alert alert-primary square">
                      <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                      {completedLessons.includes(course.lessons[clicked]._id) ? (
                        <span
                          className="float-right pointer"
                          onClick={markIncompleted}
                        >
                          Mark as incompleted
                        </span>
                      ) : (
                        <span className="float-right pointer" onClick={markCompleted}>
                          Mark as completed
                        </span>
                      )}
                    </div>

                    {course.lessons[clicked].video &&
                      course.lessons[clicked].video.Location && (
                        <>
                          <div className="wrapper">
                            <ReactPlayer
                              className="player"
                              url={course.lessons[clicked].video.Location}
                              width="100%"
                              height="100%"
                              controls
                              // when video end, lesson is automatically marked completed
                              onEnded={() => markCompleted()}
                            />
                          </div>
                        </>
                      )}
                    <div className="course-description">
                      <h6>Lesson Description</h6>
                      {course.lessons[clicked].content}
                    </div>
                    {course.lessons[clicked].wikis?.length !== 0 &&
                      <Row className="mt-2">
                        <Col span={24}>
                          <List
                            header={<h6 className='mb-0'>Additional Resources</h6>}
                            itemLayout="horizontal"
                            dataSource={course.lessons[clicked].wikis}
                            renderItem={(item, index) => (
                              <a href={item.Location}
                              >
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar
                                        style={{ backgroundColor: '#e6f7ff' }}
                                        icon={item.key.match(new RegExp('[^.]+$'))[0] === 'pdf' ? <FilePdfTwoTone /> : item.key.match(new RegExp('[^.]+$'))[0] === 'docx' ? <FileWordTwoTone /> : <FileTwoTone />}
                                      >
                                      </Avatar>
                                    }
                                    title={item.name}
                                  >
                                  </List.Item.Meta>
                                </List.Item>
                              </a>
                            )}
                          >
                          </List>
                        </Col>
                      </Row>

                    }
                  </Card>
                </>
              ) : (
                <div className="d-flex justify-content-center p-5">
                  <div className="text-center p-5">
                    <PlayCircleOutlined className="text-primary display-1 p-5" />
                    <p className="lead">Click on the lessons to start learning</p>
                  </div>
                </div>
              )}
            </div>

          </Content>
          <Drawer
            title="Todo List"
            placement="right"
            visible={visibleQuiz}
            onClose={() => setVisibleQuiz(false)}
            bodyStyle={{ padding: 0 }}
            extra={<a href="/user/list-activity">More</a>}
          >
            <Card
              bordered={false}
              bodyStyle={{ padding: 0 }}
              className="header-solid h-full  ant-list-yes"
            >
              <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header="Active" key="1">
                  <List
                    itemLayout="horizontal"
                    dataSource={actives.filter((item) => {
                      return moment().isBefore(item.deadline)
                    })}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header="Completed" key="2">
                  <List
                    itemLayout="horizontal"
                    dataSource={completeds}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                          description={<span>Completed on {moment(item.submissionDate).format("MMMM Do YYYY, LT")}</span>}
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header="Missed" key="3">
                  <List
                    itemLayout="horizontal"
                    dataSource={actives.filter((item) => {
                      return moment().isAfter(item.deadline)
                    })}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            </Card>
          </Drawer>

        </Layout>
      </Layout>
      <Modal
        title={`Course Feedback - ${course.name}`}
        visible={feedbackVisible}
        onOk={!feedbackSent ? handleAddFeedback : ()=>setFeedbackVisible(false)}
        okText={!feedbackSent ? 'Submit' :'Ok'}
        cancelText={!feedbackSent ? 'Cancel' :'Close'}
        onCancel={()=>{ setFeedbackVisible(false)
          if (!feedbackSent) {
            setFeedback({
              criterionOne: '',
              criterionTwo: '',
              criterionThree: '',
              overallExperience: '',
              comment:''
            })
          }
        }}
      >
        <Row>
          <Space>
            <h6>Overall Rating:</h6>
            <Rate
              disabled={feedbackSent}
              tooltips={feedbackDesc}
              onChange={function name(value) {
                setFeedback({...feedback,overallExperience: value});
              }}
              value={feedback.overallExperience}
            />
          </Space>
        </Row>
        <Divider/>
        <Row>
          <b>
            Please rate each characteristic using the following criteria:
          </b>
            <small>
              {"(1) Strongly Disagree"}
              <Divider type="vertical" />
              {"(2) Disagree"}
              <Divider type="vertical" />
              {"(3) Neutral"}
              <Divider type="vertical" />
              {"(4) Agree"}
              <Divider type="vertical" />
              {"(5) Strongly Agree"}
              <Divider type="vertical" />
            </small>
        </Row>
        <Row>
          <Col span={24}>
            <Table
                className="feedback-table"
                columns={columns}
                dataSource={data}
                size="small"
                pagination={{ position: ['none','none'] }}
              />
          </Col>
        </Row>
        <Divider/>
          {feedbackSent ?
            feedback.comment &&
            <>
              <Row>
                <span>Comments and/or Suggestions:</span>
              </Row>
              <Row>
                <span>{feedback.comment}</span>
              </Row>
            </>
            :
            <>
              <Row>
                <span>Do you have any specific comments or recommendations for improving this course?</span>
              </Row>
              <Row>
                  <TextArea
                    onChange={(e) => setFeedback({...feedback,comment: e.target.value})}
                    placeholder="Comments and/or Suggestions ... "
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    value={feedback.comment}
                  />
              </Row>
            </>
        }
      </Modal>
    </StudentRoute >
  );
};

export default SingleCourse;
