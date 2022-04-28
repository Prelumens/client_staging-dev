import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import moment from 'moment';
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
  List, Avatar,
  Space
} from "antd";
import {
  ToTopOutlined,
  PlusOutlined,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileTwoTone,
  FileImageTwoTone,
  PlaySquareTwoTone
} from "@ant-design/icons";

const AssignmentCreate = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const dateFormat = "YYYY-MM-DD HH:mm";
  const [assignCourse, setAssignCourse] = useState('')
  const [deadline, setDeadline] = useState('')
  const [title, setTitle] = useState('')
  const [access, setAccesss] = useState(false)
  const [description, setDescription] = useState('')
  const [courses, setCourses] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false)
  // router
  const router = useRouter();
  const { slug } = router.query;

    useEffect(() => {
        loadAssignment();
    }, [slug]);

    const loadAssignment = async () => {
        const { data } = await axios.get(`/api/assignment/${slug}`);
        console.log(data);
        if (data){
            setTitle(data.assignment.title)
            setDescription(data.assignment.description);
            setAccesss(data.assignment.access)
            setDeadline(data.assignment.deadline)
            setAssignCourse(data.assignment.course._id)
            setFiles(data.assignment.attachment)
        }
    };

    useEffect(() => {
      document.title="Update Assignment"
        loadCourses();
    }, []);

    //fetch courses from backend
    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
    };


    const formProps = {
      onChange(info) {
        let tempArr = []
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
    const handleUpload = async () => {
      const size = Buffer.byteLength(JSON.stringify(fileList))
      const kiloBytes = size / 1024;
      console.log(kiloBytes)
      if(kiloBytes < 50000){
        try {
          const { data } = await axios.post(`/api/s3/upload-file`,
          {
              fileList,
              folder: 'activities'
          });
          let temp = []
          data.forEach(item => {
            temp.push(item)
          });
          setNewFiles(temp)
          toast("Attachments uploaded!");
        } catch (error) {
          console.log(error)
        }
      } else {
        toast.error("File too large. Please try again.");
      }
    };
  const handleUpdate = async () => {
    setLoading(true)
    let fail=false;

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
      console.log(deadline)
      if (!deadline) {
        message.error('Please add deadline.')
        fail = true
      }
      if(!fail){
        try {
            const { data } = await axios.put(`/api/assignment/${slug}`, {
                title,
                access,
                assignCourse,
                deadline,
                description,
                files,
                newFiles
            });
            toast("Assignment Updated!");
            router.push("/instructor/list-activity");
        } catch (err) {
            console.log(err);
        }
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
          value={title}
          className='input-text quiz-title'
          placeholder='Untitled Assignment'
          autoFocus
          autoComplete='on'
          style={{width: '40vw'}}
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
      <div className="assignment-content">
            <Card
              bordered={false}
              className="circlebox mb-24"
              title="Details"
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={15}>
                  <TextArea
                  value={description}
                  rows={6}
                  placeholder="Assignment description..."
                  className="mb-4"
                  autoFocus
                  autoComplete='on'
                  onChange={(e) => setDescription(e.target.value)}
                  />
                </Col>
                <Col span={9}>
                  <Row className="course-select">
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
                    </Row>
                    <Row className="course-select">
                      <span className="pr-3">Due on: </span>
                      <DatePicker
                        value={moment(deadline, 'YYYY-MM-DD HH:mm')}
                        format="YYYY-MM-DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        onChange={(value) => { setDeadline(value) }}
                      />
                    </Row>
                </Col>
              </Row>
              <List
                itemLayout="horizontal"
                dataSource={[...files, ...newFiles]}
                renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                    avatar={ item && item.key &&
                      <Avatar
                      style={{ backgroundColor: '#e6f7ff' }}
                      icon={item.key.match(new RegExp('[^.]+$'))[0] === 'pdf' ?
                          <FilePdfTwoTone />
                          : item.key.match(new RegExp('[^.]+$'))[0] === 'docx' ?
                          <FileWordTwoTone />
                          :  item.key.match(new RegExp('[^.]+$'))[0] === 'jpeg' || item.key.match(new RegExp('[^.]+$'))[0] === 'png' || item.key.match(new RegExp('[^.]+$'))[0] === 'jpg' ?
                          <FileImageTwoTone />
                          : item.key.match(new RegExp('[^.]+$'))[0] === 'mp4' || item.key.match(new RegExp('[^.]+$'))[0] === 'wmv' ?
                          <PlaySquareTwoTone />
                          :
                          <FileTwoTone />
                      }
                      >
                      </Avatar>
                      }
                    title={<a href={item.Location}>{item.name}</a>}
                    />
                </List.Item>
                )}
                />
              <Row className="attachments">
                      <span className="pr-3">Attach file: </span>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '50%'}}>
                      <Upload {...formProps} style={{width: '100%'}}>
                        <Button
                          type="dashed"
                          block
                          icon={<ToTopOutlined />}
                        >
                          Add files
                        </Button>
                    </Upload>
                    <Button
                          block
                      type="primary"
                      onClick={handleUpload}
                      disabled={fileList.length === 0}
                      loading={loading}
                      style={{ marginTop: 16 }}
                    >
                      Start Upload
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
        <Button
          loading={loading}
          onClick={() => {handleUpdate()}}
          className="text-center float-right mb-4"
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
        >
          {loading ? "Saving..." : "Update Assignment"}
        </Button>
      </div>
      </div>
    </InstructorRoute>
  );
};

export default AssignmentCreate;
