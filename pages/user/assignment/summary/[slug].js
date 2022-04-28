import UserRoute from "../../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import moment from 'moment';
import axios from "axios";
import {
  Col,
  Card,
  Typography,
  Row,
  Tag,
  Divider,
  Upload,
  Button,
  message,
  List,
  Avatar,
  Spin
} from 'antd';
import {
  ToTopOutlined,
  DeleteOutlined,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileTwoTone,
  FileImageTwoTone,
  PlaySquareTwoTone
} from "@ant-design/icons";
import { Context } from "../../../../context";

const AssignmentSummary = (

) => {
  const {
    state: { user },
  } = useContext(Context);
  const { Title, Text, Paragraph } = Typography;
  const [spin, setSpin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(false);
  const [resubmit, setResubmit] = useState(false);
  const [assignCourse, setAssignCourse] = useState('')
  const [instructor, setInstructor] = useState('')
  const [assignment, setAssignment] = useState({
    title: ''
  });
  const [submitted, setSubmitted] = useState({});
  const [fileList, setFileList] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  // router
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    setAssignment({});
    loadAssignment();
  }, [slug]);

  useEffect(()=>{
    document.title = assignment.title?.toString()
  },[assignment.title])

  const loadAssignment = async () => {
    const { data } = await axios.get(`/api/assignment-student/${slug}`);
    console.log("data", data)
    if (data) {
      setAssignment(data.assignment);
      setInstructor(data.assignment.instructor)
      setAssignCourse(data.assignment.course)
      if(data.submission){
        setSubmitted(data.submission)
        setInitialFiles(data.submission.content)
        setResubmit(true)
        if(data.submission.return || !data.assignment.access || moment().isAfter(assignment.deadline)){
          setAccess(true)
        }
      }
    }
    setLoading(false)
  };

  const unSubmit = async () => {
    setResubmit(false)
    try {
      const { data } = await axios.put(`/api/assignment/student/unsubmit`, {
        id: submitted._id
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    if(initialFiles.length === 0){
      if(fileList.length === 0){
        message.error("Please add files to be submitted.")
        return
      }
    };
    try {
      setSpin(true)
      if(fileList.length !== 0){
        const { data } = await axios.post(`/api/s3/upload-file`,
        {
            fileList,
            folder: 'activities'
        });
        if (data) {
          const { res } = await axios.post("/api/assignment/submit", {
            files: [...data,...initialFiles],
            submissionDate: moment(),
            assignment
          });}
      } else {
        const { res } = await axios.post("/api/assignment/submit", {
          files: initialFiles,
          submissionDate: moment(),
          assignment
        });
      }
      toast("Assignment submitted successfully!")
      router.push(`/user/list-activity`);
      setSpin(false)

    } catch (error) {
      console.log(error)
    }
    try {
      if (user) {
        try {
          const { data } = await axios.put(`/api/student/completedAssignment/${user._id}`, {
            title: "Assignment Completed",
            description: `Your child completed the assignment ${assignment.title}`
          })
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const props = {
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
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleFileDelete = (index) => {
    let allFiles = [...initialFiles];
    const removed = allFiles.splice(index, 1);
    setInitialFiles(allFiles)

  };

  return (
    <UserRoute>
      <Spin spinning={spin}>
        <Row gutter={[24, 0]} className="mt-2">
          <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="circlebox h-full" loading={loading}>
              <Row gutter>
                <Col span={24}>
                  <div className="h-full col-content p-20">
                    <div className="ant-muse">
                      <Tag color="#108ee9" className="mb-2">{assignCourse.name}</Tag>
                      <Title className="text-uppercase font-weight-bold" level={5}>{assignment.title}</Title>
                      <Text type="secondary">by {instructor.name} <Divider type="vertical" /> Due on {moment(assignment.deadline).format("MMMM Do YYYY, LT")}</Text>
                      <Divider />
                      <Paragraph className="lastweek mb-36">
                        {assignment.description}
                      </Paragraph>
                      <Divider />
                      {assignment.attachment && assignment.attachment.length !== 0 ? (
                        <List
                          header={<Text>Attachments</Text>}
                          itemLayout="horizontal"
                          dataSource={assignment.attachment}
                          renderItem={(item, index) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                  style={{ backgroundColor: '#e6f7ff' }}
                                  icon={item.key.match(new RegExp('[^.]+$'))[0] === 'pdf' ? <FilePdfTwoTone /> : item.key.match(new RegExp('[^.]+$'))[0] === 'docx' ? <FileWordTwoTone /> : <FileTwoTone />}
                                  >
                                  </Avatar>
                                  }
                                title={<a href={item.Location}>{item.name}</a>}
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <></>
                      )}

                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
            <Card
              bordered={false}
              className="circlebox card-info-2 h-full"
              loading={loading}
              title={submitted?.return && <Tag color="geekblue">RETURNED</Tag>}
              extra={submitted?.return &&
                <>
                  <h3 className="text-success mb-0">{submitted.grade}</h3>
                  <small className="text-muted">points</small>
                </>
              }
            >
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Submission</Title>
                  <div className="uploadfile shadow-none pb-4">
                    <Upload {...props}
                        accept=".doc,.docx,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/wmv,image/jpg,image/jpeg,image/png"
                      >
                      <Button
                        disabled={resubmit}
                        block
                        type="dashed"
                        className="ant-full-box"
                        icon={<ToTopOutlined />}
                      >
                        <span className="click">Click to Upload</span>
                      </Button>
                    </Upload>
                  </div>
                  {initialFiles?.length !==0  &&
                    <List
                      itemLayout="horizontal"
                      dataSource={[...initialFiles]}
                      renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={  item && item.key &&
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
                            {!resubmit &&
                              <DeleteOutlined
                                onClick={() => handleFileDelete(index)}
                                className="text-danger float-right"
                              />
                            }
                        </List.Item>
                      )}
                    />
                  }
                  {resubmit ?
                    <Button type="primary" block onClick={unSubmit} disabled={access}>
                        Unsubmit
                    </Button>
                  :
                    <Button type="primary" block onClick={handleSubmit}>
                        Submit
                    </Button>
                  }
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </UserRoute>
  )
}
export default AssignmentSummary;