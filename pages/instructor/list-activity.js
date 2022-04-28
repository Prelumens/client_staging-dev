import InstructorRoute from "../../components/routes/InstructorRoute";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import { toast } from 'react-toastify'
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  PageHeader,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Typography,
  Input,
  Tag,
  Space,
  Modal,
  Empty
} from 'antd';
const { Title } = Typography;
import {
  DownOutlined,
  PushpinOutlined,
  BlockOutlined,
  ArrowsAltOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FormOutlined
} from "@ant-design/icons";

const ActivityList = () => {
  const router = useRouter()
  const [tableLoad, setTableLoad] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [assignment, setAssignment] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [all, setAll] = useState([]);
  const [interactive, setInteractive] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20)
  // table code start
  const columns = [
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      width: "32%",
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
        <>{course.name}</>
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
      title: "ACCESS",
      key: "access",
      dataIndex: "access",
      filters: [
        { text: 'Posted', value: true },
        { text: 'Hidden', value: false },
      ],
      onFilter: (value, record) => record.access === value,
      render: (text, record) => (
        <div>
          {!record.access ? (
            <Tag color="volcano">
              HIDDEN
            </Tag>
          ) : (
            <Tag color="green">
              POSTED
            </Tag>
          )}
        </div>
      ),
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
      sorter: (a, b) => a.deadline.localeCompare(b.deadline),
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (dataSource) => (
        <Space size="middle">
          <Tooltip title="View all details" onClick={() => onView(dataSource)}>
            <ArrowsAltOutlined style={{ fontSize: '18px' }} className="text-success" />
          </Tooltip >
          <Tooltip title="Edit" onClick={() => onEdit(dataSource)}>
            <EditOutlined style={{ fontSize: '18px' }} className="text-warning" />
          </Tooltip>

          <Tooltip title="Remove" onClick={() => onDelete(dataSource)}>
            <DeleteOutlined style={{ fontSize: '18px' }} className="text-danger" />
          </Tooltip>
        </Space >
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<BlockOutlined />}>
        <Link href="/instructor/interactive/create">
          Interactive
        </Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<PushpinOutlined />}>
        <Link href="/instructor/assignment/create">
          Assignment
        </Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<FormOutlined />}>
        <Link href="/instructor/quiz/create">
          Quiz
        </Link>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    document.title = "Manage Activities"
    loadActivities();
  }, []);

  //fetch assignment from backend
  const loadActivities = async () => {
    const { data } = await axios.get("/api/instructor-activity");
    console.log('data', data)
    setAssignment(data.assignments);
    setInteractive(data.interactives)
    setQuiz(data.quizzes)
    setAll([...data.assignments, ...data.interactives, ...data.quizzes])
    setDataSource([...data.assignments, ...data.interactives, ...data.quizzes])
    setTableLoad(false);
  };

  //View Page action
  const onView = (activity) => {
    if (quiz.includes(activity)) {
      router.push(`/instructor/quiz/view/${activity.slug}`)
    } else if (assignment.includes(activity)) {
      router.push(`/instructor/assignment/view/${activity.slug}`)
    } else if ((interactive.includes(activity))) {
      router.push(`/instructor/interactive/view/${activity.slug}`)
    }
  }
  //Edit action
  const onEdit = (activity) => {
    if (assignment.includes(activity)) {
      router.push(`/instructor/assignment/edit/${activity.slug}`)
    } else if (quiz.includes(activity)) {
      router.push(`/instructor/quiz/edit/${activity.slug}`)
    } else {
      router.push(`/instructor/interactive/edit/${activity.slug}`)
    }
  }
  // Delete Action
  const onDelete = (activity) => {
    console.log("test", activity.slug);
    const slug = activity.slug;
    let api = "";
    try {
      if (assignment.includes(activity)) {
        api = "remove-assignment"
      } else if (quiz.includes(activity)) {
        api = "remove-quiz"
      } else {
        api = "remove-interactive"
      }
      console.log("api", api);

      const deleteItem = async () => {
        const { activity } = await axios.put(`/api/activity/${api}/${slug}`);
        toast.success("Activity deleted")
        window.location.reload()
      }

      if (activity) {
        Modal.confirm({
          title: 'Are you sure you want to delete this record?',
          onOk: () => {
            deleteItem()
          }
        })
      }
    } catch (err) {
      toast.error(err.response.data)
    }
  }
  return (
    <InstructorRoute>
      <div className="content">
        <PageHeader
          className="site-page-header-responsive gradient-banner"
          onBack={() => window.history.back()}
          title="Activities"
          extra={[
            <Dropdown overlay={menu}>
              <Button type="primary">
                ADD ACTIVITY <DownOutlined />
              </Button>
            </Dropdown>
          ]}
        >
        </PageHeader>
        <div className="table">
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
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
                  {dataSource.length > 0 ?
                    <Table
                      pagination={{
                        current: page,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                          setPage(page);
                          setPageSize(pageSize);
                        }
                      }}
                      loading={tableLoad}
                      columns={columns}
                      dataSource={dataSource.sort((a, b) => b.createdAt.localeCompare(a.createdAt))}
                      className="ant-border-space p-2"
                    />
                    :
                    <Empty
                      className="mb-5"
                      // image="https://i.pinimg.com/originals/45/12/4d/45124d126d0f0b6d8f5c4d635d466246.gif"
                      image="https://i.pinimg.com/originals/5d/35/e3/5d35e39988e3a183bdc3a9d2570d20a9.gif"
                      imageStyle={{
                        height: 300,
                      }}
                      description={
                        <span className="text-muted">
                          No Data to Display
                        </span>
                      }
                    >
                    </Empty>
                  }

                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default ActivityList;