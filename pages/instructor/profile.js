import InstructorRoute from "../../components/routes/InstructorRoute";
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


const InstructorProfile = () => {

    const [instructor, setInstructor] = useState({});
    const [loading, setLoading] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false)

    //for edit profile
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState({})

    const [loadingButton, setLoadingButton] = useState(false)

    // router
    const router = useRouter();

    useEffect(() => {
        document.title = "Profile"
        loadInstructor()
    }, [])

    const loadInstructor = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/instructor/profile");
            console.log('profile', data);
            if (data) {
                setInstructor(data)
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

        //update user information in User Collection
        try {
            const { data } = await axios.put(`/api/instructor/edit-profile-user`, {
                address,
                contact,
                email,
                password,
                image
            });
        } catch (error) {
            console.log(error)
        }


        //update student information in Student Colection
        try {
            const { data } = await axios.put(`/api/instructor/edit-profile-instructor`, {
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
        <InstructorRoute>
            <Card
                loading={loading}
                className="card-profile-head"
                bodyStyle={{ display: "none" }}
                title={loading ?
                    <Skeleton avatar paragraph={{ rows: 2 }} /> :
                    <Row justify="space-between" align="middle" gutter={[24, 0]}>
                        <Col span={24} md={12} className="col-info">
                            <Avatar.Group>
                                <Avatar size={74} shape="square" src={instructor.image? instructor.image.Location : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'} style={{ backgroundColor: '#fff' }} />

                                <div className="avatar-info">
                                    <h4 className="font-semibold m-0">{instructor.firstName} {instructor.lastName}</h4>
                                    <p>Role: Instructor</p>
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
                    <Descriptions.Item label="Email">{instructor.email}</Descriptions.Item>
                    <Descriptions.Item label="Birthdate">{instructor.birthDate}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{instructor.gender}</Descriptions.Item>
                    <Descriptions.Item label="Contact Number">{instructor.contact}</Descriptions.Item>
                    <Descriptions.Item label="Address">{instructor.address}</Descriptions.Item>
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
                    guardian=""
                    address={address}
                    contact={contact}
                    email={email}
                    password={password}
                    image={image}
                    handleChangeGuardian={() => { }}
                    handleChangeAddress={handleChangeAddress}
                    handleChangeContact={handleChangeContact}
                    handleChangeEmail={handleChangeEmail}
                    handleChangePassword={handleChangePassword}
                    handleSubmit={handleSubmit}
                    loadingButton={loadingButton}
                    handleImage={handleImage}
                    handleImageRemove={handleImageRemove}
                    isAdmin={false}
                    isInstructor={true}
                />
            </Modal>
        </InstructorRoute>
    );
};

export default InstructorProfile;
