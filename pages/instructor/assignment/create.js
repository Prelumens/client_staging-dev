import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  DatePicker,
  Button,
  Upload,
  Switch,
  Select,
  PageHeader,
  Input,
  message,
  Row,
  Col,
  Card,
  Divider,
  Space
} from "antd";
import {
  ToTopOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { uploadFile } from "../../../../server/controllers/activity";

const AssignmentCreate = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const dateFormat = 'YYYY-MM-DD HH:mm';
  const [assignCourse, setAssignCourse] = useState('')
  const [deadline, setDeadline] = useState('')
  const [title, setTitle] = useState('')
  const [access, setAccesss] = useState(false)
  const [description, setDescription] = useState('')
  const [courses, setCourses] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [loading, setLoading] = useState(false)
  // router
  const router = useRouter();

    useEffect(() => {
      document.title="Create Assignment"
        loadCourses();
    }, []);

    //fetch courses from backend
    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
    };


  const formProps = {
    beforeUpload: file => {
      const fileTypes = [".doc",".docx","application/msword","application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","video/mp4","video/wmv","image/jpg", "image/jpeg","image/png"]
      console.log(file.type)
      if (!fileTypes.includes(file.type)){
        message.error(`${file.name} is not an accepted file type. Please try again.`);
        return Upload.LIST_IGNORE;
      }
    },
    onChange(info) {
      info.fileList.forEach(function (file, index) {
        let reader = new FileReader();
        reader.onload = (e) => {
          file.base64 = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file.originFileObj);
      });
      setFileList(info.fileList)
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file attached successfully`)
        console.log(typeof info.file.originFileObj)
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file attach failed.`);
      }
    },
  };

  const handleCreate = async () => {
    setLoading(true)
    let fail=false;
    const size = Buffer.byteLength(JSON.stringify(fileList))
    const kiloBytes = size / 1024;
    console.log(kiloBytes)

    message
    .loading('Action in progress..', 1)
    .then(() =>action())
    .then(()=>setLoading(false))

    const action= async () => {
      if (!title.length) {
        message.error('Please add title')
        fail = true
      }
      if (!description.length) {
        message.error('Please add description.')
        fail = true
      }
      if (!assignCourse.length) {
        message.error('Please assign a course.')
        fail = true
      }
      if (!deadline) {
        message.error('Please set deadline.')
        fail = true
      }
      if(!fail && kiloBytes < 50000){
        try {
          const { data } = await axios.post(`/api/s3/upload-file`,
          {
              fileList,
              folder: 'activities'
          });
          setUploaded(data);
          if(data){
            const { res } = await axios.post("/api/assignment/create", {
                title,
                access,
                assignCourse,
                deadline,
                description,
                uploaded: data
            });
            toast("Assignment created!");
            router.push("/instructor/list-activity");
          }

        } catch (err) {
          console.log(err);
        }
      } else {
        toast.error("File too large. Please try again.");
      }
    }
  }

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
            placeholder='Untitled Assignment'
            autoFocus
            autoComplete='on'
            style={{width: '40vw'}}
            />
          }
          subTitle={
            <Switch className="ml-2" checkedChildren="Posted" unCheckedChildren="Hidden"  onChange={(e) => setAccesss(true)} />
          }
        >
        </PageHeader>
        <div className="assignment-content">
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Card
                bordered={false}
                className="circlebox mb-24"
                title="Details"
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={15}>
                    <TextArea
                    rows={6}
                    placeholder="Assignment description..."
                    className="mb-4"
                    onChange={(e) => setDescription(e.target.value)}
                    />
                  </Col>
                  <Col span={9}>
                    <Row className="course-select">
                        <span className="pr-3">Assignment for: </span>
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
                      </Row>
                      <Row className="course-select">
                        <span className="pr-3">Due on: </span>
                        <DatePicker
                          format="YYYY-MM-DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          onChange={(value) => { setDeadline(value) }}
                        />
                      </Row>
                  </Col>
                </Row>
                <Divider/>
                <Row className="attachments">
                        <span className="pr-3">Attach file: </span>
                  <Col span={12}>
                    <Space direction="vertical" style={{width: '50%'}}>
                        <Upload {...formProps} style={{width: '100%'}}
                          accept=".doc,.docx,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/wmv,image/jpg,image/jpeg,image/png"
                        >
                          <Button
                            type="dashed"
                            block
                            icon={<ToTopOutlined />}
                          >
                            Add files
                          </Button>
                      </Upload>
                      {/* <Button
                            block
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        // loading={uploading}
                        style={{ marginTop: 16 }}
                      >
                        Start Upload
                      </Button> */}
                    </Space>
                  </Col>
                </Row>
                <Button
                  loading={loading}
                  onClick={() => {handleCreate()}}
                  className="text-center float-right"
                  type="primary"
                  shape="round"
                  icon={<PlusOutlined />}
                  size="large"
                >
                  {loading ? "Saving..." : "Add Assignment"}
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default AssignmentCreate;
