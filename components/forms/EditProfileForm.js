import {
    Button,
    Badge,
    Row,
    Col,
    Upload,
    Space,
    Avatar,
    List,
    Divider,
    Form,
    Input,
    Tooltip,
    message
} from "antd";
import {
    CloseCircleOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    LockOutlined,
    HomeOutlined,
    IdcardOutlined
} from '@ant-design/icons'
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
const EditProfileForm = ({
    name,
    username,
    guardian,
    address,
    contact,
    email,
    password,
    image,

    handleChangeGuardian,
    handleChangeAddress,
    handleChangeContact,
    handleChangeEmail,
    handleChangePassword,
    handleImageRemove,
    handleImage,

    handleSubmit,
    loadingButton,

    isInstructor,
    isAdmin
}) => {
    const [buttonDisabled, setButtonDisbled] = useState(true)
    const [form] = Form.useForm();
    const onFinishFailed = () => {
        message.error('Submit failed. Please fill all required fields.');
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be atleast ${11} numbers.',
        },
    };

    useEffect(() => {
        form.setFieldsValue({
            Name:name,
            username:username,
            Guardian:guardian,
            Address:address,
            Contact:contact,
            Email:email,
            Password:password,

        })
    }, []);
    return (
        <div className="container">
            {/* <pre>{JSON.stringify(image, null, 4)}</pre> */}
            <Form
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
                form={form}
            >
                <Row gutter={[36, 16]}>
                    <Col span={12}>

                        <Divider orientation="left" orientationMargin="0" className="text-muted">
                            Basic Information
                        </Divider>

                        {/* guardian */}

                        {isAdmin &&
                            <>
                                <Form.Item
                                    name="Name"
                                    className="mt-0"
                                >
                                    <Input
                                        name="Name"
                                        prefix={
                                            <Tooltip title="Admin Name">
                                                <UserOutlined className="mr-2" />
                                            </Tooltip>
                                        }
                                        size="large"
                                        defaultValue={name}
                                        value={name}
                                        disabled
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="username"
                                    className="mt-0"
                                >
                                    <Input
                                        name="name"
                                        prefix={
                                            <Tooltip title="Admin Username">
                                                <IdcardOutlined className="mr-2" />
                                            </Tooltip>
                                        }
                                        size="large"
                                        defaultValue={username}
                                        value={username}
                                        disabled
                                    />
                                </Form.Item>

                                <Divider orientation="left" orientationMargin="0" className="text-muted">
                                    Update Information
                                </Divider>
                            </>
                        }

                        {isInstructor == false && isAdmin == false &&
                            <Form.Item
                                name="Guardian"
                                className="mt-0"
                                rules={[{
                                    required: true, message: 'Please input guardian name'
                                }]}
                            >
                                <Input
                                    name="Guardian"
                                    prefix={
                                        <Tooltip title="Guardian Name">
                                            <UserOutlined className="mr-2" />
                                        </Tooltip>
                                    }
                                    size="large"
                                    placeholder="Enter guardian full name"
                                    defaultValue={guardian}
                                    value={guardian}
                                    onChange={handleChangeGuardian}
                                />
                            </Form.Item>
                        }

                        {/* address */}
                        {isAdmin == false &&
                            <Form.Item
                                name="Address"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    name="Address"
                                    prefix={
                                        <Tooltip title="Residential Address">
                                            <HomeOutlined className="mr-2" />
                                        </Tooltip>
                                    }
                                    size="large"
                                    placeholder="Enter residential address"
                                    defaultValue={address}
                                    value={address}
                                    onChange={handleChangeAddress}
                                />
                            </Form.Item>
                        }

                        {/* contact number */}
                        {isAdmin == false &&
                            <Form.Item
                                name="Contact"
                                className="mt-0"
                                rules={[{ required: true }, { message: 'Please input a valid contact number', pattern: new RegExp(/^\+?\d+$/) }]}
                            >
                                <Input
                                    prefix={
                                        <Tooltip title="Contact Number">
                                            <PhoneOutlined className="mr-2" />
                                        </Tooltip>
                                    }
                                    className="mt-0"
                                    size="large"
                                    name="Contact"
                                    placeholder="Enter contact number"
                                    defaultValue={contact}
                                    value={contact}
                                    onChange={handleChangeContact}
                                />
                            </Form.Item>
                        }


                        {/* email */}
                        <Form.Item
                            name="Email"
                            className="mt-0"
                            rules={[{ required: true }, { type: 'email' }]}
                        >
                            <Input
                                prefix={
                                    <Tooltip title="Email">
                                        <MailOutlined className="mr-2" />
                                    </Tooltip>
                                }
                                className="mt-0"
                                size="large"
                                name="email"
                                placeholder="Enter email address"
                                defaultValue={email}
                                value={email}
                                onChange={handleChangeEmail}
                            />
                        </Form.Item>

                        {/* password */}
                        <Form.Item
                            name="Password"
                            className="mt-0"
                            rules={[{
                                required: true, message: 'Password must include atleast 8 alphanumeric characters',
                                pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
                            }]}
                        >
                            <Input.Password
                                prefix={
                                    <Tooltip title="Password">
                                        <LockOutlined className="mr-2" />
                                    </Tooltip>
                                }
                                size="large"
                                name="Password"
                                placeholder="Enter password"
                                defaultValue={password}
                                value={password}
                                onChange={handleChangePassword}
                            />
                        </Form.Item>

                    </Col>

                    <Col span={12}>
                        <Divider orientation="left" orientationMargin="0" className="text-muted">
                            Profile Picture
                        </Divider>

                        {/* temporary */}
                        <div className="text-center">
                            {image && image.Location ?
                                <Badge count={<CloseCircleOutlined style={{ color: '#f5222d' }} />} onClick={handleImageRemove} className="pointer">
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="form-group text-center">
                                                <label htmlFor="photo-upload" className="btn btn-primary btn-sm text-left custom-file-upload fas" style={{borderRadius: '50%', padding: '6px'}}>
                                                    <div className="img-wrap img-upload-update" style={{ width: isInstructor ? '180px' : '250px', height: isInstructor ? '180px' : '250px' }}>
                                                        <Avatar size={isInstructor ? 180 : 250} src={image.Location} />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </Badge>
                                :
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-group text-center">
                                            <label htmlFor="photo-upload" className="btn btn-primary btn-sm text-left custom-file-upload fas">
                                                <div className="img-wrap img-upload-update" style={{ width: isInstructor ? '180px' : '250px', height: isInstructor ? '180px' : '250px' }}>
                                                    <img for="photo-upload" src='https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true' />
                                                </div>
                                                <input
                                                    id="photo-upload"
                                                    type="file"
                                                    name="image"
                                                    onChange={handleImage}
                                                    accept="image/*"
                                                    hidden
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                    </Col>
                </Row>
                <Button
                    className="col"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    disabled={loadingButton}
                    loading={loadingButton}
                    // onClick={handleSubmit}
                >
                    {loadingButton ? "Saving..." : "Save"}
                </Button>
            </Form>
        </div >
    );
};

export default EditProfileForm;
