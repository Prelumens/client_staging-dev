import { useEffect, useState } from "react";
import AdminRoute from "../../../components/routes/AdminRoute";
import axios from "axios";
import { SyncOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Table, Space, Tooltip, Modal, Input, Button, Descriptions, Card, Radio } from 'antd';
import {
    ArrowsAltOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    BookOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

const StudentList = () => {
    const [activeStudents, setActiveStudents] = useState([]);
    const [inactiveStudents, setInactiveStudents] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6)

    const router = useRouter()

    useEffect(() => {
        document.title = "List of Student"
        loadStudents();
    }, []);

    const onViewRecord = (student) => {
        Modal.destroyAll();
        router.push(`/admin/manage-students/student-record/${student.username}`)
    }
    const loadStudents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/admin/list-student");
            console.log()
            setDataSource([...data.active])
            setActiveStudents(data.active);
            setInactiveStudents(data.inactive)
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

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
                    {activeStudents.includes(student) &&
                        <>
                            <Tooltip title="Edit" onClick={() => onEdit(student)}>
                                <EditOutlined style={{ fontSize: '18px' }} className="text-warning" />
                            </Tooltip>

                            <Tooltip title="Remove" onClick={() => onDelete(student)}>
                                <DeleteOutlined style={{ fontSize: '18px' }} className="text-danger" />
                            </Tooltip>
                        </>
                    }
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
                    {/* <pre>{JSON.stringify(student, null, 4)}</pre> */}
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
            onOk() { },
        });
    }

    //Edit action
    const onEdit = (student) => {
        const slug = student.email
        router.push(`/admin/manage-students/edit/${slug}`)
    }

    // Delete Action
    const onDelete = (student) => {
        try {
            const deleteFrontEnd = () => {
                setActiveStudents((previousValue) => {
                    return (
                        previousValue.filter((item) => item.email !== student.email)
                    )
                })


            }

            Modal.confirm({
                title: 'Are you sure you want to delete this student record?',
                onOk: async () => {
                    deleteFrontEnd()

                    //remove student to Student Collection
                    // try {
                    //     const { removedStudent } = await axios.put(`/api/admin/remove-student/${student.email}`);
                    // } catch (error) {
                    //     console.log(error)
                    // }

                    //remove student to User Collection
                    try {
                        const { removedUser } = await axios.put(`/api/admin/remove-user/${student.email}`);
                    } catch (error) {
                        console.log(error)
                    }

                    //set the student to inactive
                    try {
                        const { data } = await axios.put(`/api/admin/inactive-student/${student.email}`)
                    } catch (error) {

                    }

                    //when all request are completed
                    toast.success("Student record deleted")
                    window.location.reload()
                }
            })
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    return (
        <AdminRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="admin-list-of-students-banner-bg">
                        <h1 className="">List of Students</h1>
                    </div>
                    <div className="container-fluid mr-3">
                        <Space style={{ marginBottom: 16 }}>
                            <Button
                                icon={<UserAddOutlined />}
                                style={{ marginRight: 8 }}
                                onClick={() => { router.push("/admin/manage-students/add-student") }}
                            >
                                Add Student
                            </Button>
                        </Space>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={() => { router.reload("/admin/manage-students/list-student") }}>Clear filters and sorters</Button>
                        </Space>
                        <Card
                            bordered={false}
                            className="circlebox tablespace mb-24"
                            extra={
                                <>
                                    <Radio.Group defaultValue="active" buttonStyle="solid">
                                        <Radio.Button onClick={() => setDataSource(activeStudents)} value="active">Active</Radio.Button>
                                        <Radio.Button onClick={() => setDataSource(inactiveStudents)} value="inactive">Inactive</Radio.Button>
                                    </Radio.Group>
                                </>
                            }
                        >
                            <Table
                                className="p-2"
                                loading={loading}
                                columns={columns}
                                dataSource={dataSource.sort((a, b) => a.lastName.localeCompare(b.lastName))}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize);
                                    }
                                }}
                                rowClassName={(record, index) => {
                                    if (inactiveStudents.includes(record))
                                        return 'text-muted'
                                }}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
};

export default StudentList;
