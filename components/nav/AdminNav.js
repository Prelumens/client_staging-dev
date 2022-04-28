import { useState, useEffect, useContext } from 'react'
import { Menu, Divider, Space, Modal, message } from 'antd';
import Link from "next/link";
import {
    DesktopOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined,
    UserOutlined,
    IdcardOutlined,
    BookOutlined,
    MessageOutlined,
    PushpinOutlined,
    SettingOutlined,
    LogoutOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import EditProfileForm from '../forms/EditProfileForm';
import axios from "axios"
import Resizer from "react-image-file-resizer";
import { toast } from 'react-toastify'
import { Context } from "../../context";

const { SubMenu, Item } = Menu;

const AdminNav = () => {
    const [loading, setLoading] = useState(false)
    const [current, setCurrent] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false)

    //for edit profile
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState({})

    const [loadingButton, setLoadingButton] = useState(false)
    const { state, dispatch } = useContext(Context);

    const { user } = state;
    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    useEffect(() => {
        loadAdmin()
    }, [])

    const loadAdmin = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/admin/profile");
            console.log("LOAD ADMIN => ", data);
            // if (data) setAdmin(data);
            setName(data.name)
            setUsername(data.username)
            setEmail(data.email)
            setPassword(data.password)
            setImage(data.picture)
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleOpenProfile = () => {
        setShowProfileModal(true)
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleImage = (e) => {
        let file = e.target.files[0];

        //resize
        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
            try {
                let { data } = await axios.post('/api/s3/upload', {
                    image: uri,
                    folder: 'users'
                });
                console.log('IMAGE UPLOADED', data)
                //set image in the state, set loading to false
                setImage(data)
            } catch (err) {
                console.log(err)
                toast('Image upload failed. Try later')
            }
        })
    };

    const handleImageRemove = async () => {
        message.success("Image removed.")
        try {
            // const res = await axios.post('/api/admin/remove-image', { image })
            setImage({})
        } catch (err) {
            console.log(err)
            toast('Image remove failed. Try later')
        }
    }

    const handleSubmit = async () => {
        setLoadingButton(true)

        //update user information in User Collection
        try {
            const { data } = await axios.put(`/api/admin/edit-profile-user`, {
                email,
                password,
                image
            });
        } catch (error) {
            console.log(error)
        }

        //update student information in Student Colection
        try {
            const { data } = await axios.put(`/api/admin/edit-profile-admin`, {
                email,
                password,
                image
            });
        } catch (error) {
            console.log(error)
        }

        setLoadingButton(false)
        setShowProfileModal(false)
        toast.success('Profile Updated Successfully!')
        window.location.reload()
    }


    return (
        <div className="nav flex-column nav-pills">
            <Space size={30} direction="vertical">
                <div>
                    <Divider orientation="left" plain>Admin Pages</Divider>
                    <Menu
                        // defaultOpenKeys={['/admin/manage-students/list-student', '/admin/manage-instructors/list-instructor']}
                        mode="vertical"
                        selectedKeys={[current]}
                    >
                        <Item
                            key="/admin"
                            icon={<DesktopOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/admin">
                                <a>Dashboard</a>
                            </Link>
                        </Item>

                        {/* Manage Admin */}
                        {user?.role.includes('Chief') &&
                            <SubMenu SubMenu
                                key="manage-admin"
                                icon={<SolutionOutlined />}
                                title="Manage Admins"
                            >
                                {/* List of Admin */}
                                <Item
                                    key="/admin/manage-admin/list-admin"
                                    icon={<UnorderedListOutlined />}
                                    onClick={(e) => setCurrent(e.key)}
                                >
                                    <Link href="/admin/manage-admin/list-admin">
                                        <a>List of Admins</a>
                                    </Link>
                                </Item>

                                {/* Add Admin */}
                                <Item
                                    key="/admin/manage-admin/add-admin"
                                    icon={<PlusCircleOutlined />}
                                    onClick={(e) => setCurrent(e.key)}
                                >
                                    <Link href="/admin/manage-admin/add-admin">
                                        <a>Add Admin</a>
                                    </Link>
                                </Item>

                            </SubMenu>
                        }


                        {/* Manage Students */}
                        <SubMenu SubMenu
                            key="manage-students"
                            icon={< UserOutlined />}
                            title="Manage Students"
                        >
                            {/* List of Students */}
                            <Item
                                key="/admin/manage-students/list-student"
                                icon={<UnorderedListOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/admin/manage-students/list-student">
                                    <a>List of Students</a>
                                </Link>
                            </Item>

                            {/* Add Student */}
                            <Item
                                key="/admin/manage-students/add-student"
                                icon={<PlusCircleOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/admin/manage-students/add-student">
                                    <a>Add Student</a>
                                </Link>
                            </Item>

                        </SubMenu>


                        {/* Manage Instructors */}
                        <SubMenu
                            key="manage-instructors"
                            icon={<IdcardOutlined />}
                            title="Manage Instructors"
                        >
                            {/* List of Instructors */}
                            <Item
                                key="/admin/manage-instructors/list-instructor"
                                icon={<UnorderedListOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/admin/manage-instructors/list-instructor">
                                    <a>List of Instructors</a>
                                </Link>
                            </Item>

                            {/* Add Instructor */}
                            <Item
                                key="/admin/manage-instructors/add-instructor"
                                icon={<PlusCircleOutlined />}
                                onClick={(e) => setCurrent(e.key)}
                            >
                                <Link href="/admin/manage-instructors/add-instructor">
                                    <a>Add Instructor</a>
                                </Link>
                            </Item>

                        </SubMenu>

                        {/* Manage Courses */}
                        <Item
                            key="/admin/manage-courses"
                            icon={<BookOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/admin/manage-courses">
                                <a>Manage Courses</a>
                            </Link>
                        </Item>

                        {/* Manage Activities */}
                        <Item
                            key="/admin/manage-activities"
                            icon={<PushpinOutlined />}
                            onClick={(e) => setCurrent(e.key)}
                        >
                            <Link href="/admin/manage-activities">
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

                        {user && user.role.includes('Chief') ?
                            <Item></Item>
                            :
                            <Item
                                icon={<UserOutlined />}
                                onClick={handleOpenProfile}
                            >
                                Profile
                            </Item>
                        }
                    </Menu>
                </div>
            </Space>
            <Modal
                title="Profile"
                centered
                visible={showProfileModal}
                onCancel={() => setShowProfileModal(false)}
                footer={null}
                width={750}
            >
                <EditProfileForm
                    name={name}
                    username={username}
                    email={email}
                    password={password}
                    image={image}

                    handleImage={handleImage}
                    handleImageRemove={handleImageRemove}
                    handleChangeEmail={handleChangeEmail}
                    handleChangePassword={handleChangePassword}
                    handleSubmit={handleSubmit}

                    loadingButton={loadingButton}
                    isInstructor={false}
                    isAdmin={true}
                />
            </Modal>
        </div >
    )
}
export default AdminNav;