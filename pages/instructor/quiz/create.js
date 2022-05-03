import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import AddQuestionForm from "../../../components/forms/AddQuestionForm"
import QuestionsCreatedCard from "../../../components/cards/QuestionsCreatedCard"
import { DatePicker, Button, Modal, Switch , PageHeader, Input, Row, Col, Card, Divider, Space, Select, message} from "antd";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import Link from "next/link";
import moment from 'moment';

import {
    PlusOutlined
} from "@ant-design/icons";
const QuizCreate = ({
	quizTitle,
	questions,

	editPage = false,
	isOpen = false,
	editQuizHandle
}) => {
    const { TextArea } = Input;
    const { Option } = Select;
    // router
    const router = useRouter();
    const { slug } = router.query;
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [editQuestion, setEditQuestion] = useState(false)
    const [questionIndex, setQuestionIndex] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState({});

    //array of questions for the quiz
    const [questionArray, setQuestionArray] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState("")
    const [access, setAccesss] = useState(false)
    const [assignCourse, setAssignCourse] = useState('')

    const [courses, setCourses] = useState([]);

    //add the questions to the array
    const addQuestionHandle = (title, optionType, options, correctAnswer,image) => {
      console.log('correctAnswer',correctAnswer)
      const arr = [...questionArray]
      arr.push({ title, optionType, options, correctAnswer,image })
      setQuestionArray(arr)
      console.log("Q arr", arr)
    }

    useEffect(() => {
		if (quizTitle) {
			setTitle(quizTitle)
			setQuestionArray(questions)
			setAccesss(isOpen)
		}
	}, [quizTitle, questions, isOpen])

    useEffect(() => {
      document.title="Create Quiz"
        loadCourses();
    }, []);

    const loadCourses = async () => {
      const { data } = await axios.get("/api/instructor-courses");
      setCourses(data);
  };

    const handleQuizCreate = async () => {
      setLoading(true)
      let fail=false;
      message
      .loading('Action in progress..', 1)
      .then(() =>action())
      .then(()=>setLoading(false))

      const action= async () => {
        if (!(title.length || questionArray.length)) {
          message.error('Please add title and questions.')
          fail = true
        }
        if (!questionArray.length) {
          message.error('Please add any questions.')
          fail = true
        }
        if (!description) {
          message.error('Please add description.')
          fail = true
        }
        if (!deadline) {
          message.error('Please set deadline.')
          fail = true
        }
        if (!assignCourse.length) {
          message.error('Please assign a course.')
          fail = true
        }
        if(!fail){
          try {
              const { data } = await axios.post("/api/quiz/create", {
                  questions: questionArray,
                  title,
                  access,
                  course: assignCourse,
                  deadline,
                  description
              });
              toast("Quiz created!");
              router.push("/instructor/list-activity");

          } catch (err) {
              toast.error(err.response.data)
              console.log(err);
          }
        }
      }
    }

    const editQuestionHandle = async (title, optionType, options, correctAnswer,image) => {
      console.log('editQuestionHandle')
      const temp = [...questionArray];
      temp[questionIndex] = { title, optionType, options, correctAnswer,image };
      setQuestionArray(temp);
      toast("Question Updated!");
      setQuestionIndex(null)
      // window.location.reload(false);
    };
    return (
        <InstructorRoute>
          <div className="content">
            <PageHeader
                className="site-page-header-responsive gradient-banner"
                onBack={() => window.history.back()}
                title={
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type='text'
                        className='input-text quiz-title'
                        id='quiz-title'
                        placeholder='Untitled Quiz'
                        autoFocus
                        autoComplete='on'
                        style={{width: '40vw', color:'#000'}}
                    />
                }
                subTitle={
                    <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden"  onChange={(e) => setAccesss(true)} />
                }
                extra={
                  <Button
                  onClick={() => setVisible(true)}
                  className="ml-4 text-center"
                  type="secondary"
                  shape="round"
                  size="large"
                >
                    Add Question
                </Button>
                }
            >
            </PageHeader>
            <Row>
          <Col span={24}>
            <Card
              bordered={false}
              className="circlebox mb-24"
              title="Quiz Details"
            >
              <TextArea
                // showCount
                allowClear
                autoSize={{ minRows: 2, maxRows: 6 }}
                placeholder="Quiz description..."
                onChange={(e) => setDescription(e.target.value)}
              />
              <Divider/>
              <Space>
                <div className="course-select">
                      <span className="pr-3">Quiz for: </span>
                      <Select
                        onChange={(value) => { setAssignCourse(value)}}
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select course"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                      >
                        {courses &&
                          courses.map((course, index) => (
                            <Option key={index} value={course._id}>{course.name}</Option>
                        ))}
                      </Select>
                    </div>
                    <div className="course-select">
                      <span className="pr-3">Due on: </span>
                      <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        onChange={(value) => { setDeadline(value) }}
                      />
                    </div>
                    </Space>
            </Card>
          </Col>
            </Row>
            <div className="created-questions mt-2">
                <QuestionsCreatedCard
                questionArray={questionArray}
                setQuestionArray={setQuestionArray}
                setQuestionIndex={setQuestionIndex}
                setActiveQuestion={setActiveQuestion}
                setVisible={setVisible}
                setEditQuestion={setEditQuestion}
                />
            </div>

            <AddQuestionForm
              editPage={false}
              setEditQuestion={setEditQuestion}
              visible={visible}
              setVisible={setVisible}
              question={activeQuestion}
              addQuestionHandle={addQuestionHandle}
              editQuestionHandle={editQuestionHandle}
              editQuestion={editQuestion}
              questionArray={questionArray}
            />

            <Row>
              <Col span={24} style={{textAlignLast: 'right'}}>
                <Button
                  loading={loading}
                    onClick={() => {handleQuizCreate()}}
                    className="text-center mb-4"
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="large"
                >
                    {loading ? "Saving..." : "Create Quiz"}
                </Button>
              </Col>
            </Row>
          </div>
      </InstructorRoute>
    );
};

export default QuizCreate;