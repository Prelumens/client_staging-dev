import { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute"
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import { Table, Space, Tooltip, Modal, Input, Button, Descriptions, Card } from 'antd';
import {
    ArrowsAltOutlined,
    BookOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6)
    const [visibleModal, setVisibleModal] = useState(true)

    const router = useRouter()

    useEffect(() => {
        document.title = "List of Students"
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/instructor/list-student");
            console.log(data)
            setStudents(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const onViewRecord = (student) => {
        Modal.destroyAll();
        router.push(`/instructor/student-record/${student.username}`)
    }
    const columns = [
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Enter Last Name"
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
                return record.lastName.toLowerCase().includes(value.toLowerCase())
            }
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Enter First Name"
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
                return record.firstName.toLowerCase().includes(value.toLowerCase())
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Student Number',
            dataIndex: 'studentNum',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Enter Student Number"
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
                return record.studentNum.toLowerCase().includes(value.toLowerCase())
            }
        },
        {
            title: 'Level',
            dataIndex: 'level',
            filters: [
                { text: 'Kindergarten', value: 'Kindergarten' },
                { text: 'Nursery', value: 'Nursery' },
            ],
            onFilter: (value, record) => record.level.indexOf(value) === 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (student) => (
                <Space size="middle">
                    <Tooltip title="View all details" onClick={() => onViewAllDetails(student)}>
                        <ArrowsAltOutlined style={{ fontSize: '18px' }} className="text-success" />
                    </Tooltip >
                </Space >
            ),
        },
    ]

    //View all Details Action
    const onViewAllDetails = (student) => {
        console.log("View all Details", student)
        Modal.info({
            title: 'Student Information',
            content: (
                <div>
                    <Descriptions column={1} size="small" labelStyle={{ fontWeight: 'bold' }}>
                        <Descriptions.Item label="Username">{student.username}</Descriptions.Item>
                        <Descriptions.Item label="Student Number">{student.studentNum}</Descriptions.Item>
                        <Descriptions.Item label="First Name">{student.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Middle Name">{student.middleName}</Descriptions.Item>
                        <Descriptions.Item label="Last Name">{student.lastName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                        <Descriptions.Item label="Birthdate">{student.birthDate}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{student.gender}</Descriptions.Item>
                        <Descriptions.Item label="Guardian">{student.guardian}</Descriptions.Item>
                        <Descriptions.Item label="Contact Number">{student.contact}</Descriptions.Item>
                        <Descriptions.Item label="Address">{student.address}</Descriptions.Item>
                    </Descriptions>
                    <Button block type="primary" ghost onClick={() => onViewRecord(student)}>
                        <BookOutlined />
                        View Submission Records
                    </Button>
                </div>
            ),
            closable: true,
        });
    }

    return (
        <InstructorRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="instructor-list-of-students-banner-bg">
                        <h1 className="">List of Students</h1>
                    </div>
                    <div className="container-fluid mr-3">
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={() => { router.reload("/instructor/list-student") }}>Clear filters and sorters</Button>
                        </Space>
                        <Card
                            bordered={false}
                            className="circlebox tablespace mb-24"
                        >
                            <Table
                                className="p-2"
                                loading={loading}
                                columns={columns}
                                dataSource={students}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize);
                                    }
                                }}
                            />
                        </Card>
                    </div>
                </div>
            </div>


        </InstructorRoute>
    );
};

export default StudentList;
