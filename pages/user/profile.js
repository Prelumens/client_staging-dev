import UserRoute from "../../components/routes/UserRoute";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import Resizer from "react-image-file-resizer";
import {
    Row,
    Col,
    Card,
    Descriptions,
    Avatar,
    Skeleton,
    Button,
    Modal,
    message
} from "antd";
import { EditOutlined } from '@ant-design/icons';
import EditProfileForm from "../../components/forms/EditProfileForm";
import { toast } from 'react-toastify'


const UserProfile = () => {

    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false)

    //for edit profile
    const [guardian, setGuardian] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState({})

    const [loadingButton, setLoadingButton] = useState(false)
    const [oldGuardianName, setOldGuardianName] = useState()

    // router
    const router = useRouter();

    useEffect(() => {
        document.title = "Profile"
        loadStudent()
    }, [])

    const loadStudent = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/student-profile");
            console.log('profile', data);
            if (data) {
                setStudent(data)
                setGuardian(data.guardian)
                setOldGuardianName(data.guardian)
                setAddress(data.address)
                setContact(data.contact)
                setEmail(data.email)
                setPassword(data.password)
                setImage(data.image)
            };
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleChangeGuardian = (e) => {
        setGuardian(e.target.value)
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value)
    }

    const handleChangeContact = (e) => {
        setContact(e.target.value)
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async () => {
        setLoadingButton(true)
        console.log('image', image)
        console.log('handleSubmit')

        //update user information in User Collection
        try {
            const { data } = await axios.put(`/api/student/edit-profile-user`, {
                guardian,
                address,
                contact,
                email,
                password,
                image
            });
        } catch (error) {
            console.log(error)
        }

        //update student information in Student Colection and guardian name in chat engine io
        try {
            const { data } = await axios.put(`/api/student/edit-profile-student`, {
                oldGuardianName,
                guardian,
                address,
                contact,
                email,
                password,
                image
            });
        } catch (error) {
            console.log(error)
        }

        setLoadingButton(false)
        setShowEditProfileModal(false)
        toast.success('Profile Updated Successfully!')
        window.location.reload()
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
    return (
        <UserRoute>
            <Card
                loading={loading}
                bordere={false}
                className="card-profile-head mb-4"
                bodyStyle={{ display: "none" }}
                title={loading ?
                    <Skeleton avatar paragraph={{ rows: 2 }} /> :
                    <Row justify="space-between" align="middle" gutter={[24, 0]}>
                        <Col span={24} md={12} className="col-info">
                            <Avatar.Group>
                                <Avatar size={74} shape="square" src={student.image? student.image.Location : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'} style={{ backgroundColor: '#fff' }} />

                                <div className="avatar-info">
                                    <h4 className="font-semibold m-0">{student.firstName} {student.lastName}</h4>
                                    <p>{student.studentNum}</p>
                                    <p>Role: Student</p>
                                </div>
                            </Avatar.Group>
                        </Col>
                        <Col
                            span={24}
                            md={12}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onClick={() => { setShowEditProfileModal(true) }}
                                icon={<EditOutlined />}
                                size="large"
                                className="float-right m-3 text-muted"
                            >
                                Edit Profile
                            </Button>
                        </Col>
                    </Row>
                }
            ></Card>

            <Card
                loading={loading}
                bordered={false}
                title={<h6 className="font-semibold m-0">Profile Information</h6>}
                className="header-solid h-full card-profile-information"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
            >
                <hr className="my-25" />
                <Descriptions column={2}>
                    <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                    <Descriptions.Item label="Birthdate">{student.birthDate}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{student.gender}</Descriptions.Item>
                    <Descriptions.Item label="Guardian">{student.guardian}</Descriptions.Item>
                    <Descriptions.Item label="Contact Number">{student.contact}</Descriptions.Item>
                    <Descriptions.Item label="Address">{student.address}</Descriptions.Item>
                </Descriptions>

            </Card>
            <Modal
                title="📄 Edit Profile"
                centered
                visible={showEditProfileModal}
                onCancel={() => setShowEditProfileModal(false)}
                footer={null}
                width={750}
            >
                <EditProfileForm
                    guardian={guardian}
                    address={address}
                    contact={contact}
                    email={email}
                    password={password}
                    image={image}
                    handleImage={handleImage}
                    handleImageRemove={handleImageRemove}
                    handleChangeGuardian={handleChangeGuardian}
                    handleChangeAddress={handleChangeAddress}
                    handleChangeContact={handleChangeContact}
                    handleChangeEmail={handleChangeEmail}
                    handleChangePassword={handleChangePassword}
                    handleSubmit={handleSubmit}
                    loadingButton={loadingButton}
                    isInstructor={false}
                    isAdmin={false}
                />
            </Modal>
        </UserRoute>
    );
};

export default UserProfile;
