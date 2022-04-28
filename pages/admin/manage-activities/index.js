import AdminRoute from "../../../components/routes/AdminRoute";
import { useState, useEffect } from "react";
import axios from 'axios'
import CourseCardAdmin from "../../../components/cards/CourseCardAdmin";
import { Card, Radio, Row, Col, Table, Input, Button, Tag, Descriptions } from "antd";
import Link from "next/link";
import moment from 'moment';
import {
  SearchOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone
} from '@ant-design/icons';
import { useRouter } from "next/router";

const ManageActivitiesIndex = () => {

  const router = useRouter()
  const [dataSource, setDataSource] = useState([]);
  const [all, setAll] = useState([]);
  const [tableLoad, setTableLoad] = useState(true);
  const [quiz, setQuiz] = useState([]);
  const [interactive, setInteractive] = useState([]);
  const [assignment, setAssignment] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await axios.get('/api/activities');
      var assignmentsToDisplay = data.assignments.filter(assignment => {
        return assignment.instructor !== null;
      });

      var interactivesToDisplay = data.interactives.filter(interactive => {
        return interactive.instructor !== null;
      });

      var quizzesToDisplay = data.quizzes.filter(quiz => {
        return quiz.instructor !== null;
      });

      setQuiz(quizzesToDisplay)
      setAll([...assignmentsToDisplay, ...interactivesToDisplay, ...quizzesToDisplay].sort((a, b) => a - b).reverse())
      setAssignment(assignmentsToDisplay);
      setInteractive(interactivesToDisplay)
      setDataSource([...assignmentsToDisplay, ...interactivesToDisplay, ...quizzesToDisplay].sort((a, b) => a - b).reverse())
      setTableLoad(false);
    }
    fetchActivities()
    document.title = "Manage Activities"
  }, [])

  //View Page action
  const onView = (record) => {
    console.log('record', record)
    if (quiz.includes(record)) {
      router.push(`/admin/manage-activities/quiz/${record.slug}`)
    } else if (assignment.includes(record)) {
      router.push(`/admin/manage-activities/assignment/${record.slug}`)
    } else if (interactive.includes(record)) {
      router.push(`/admin/manage-activities/interactive/${record.slug}`)
    }
  }

  const columns = [
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Enter title"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => { confirm() }}
            onBlur={() => { confirm() }}
          ></Input>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.title.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "COURSE",
      dataIndex: "course",
      key: "course",
      render: (course) => (
        <>{course && course.name}</>
      ),

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Enter Course Name"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => { confirm() }}
            onBlur={() => { confirm() }}
          ></Input>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.course?.name.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "INSTRUCTOR",
      dataIndex: "instructor",
      key: "instructor",
      render: (instructor) => (
        <>{instructor && instructor.name}</>
      ),

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Enter INstructor Name"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => { confirm() }}
            onBlur={() => { confirm() }}
          ></Input>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.instructor.name.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "DEADLINE",
      key: "deadline",
      dataIndex: "deadline",
      render: (text, txt) => (
        <div>
          {
            moment(txt.deadline).format("MMMM Do YYYY, LT")
          }
        </div>
      ),
      sorter: (a, b) => a.deadline.localeCompare(b.deadline)
    },
    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.deadline > moment().format() === value,
      render: (text, record) => (
        <div>
          {record.deadline < moment().format() ? (
            <Tag color="volcano">
              INACTIVE
            </Tag>
          ) : (
            <Tag color="green">
              ACTIVE
            </Tag>
          )}
        </div>
      ),
    },
  ];
  return (
    <AdminRoute>

      <div className="layout-default layout-student-dashboard">
        <div className="content">
          <div className="student-enrolled-courses-banner-bg">
            <h1 className="">Manage Activities</h1>
          </div>
          <Row gutter={[24, 0]} className="m-0">
            <Col xs="24" xl={24} className="p-0">
              <Card
                bordered={false}
                className="circlebox tablespace mb-24"
                title="Activity Table"
                extra={
                  <>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                      <Radio.Button onClick={() => setDataSource(all)} value="a">All</Radio.Button>
                      <Radio.Button onClick={() => setDataSource(interactive)} value="b">Interactive</Radio.Button>
                      <Radio.Button onClick={() => setDataSource(assignment)} value="c">Assignment</Radio.Button>
                      <Radio.Button onClick={() => setDataSource(quiz)} value="d">Quiz</Radio.Button>
                    </Radio.Group>
                  </>
                }
              >
                <div className="table-responsive">
                  <Button className="m-2" onClick={() => { router.reload("/admin/manage-students/list-student") }}>Clear filters and sorters</Button>
                  <Table
                    rowKey={record => record._id}
                    loading={tableLoad}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      current: page,
                      pageSize: pageSize,
                      onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                      }
                    }}
                    className="ant-border-space p-2"
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: () => { onView(record) } // click row
                      };
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

    </AdminRoute >
  );
};

export default ManageActivitiesIndex;
