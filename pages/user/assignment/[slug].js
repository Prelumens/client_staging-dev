import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import moment from 'moment';
import axios from "axios";
import ReactPlayer from "react-player";
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
  Spin,
  Modal,
  Image
} from 'antd';
import {
  ToTopOutlined,
  PlusOutlined,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileTwoTone,
  FileImageTwoTone,
  PlaySquareTwoTone
} from "@ant-design/icons";
import { Context } from "../../../context";
import { fixControlledValue } from "antd/lib/input/Input";

const SingleAssignment = (

) => {
  const {
    state: { user },
  } = useContext(Context);

  const { Title, Text, Paragraph } = Typography;
  const [spin, setSpin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignCourse, setAssignCourse] = useState('')
  const [instructor, setInstructor] = useState('')
  const [assignment, setAssignment] = useState({
    title: ''
  });
  const [submitted, setSubmitted] = useState({});
  const [openedFile, setOpenedFile] = useState({});
  const [fileList, setFileList] = useState([]);
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
      }
    }
    setLoading(false)
  };

  const handleSubmit = async () => {
    if(fileList.length === 0){
      message.error("Please add files to be submitted.")
      return
    }
    try {
      setSpin(true)
      const { data } = await axios.post(`/api/s3/upload-file`,
        {
            fileList,
            folder: 'activities'
        });
      if (data) {
        const { res } = await axios.post("/api/assignment/submit", {
          files: data,
          submissionDate: moment(),
          assignment
        });
      }
      toast("Assignment submitted successfully!")
      router.push(`/user/list-activity`);
      console.log(user._id)
      console.log(assignment.title)
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

  const onFileView = (item) => {
    setVisible(true)
    setOpenedFile(item)
  }

  return (
    <UserRoute>
      <Spin spinning={spin}>
        <Row gutter={[24, 0]}>
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
                                title={item?.Key?.includes('.jpeg') || item?.Key?.includes('.png') || item?.Key?.includes('.jpg') || item?.Key?.includes('.mp4') || item?.Key?.includes('.wmv')?
                                    <a onClick={()=>onFileView(item)}>{item.name}</a>
                                  : <a href={item.Location}>{item.name}</a>
                                }
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
            <Card bordered={false} className="circlebox card-info-2 h-full"  loading={loading}>
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Submission</Title>
                  <div className="uploadfile shadow-none pb-4">
                    <Upload {...props}
                      accept=".doc,.docx,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/wmv,image/jpg,image/jpeg,image/png"

                    >
                      <Button
                        block
                        type="dashed"
                        className="ant-full-box"
                        icon={<ToTopOutlined />}
                      >
                        <span className="click">Click to Upload</span>
                      </Button>
                    </Upload>
                  </div>
                  <Button type="primary" block onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          title={openedFile.name}
          centered
          visible={visible}
          onCancel={()=>setVisible(false)}
          closable
          footer={false}
        >
          <div className="wrapper text-center" style={{ alignSelf: 'center' }}>
            {openedFile?.Key?.includes('.mp4') || openedFile?.Key?.includes('.wmv') ?
                <ReactPlayer
                    url={openedFile.Location}
                    playing={false}
                    controls={true}
                    width="100%"
                    height="100%"
                />
              :
              <Image width={300} src={openedFile.Location}/>
            }
          </div>
        </Modal>
      </Spin>
    </UserRoute>
  )
}
export default SingleAssignment;