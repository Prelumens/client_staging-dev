import { useEffect, useState } from "react";
import AdminRoute from "../../../components/routes/AdminRoute";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import { Table, Space, Tooltip, Modal, Input, Button, Descriptions, Radio, Card, Tag } from 'antd';
import {
    ArrowsAltOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

const AdminList = () => {
    const [activeAdmin, setActiveAdmin] = useState([])
    const [inactiveAdmin, setInactiveAdmin] = useState([])
    const [dataSource, setDataSource] = useState([]);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6)

    const router = useRouter()

    useEffect(() => {
        document.title = "List of Admins"
        loadAdmin()
    }, []);


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Enter Name"
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
                return record.name.toLowerCase().includes(value.toLowerCase())
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: "TYPE",
            key: "type",
            render: (admin) => (
                <div>
                    {admin?.role?.includes('Chief') ? (
                        <Tag color="green">
                            Chief Administrator
                        </Tag>
                    ) : (
                        <Tag color="volcano">
                            Administrator
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (admin) => (
                <Space size="middle">
                    <Tooltip
                        title={activeAdmin.includes(admin) ? "Edit" : "Disabled"}
                        onClick={() => { activeAdmin.includes(admin) && onEdit(admin) }}
                    >
                        <EditOutlined style={{ fontSize: '18px' }} className={activeAdmin.includes(admin) ? "text-warning" : "text-muted"} />
                    </Tooltip>
                    <Tooltip
                        title={activeAdmin.includes(admin) ? "Delete" : "Disabled"}
                        onClick={() => { activeAdmin.includes(admin) && onDelete(admin) }}
                    >
                        <DeleteOutlined style={{ fontSize: '18px' }} className={activeAdmin.includes(admin) ? "text-danger" : "text-muted"} />
                    </Tooltip>
                </Space >
            ),
        },
    ]
    //Edit action
    const onEdit = (admin) => {
        const slug = admin.email
        router.push(`/admin/manage-admin/edit/${slug}`)
    }
    // Delete Action
    const onDelete = (admin) => {
        try {
            Modal.confirm({
                title: 'Are you sure you want to delete this admin record?',
                onOk: async () => {
                    try {
                        const { removedUser } = await axios.put(`/api/admin/remove-user/${admin.email}`);
                    } catch (error) {
                        console.log(error)
                    }

                    //set the admin to inactive
                    try {
                        const { data } = await axios.put(`/api/admin/inactive-admin/${admin.email}`)
                    } catch (error) {
                        console.log(error)
                    }
                    //when all request are completed
                    toast.success("Admin record deleted")
                    window.location.reload()
                }
            })
        } catch (err) {
            toast.error(err.response.data)
        }
    }
    const loadAdmin = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/admin/list-admin");
            console.log(data)
            setActiveAdmin(data.active);
            setInactiveAdmin(data.inactive)
            setDataSource([...data.active])
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    return (
        <AdminRoute>
            {/* <pre>{JSON.stringify(activeAdmin, null, 4)}</pre>
            <pre>{JSON.stringify(inactiveAdmin, null, 4)}</pre> */}
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="admin-list-of-instructors-banner-bg">
                        <h1 className="">List of Admins</h1>
                    </div>
                    <div className="container-fluid mr-3">
                        <Space style={{ marginBottom: 16 }}>
                            <Button
                                icon={<UserAddOutlined />}
                                style={{ marginRight: 8 }}
                                onClick={() => { router.push("/admin/manage-admin/add-admin") }}
                            >
                                Add Admin
                            </Button>
                        </Space>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={() => { router.reload("/admin/manage-admin/list-admin") }}>Clear filters and sorters</Button>
                        </Space>
                        <Card
                            bordered={false}
                            className="circlebox tablespace mb-24"
                            extra={
                                <>
                                    <Radio.Group defaultValue="active" buttonStyle="solid">
                                        <Radio.Button onClick={() => setDataSource(activeAdmin)} value="active">Active</Radio.Button>
                                        <Radio.Button onClick={() => setDataSource(inactiveAdmin)} value="inactive">Inactive</Radio.Button>
                                    </Radio.Group>
                                </>
                            }
                        >
                            <Table
                                className="p-2"
                                loading={loading}
                                columns={columns}
                                dataSource={dataSource.sort((a, b) => a.name.localeCompare(b.name))}
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
        </AdminRoute>
    );
};

export default AdminList;