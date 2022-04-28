import { Form, Input, Row, Col, DatePicker, Select, Divider, Button, Avatar, Badge, Typography, message } from 'antd';
import moment from 'moment';
import { useState, useEffect } from "react";
import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const { Option } = Select;
const { Text } = Typography;
import { useForm } from 'react-hook-form';
const AdminRegForm = ({
    adminId,
    username,
    name,
    loading,
    email,
    password,
    handleSubmit,
    setName,
    setEmail,
    setPassword,
    editPage,
    handleImage,
    preview,
    handleImageRemove,
}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            name: name,
            email: email,

        })
    }, [name, email]);
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
    const dateFormat = 'YYYY-MM-DD';
    if (!editPage) {
        username = adminId;
    }
    return (
        <>
            {editPage ?
                (
                    <p style={{ fontSize: '15px' }}>
                        Username:
                        <Text
                            copyable
                            code
                            level={1}
                            style={{ fontSize: '20px' }}
                        >{`${username}`}
                        </Text>
                    </p>
                ) : (
                    <p style={{ fontSize: '15px' }}>
                        Username:
                        <Text
                            copyable
                            code
                            level={1}
                            style={{ fontSize: '20px' }}
                        >{`${adminId}`}
                        </Text>
                    </p>

                )
            }
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                labelWrap
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
                form={form}
            >
                {!preview ?
                    (<div className="form-row">
                        <div className="col">
                            <div className="form-group text-center">
                                <label htmlFor="photo-upload" className="btn btn-primary btn-sm text-left custom-file-upload fas">
                                    <div className="img-wrap img-upload" >
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
                    ) :
                    (
                        < div className="text-center">
                            <Badge count={<CloseCircleOutlined style={{ color: '#f5222d' }} />} onClick={handleImageRemove} className="pointer">
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-group text-center">
                                            <label htmlFor="photo-upload" className="btn btn-primary btn-sm text-left custom-file-upload fas">
                                                <div className="img-wrap img-upload" >
                                                    <Avatar size={100} src={preview} />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Badge>
                        </div>
                    )
                }
                <div className="form-container pl-4 pr-4">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input name="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} defaultValue={name} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }, { type: 'email' }]}
                    >
                        <Input name="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} defaultValue={email} />
                    </Form.Item>

                    {!editPage &&
                        <Form.Item name="password" label="Password" rules={[{ required: true }, { message: 'Password must include atleast 8 alphanumeric characters', pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) }]} disabled>
                            <Input.Password name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} defaultValue={password} />
                        </Form.Item>
                    }
                </div>
                <br />

                <div className="row">
                    <div className="col">
                        <Button
                            htmlType="submit"
                            disabled={loading}
                            className="btn btn-primary float-right m-3"
                            loading={loading}
                            type="primary"
                            size="large"
                            shape="round"
                        >
                            {loading ? "Saving..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    )
};
export default AdminRegForm;