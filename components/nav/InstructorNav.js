import { useState, useEffect } from 'react'
import { Menu, Space, Divider } from 'antd';
import Link from "next/link";
import {
    DesktopOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined,
    BookOutlined,
    SnippetsOutlined,
    MessageOutlined,
    UserOutlined
} from '@ant-design/icons';

const { SubMenu, Item } = Menu;

const InstructorNav = () => {
    const [current, setCurrent] = useState("");

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
        <div className="nav flex-column nav-pills">
            <Space size={30} direction="vertical">
                <div>
                    <Divider orientation="left" plain>Instructor Pages</Divider>
                    <Menu
                        // defaultOpenKeys={['/instructor/list-course']}
                        mode="vertical"
                        selectedKeys={[current]}
                    >
                        {/* Dashboard */}
                        <Item
                            key="/instructor"
                            icon={<DesktopOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/instructor">
                                <a>Dashboard</a>
                            </Link>
                        </Item>

                        {/* List of Students */}
                        <Item
                            key="/instructor/list-student"
                            icon={<UnorderedListOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/instructor/list-student">
                                <a>List of Students</a>
                            </Link>
                        </Item>


                        {/* Manage Courses */}
                        <SubMenu
                            key="course"
                            icon={<BookOutlined />}
                            title="Manage Courses"
                        >
                            {/* List of Courses */}
                            <Item
                                key="/instructor/list-course"
                                icon={<UnorderedListOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/instructor/list-course">
                                    <a>List of Courses</a>
                                </Link>
                            </Item>

                            {/* Add Courses */}
                            <Item
                                key="/instructor/course/create"
                                icon={<PlusCircleOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/instructor/course/create">
                                    <a>Create Course</a>
                                </Link>
                            </Item>

                        </SubMenu>

                        {/* Activities */}
                        <Item
                            key="/instructor/list-activity"
                            icon={<SnippetsOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/instructor/list-activity">
                                <a>Manage Activities</a>
                            </Link>
                        </Item>
                    </Menu>
                </div>
                <div>
                    <Divider orientation="left" plain>User Pages</Divider>
                    <Menu
                        // defaultOpenKeys={['/admin/manage-students/list-student', '/admin/manage-instructors/list-instructor']}
                        mode="vertical"
                        selectedKeys={[current]}
                    >
                        {/* Messages */}
                        <Item
                            key="/messages"
                            icon={<MessageOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/messages">
                                <a>Messages</a>
                            </Link>
                        </Item>

                        <Item
                            key="/instructor/profile"
                            icon={<UserOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/instructor/profile">
                                <a>Profile</a>
                            </Link>
                        </Item>
                    </Menu>
                </div>
            </Space>

        </div >
    )
}
export default InstructorNav;