import { useEffect, useState } from "react";
import AdminRoute from "../../../components/routes/AdminRoute";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import { Table, Space, Tooltip, Modal, Input, Button, Descriptions, Radio, Card } from 'antd';
import {
    ArrowsAltOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

const InstructorList = () => {
    const [activeInstructors, setActiveInstructors] = useState([]);
    const [inactiveInstructors, setInactiveInstructors] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6)

    const router = useRouter()

    useEffect(() => {
        document.title = "List of Instructors"
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/admin/list-instructor");
            console.log()
            setActiveInstructors(data.active);
            setInactiveInstructors(data.inactive)
            setDataSource([...data.active])
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
            title: 'Action',
            key: 'action',
            render: (instructor) => (
                <Space size="middle">
                    <Tooltip title="View all details" onClick={() => onViewAllDetails(instructor)}>
                        <ArrowsAltOutlined style={{ fontSize: '18px' }} className="text-success" />
                    </Tooltip >
                    {activeInstructors.includes(instructor) &&
                        <>
                            <Tooltip title="Edit" onClick={() => onEdit(instructor)}>
                                <EditOutlined style={{ fontSize: '18px' }} className="text-warning" />
                            </Tooltip>
                            <Tooltip title="Remove" onClick={() => onDelete(instructor)}>
                                <DeleteOutlined style={{ fontSize: '18px' }} className="text-danger" />
                            </Tooltip>
                        </>

                    }
                </Space >
            ),
        },
    ]

    //View all Details Action
    const onViewAllDetails = (instructor) => {
        console.log("View all Details", instructor)
        Modal.info({
            title: 'Instructor Information',
            content: (
                <div>
                    {/* <pre>{JSON.stringify(student, null, 4)}</pre> */}
                    <Descriptions column={1} size="small" labelStyle={{ fontWeight: 'bold' }}>
                        <Descriptions.Item label="Username">{instructor.username}</Descriptions.Item>
                        <Descriptions.Item label="First Name">{instructor.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Middle Name">{instructor.middleName}</Descriptions.Item>
                        <Descriptions.Item label="Last Name">{instructor.lastName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{instructor.email}</Descriptions.Item>
                        <Descriptions.Item label="Birthdate">{instructor.birthDate}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{instructor.gender}</Descriptions.Item>
                        <Descriptions.Item label="Contact Number">{instructor.contact}</Descriptions.Item>
                        <Descriptions.Item label="Address">{instructor.address}</Descriptions.Item>
                    </Descriptions>
                </div>
            ),
            onOk() { },
        });
    }

    //Edit action
    const onEdit = (instructor) => {
        const slug = instructor.email
        router.push(`/admin/manage-instructors/edit/${slug}`)
    }

    // Delete Action
    const onDelete = (instructor) => {
        try {
            console.log("instructor email [front] =>", instructor.email)
            const deleteFrontEnd = async () => {
                setActiveInstructors((previousValue) => {
                    return (
                        previousValue.filter((item) => item.email !== instructor.email)
                    )
                })
            }

            Modal.confirm({
                title: 'Are you sure you want to delete this instructor record?',
                onOk: async () => {
                    deleteFrontEnd()

                    //delete to instructor collection
                    // try {
                    //     const { removedInstructor } = await axios.put(`/api/admin/remove-instructor/${instructor.email}`);
                    // } catch (error) {
                    //     console.log(error)
                    // }

                    //delete to user collection
                    try {
                        const { removedUser } = await axios.put(`/api/admin/remove-user/${instructor.email}`);
                    } catch (error) {
                        console.log(error)
                    }

                    //set the instructor to inactive
                    try {
                        const { data } = await axios.put(`/api/admin/inactive-instructor/${instructor.email}`)
                    } catch (error) {

                    }

                    //when all request are completed
                    toast.success("Instructor record deleted")
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
                    <div className="admin-list-of-instructors-banner-bg">
                        <h1 className="">List of Instructor</h1>
                    </div>
                    <div className="container-fluid mr-3">
                        <Space style={{ marginBottom: 16 }}>
                            <Button
                                icon={<UserAddOutlined />}
                                style={{ marginRight: 8 }}
                                onClick={() => { router.push("/admin/manage-instructors/add-instructor") }}
                            >
                                Add Instructor
                            </Button>
                        </Space>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={() => { router.reload("/admin/manage-instructors/list-instructor") }}>Clear filters and sorters</Button>
                        </Space>
                        <Card
                            bordered={false}
                            className="circlebox tablespace mb-24"
                            extra={
                                <>
                                    <Radio.Group defaultValue="active" buttonStyle="solid">
                                        <Radio.Button onClick={() => setDataSource(activeInstructors)} value="active">Active</Radio.Button>
                                        <Radio.Button onClick={() => setDataSource(inactiveInstructors)} value="inactive">Inactive</Radio.Button>
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
                                    if (inactiveInstructors.includes(record))
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

export default InstructorList;