import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import InteractiveActivityForm from "../../../../components/forms/InteractiveActivityForm"
import ActivityQuestions from "../../../../components/lists/ActivityQuestions"
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import moment from 'moment';
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
  Tooltip
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const InteractiveEdit = () => {
  const dateFormat = "YYYY-MM-DD HH:mm";
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
  // router
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    document.title = "Update Interactive Activity"
    loadCourses();
  }, []);

  //fetch courses from backend
  const loadCourses = async () => {
      const { data } = await axios.get("/api/instructor-courses");
      setCourses(data);
  };

    useEffect(() => {
        loadInteractive();
    }, [slug]);

  const loadInteractive = async () => {
    const { data } = await axios.get(`/api/interactive/${slug}`);
    console.log(data);
    if (data){
        setTitle(data.interactive.title)
        setQuestionArray(data.interactive.questions)
        setDescription(data.interactive.description);
        setAccesss(data.interactive.access)
        setDeadline(data.interactive.deadline)
        setAssignCourse(data.interactive.course._id)
        setInstructionSet(data.interactive.instructions)
    }
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

  const handleUpdate = async () => {
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
      if (!title.length) {
        message.error('Please add activity title.')
        fail = true
      }
      if (!questionArray.length) {
        message.error('Please add any questions.')
        fail = true
      }
      if (!deadline) {
        message.error('Please set deadline.')
        fail = true
      }
      if (!description.length) {
        message.error('Please add activity description.')
        fail = true
      }
      if (!assignCourse.length) {
        message.error('Please assign a course.')
        fail = true
      }
      if (instructionSet.length === 0) {
        message.error('Please add instructions.')
        fail = true
      }
      if(!fail){
        try {
          const { data } = await axios.put(`/api/interactive/${slug}`, {
                questions: questionArray,
                title,
                access,
                assignCourse,
                deadline,
                description,
                instructionSet
            });
            console.log(data)
            toast("Activity created!");
            router.push("/instructor/list-activity");

        } catch (err) {
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
            value={title}
            className='input-text quiz-title'
            placeholder='Untitled Activity'
            autoFocus
            autoComplete='on'
            style={{width: '40vw'}}
            />
          }
          subTitle={access === true ? (
              <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden" checked onChange={(e) => setAccesss(false)} />
          ):(
              <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden" onChange={(e) => setAccesss(true)} />
          )}
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
                  value={description}
                  allowClear
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  placeholder="Activity description..."
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Divider/>
                <Space>
                  <div className="course-select">
                        <span className="pr-3">Assignment for: </span>
                        <Select
                          value={assignCourse}
                          defaultValue={assignCourse}
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
                          value={moment(deadline, 'YYYY-MM-DD HH:mm')}
                          format="YYYY-MM-DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          onChange={(value) => { setDeadline(value) }}
                        />
                      </div>
                      </Space>
                <Divider/>
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
                          onClick={() => {addItem()}}
                          span={3}
                        >
                          <PlusOutlined /> Add item
                    </Typography.Link>
                    </Col>
                </Row>
                    {instructionSet?.map((item, index) => (
                      <div className="instruction-list-item">
                        <Space>
                          <Avatar size="small" >{index+1}</Avatar>
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
            <Col xs="24" xl={24}>
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
                <ActivityQuestions
                  editQuestion = {true}
                  setVisible={setVisible}
                  setQuestionArray = {setQuestionArray}
                  questionArray = {questionArray}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <Button
          loading={loading}
          onClick={() => {handleUpdate()}}
          className="text-center float-right mb-4"
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
        >
          {loading ? "Saving..." : "Update Activity"}
        </Button>
        <Modal
          title="+ Add Question"
          centered
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width={750}
        >
          <InteractiveActivityForm
            editQuestion = {true}
            visible={visible}
            setVisible={setVisible}
            addQuestionHandle={addQuestionHandle}
            questionArray={questionArray}
          />

        </Modal>
      </div>
    </InstructorRoute>
  );
};

export default InteractiveEdit;
