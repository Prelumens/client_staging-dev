import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute"
import AddQuestionForm from "../../../../components/forms/AddQuestionForm"
import QuestionsCreatedCard from "../../../../components/cards/QuestionsCreatedCard"
import { Card, Button, Modal, Switch , PageHeader, DatePicker, Input, Row, Col, Divider, Space, Select, message} from "antd";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import moment from 'moment';
import {
    ConsoleSqlOutlined,
    PlusOutlined
} from "@ant-design/icons";
const QuizEdit = ({
	quizTitle,
	questions,

	editPage = true,
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

    const [quiz, setQuiz] = useState({});
    const [questionArray, setQuestionArray] = useState([])
    const [initialQuestions, setInitialQuestions] = useState([])
    const [assignCourse, setAssignCourse] = useState('')
    const [title, setTitle] = useState('')
    const [deadline, setDeadline] = useState('')
    const [description, setDescription] = useState('')
    const [access, setAccesss] = useState(false)
    const [courses, setCourses] = useState([]);

    //add the questions to the array
    const addQuestionHandle = (title, optionType, options, correctAnswer,image) => {
		const arr = [...questionArray]
		arr.push({ title, optionType, options, correctAnswer,image })
		setQuestionArray(arr)
        console.log("Q arr", questionArray)
	}

    useEffect(() => {
        document.title="Update Quiz"
        loadCourses();
    }, []);

    const loadCourses = async () => {
      const { data } = await axios.get("/api/instructor-courses");
      setCourses(data);
  };
    useEffect(() => {
        slug && loadQuiz();
    }, [slug]);

    const loadQuiz = async () => {
        try {
            const { data } = await axios.get(`/api/quiz-data/${slug}`);
            // setQuiz({title: data.title, slug:data.slug, access: data.access, questions:data.questions})
            if(data){
                setQuiz(data.quiz)
                setQuestionArray(data.quiz.questions)
                setInitialQuestions(data.quiz.questions)
                setTitle(data.quiz.title)
                setAccesss(data.quiz.access)
                setDescription(data.quiz.description)
                setDeadline(data.quiz.deadline)
                setAssignCourse(data.quiz.course._id)
                console.log("Received data", data)
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleQuizEdit = async () => {
        setLoading(true)
        let fail=false;
        message
        .loading('Action in progress..', 1)
        .then(() =>action())
        .then(()=>setLoading(false))

        const action= async () => {
            if (!title.length) {
                message.error('Please add title.')
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
                    const { data } = await axios.put(`/api/quiz/edit/${slug}`, {
                        questions: questionArray,
                        title,
                        access,
                        deadline,
                        assignCourse,
                        description
                    });
                    toast("Quiz Updated!");
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
        if(activeQuestion.length > 0){
            const { data } = await axios.put(
                `/api/quiz/edit-question/${quiz._id}/${activeQuestion}`,{
                    title, optionType, options, correctAnswer,image
                });
        }
        toast("Question Updated!");
        setQuestionIndex(null)
        // window.location.reload(false);
      };
    return (
        <InstructorRoute>
            <div className="container layout-default content">
            <PageHeader
                className="site-page-header-responsive gradient-banner"
                onBack={() => window.history.back()}
                title={
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type='text'
                        className='input-text quiz-title'
                        id='quiz-title'
                        value={title}
                        autoFocus
                        autoComplete='on'
                        style={{width: '40vw', color:'#000'}}
                    />
                }
                subTitle={access === true ? (
                    <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden" checked onChange={(e) => setAccesss(false)} />
                ):(
                    <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden" onChange={(e) => setAccesss(true)} />
                )
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
                        value={description}
                        allowClear
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="Quiz description..."
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Divider/>
                    <Space>
                        <div className="course-select">
                            <span className="pr-3">Assignment for: </span>
                            <Select
                                onChange={(value) => { setAssignCourse(value)}}
                                showSearch
                                value={assignCourse}
                                defaultValue={assignCourse}
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
                                    value={moment(deadline, 'YYYY-MM-DD HH:mm')}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    onChange={(value) => { setDeadline(value) }}
                                />
                            </div>
                            </Space>
                    </Card>
                </Col>
                </Row>
            <div className="text-right mt-2">
                <Button
                    onClick={() => setVisible(true)}
                    className="ml-4 text-center"
                    type="primary"
                    shape="round"
                    size="large"
                >
                    Add Question
                </Button>
            </div>
                    <div className="created-questions">
                        <QuestionsCreatedCard
                            questionArray={questionArray}
                            setQuestionArray={setQuestionArray}
                            quiz={quiz}
                            editPage={true}
                            setVisible={setVisible}
                            setQuestionIndex={setQuestionIndex}
                            setEditQuestion={setEditQuestion}
                            setActiveQuestion={setActiveQuestion}
                            initialQuestions={initialQuestions}
                        />
                    </div>
                    <Button
                        loading={loading}
                        onClick={() => {handleQuizEdit()}}
                        className="text-center float-right mb-3"
                        type="primary"
                        shape="round"
                        icon={<PlusOutlined />}
                        size="large"
                    >
                        {loading ? "Saving..." : "Update Quiz"}
                    </Button>
                        <AddQuestionForm
                            editPage={true}
                            setEditQuestion={setEditQuestion}
                            editQuestion={editQuestion}
                            question={activeQuestion}
                            visible={visible}
                            setVisible={setVisible}
                            addQuestionHandle={addQuestionHandle}
                            editQuestionHandle={editQuestionHandle}
                            questionArray={questionArray}
                        />
            </div>
        </InstructorRoute>
    );
};

export default QuizEdit;