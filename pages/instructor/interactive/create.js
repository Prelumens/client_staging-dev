import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import InteractiveActivityForm from "../../../components/forms/InteractiveActivityForm"
import ActivityQuestions from "../../../components/lists/ActivityQuestions"
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  Avatar,
  Modal,
  message,
  Switch,
  Select,
  PageHeader,
  Input,
  Space,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  DatePicker,
  Button,
  Empty,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";

const InteractiveCreate = () => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [assignCourse, setAssignCourse] = useState('')
  const [title, setTitle] = useState('')
  const [access, setAccesss] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [questionArray, setQuestionArray] = useState([])
  const [instructionSet, setInstructionSet] = useState([])
  const [instruction, setInstruction] = useState('');
  const [visible, setVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState({});
  const [editQuestion, setEditQuestion] = useState(false)
  // router
  const router = useRouter();
  useEffect(() => {
    document.title = "Create Interactive Activity"
    loadCourses();
  }, []);

  //fetch courses from backend
  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
  };

  const addItem = () => {
    setInstructionSet([...instructionSet, instruction]);
    console.log(instructionSet);
    setInstruction('');
  };
  //add the questions to the array
  const addQuestionHandle = (titleField, type, choices, correctAnswer) => {
    const arr = [...questionArray]
    arr.push({ titleField, type, choices, correctAnswer })
    setQuestionArray(arr)
    console.log(arr);
  }

  const editQuestionHandle = async (titleField, type, choices,correctAnswer) => {
    const temp = [...questionArray];
    temp[questionIndex] = {titleField, type, choices,correctAnswer};
    setQuestionArray(temp)
    console.log('temp', temp)
    toast("Question Updated!");
    setQuestionIndex(null)
    // window.location.reload(false);
  };
  const handleCreate = async () => {
    setLoading(true)
    let fail = false;
    message
      .loading('Action in progress..', 1)
      .then(() => action())
      .then(() => setLoading(false))

    const action = async () => {
      if (!title.length) {
        message.error('Please add activity title.')
        fail = true
      }
      if (!questionArray.length) {
        message.error('Please add a question.')
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
      if (!description.length) {
        message.error('Please add description.')
        fail = true
      }
      if (instructionSet.length === 0) {
        message.error('Please add instructions.')
        fail = true
      }
      if (!fail) {
        try {
          const { data } = await axios.post("/api/interactive/create", {
            questions: questionArray,
            title,
            access,
            assignCourse,
            deadline,
            description,
            instructionSet
          });
          toast("Activity created successfuly!");
          router.push("/instructor/list-activity");

        } catch (err) {
          toast.error(err.response.data)
          console.log(err);
        }
      }
    }
  }
  const handleInstructionRemove = (index) => {
    let allInstructions = [...instructionSet];
    const removed = allInstructions.splice(index, 1);
    setInstructionSet(allInstructions)
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
              placeholder='Untitled Activity'
              autoFocus
              autoComplete='on'
              style={{ width: '40vw' }}
            />
          }
          subTitle={
            <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden" onChange={(e) => setAccesss(true)} />
          }
        >
        </PageHeader>
        <div className="assignment-content">
          <Row>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="circlebox mb-24"
                title="Activity Details"
              >
                <TextArea
                  // showCount
                  allowClear
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  placeholder="Activity description..."
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Divider />
                <Space>
                  <div className="course-select">
                    <span className="pr-3">Assignment for: </span>
                    <Select
                      onChange={(value) => { setAssignCourse(value) }}
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
                <Divider />
                <Row gutter={[16, 16]} className="instruction mb-3">
                  <Col span={21}>
                    <Input
                      placeholder="Write instruction here"
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Typography.Link
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => { addItem() }}
                      span={3}
                    >
                      <PlusOutlined /> Add item
                    </Typography.Link>
                  </Col>
                </Row>
                {instructionSet.map((item, index) => (
                  <div className="instruction-list-item" key={index}>
                    <Space>
                      <Avatar size="small" >{index + 1}</Avatar>
                      <li key={item}>{item}</li>
                      <Tooltip title="Remove">
                        <MinusCircleOutlined
                          onClick={() => handleInstructionRemove(index)}
                          className="text-danger float-right"
                        />
                      </Tooltip>
                    </Space>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card
                bordered={false}
                className="circlebox mb-24"
                title="Activity Questions"
                extra={
                  <Typography.Link
                    style={{ whiteSpace: 'nowrap' }}
                    span={6}
                    onClick={() => setVisible(true)}
                  >
                    <PlusOutlined /> Add Question
                  </Typography.Link>
                }
              >
                {questionArray.length > 0 ?
                  < ActivityQuestions
                    setQuestionIndex={setQuestionIndex}
                    editQuestion = {editQuestion}
                    setEditQuestion={setEditQuestion}
                    setActiveQuestion={setActiveQuestion}
                    setVisible={setVisible}
                    setQuestionArray = {setQuestionArray}
                    questionArray = {questionArray}
                  />
                  :
                  <>
                    <Empty
                      image="https://cdn.dribbble.com/users/391380/screenshots/5431062/icon.gif"
                      imageStyle={{
                        height: 200,
                      }}
                      description={
                        <span className="text-muted">
                          No Added Questions Yet
                        </span>
                      }
                    >
                    </Empty>
                  </>
                }

              </Card>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span={24} style={{textAlignLast: 'right'}}>
            <Button
              onClick={() => { handleCreate() }}
              loading={loading}
              className="text-centert mb-4"
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              size="large"
            >
              {loading ? "Saving..." : "Add Activity"}
            </Button>
          </Col>
        </Row>
          <InteractiveActivityForm
            setActiveQuestion={setActiveQuestion}
            question={activeQuestion}
            editQuestion = {editQuestion}
            setEditQuestion={setEditQuestion}
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

export default InteractiveCreate;
