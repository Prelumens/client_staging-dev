import { Form, Input, Row, Col, DatePicker, Select, Divider, Button, Avatar, Badge, Typography, message } from 'antd';
import moment from 'moment';
import { useState, useEffect } from "react";
import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const { Option } = Select;
const { Text } = Typography;
import { useForm } from 'react-hook-form';
import course from '../../public/course.png'
const InstructorRegForm = ({
    loading,
    handleSubmit,
    values,
    handleChange,
    setValues,
    handleImage,
    preview,
    handleImageRemove = (f) => f,
    editPage,
    instructorId
}) => {
    const [form] = Form.useForm();
    if(editPage){
        useEffect(() => {
            form.setFieldsValue({
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                birthDate: moment(values.birthDate, dateFormat),
                contact: values.contact,
                email: values.email,
                gender: values.gender,
                address: values.address,

            })
        }, [values]);
    }
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
        values.username = instructorId;
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
                        >{`${values.username}`}
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
                        >{`${instructorId}`}
                        </Text>
                    </p>

                )
            }
            {values &&
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
                        <Divider orientation="left">Personal Data</Divider>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true }]}
                                >
                                    <Input name="firstName" placeholder="Enter first name" value={values.firstName} onChange={handleChange} defaultValue={values.firstName} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="middleName" label="Middle Name">
                                    <Input name="middleName" placeholder="Enter middle name" value={values.middleName} onChange={handleChange} defaultValue={values.middleName} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                    <Input name="lastName" placeholder="Enter last name" value={values.lastName} onChange={handleChange} defaultValue={values.lastName} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="gender" label="Gender" rules={[{ required: true }]} span={8}>
                                    <Select span={8} placeholder="Select gender" onChange={(value) => { setValues({ ...values, gender: value }) }} defaultValue={values.gender}>
                                        <Option value="Female">Female</Option>
                                        <Option value="Male">Male</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {editPage &&
                                <Col className="gutter-row" span={8}>
                                    <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
                                        <Input name="email" placeholder="Enter email address" value={values.email} onChange={handleChange} defaultValue={values.email} />
                                    </Form.Item>
                                </Col>
                            }
                            {editPage ?
                                <Col className="gutter-row" span={8}>
                                    <Form.Item name="birthDate" label="Date of Birth" rules={[{ required: true }]}>
                                        <DatePicker name="birthDate" defaultValue={moment(values.birthDate, dateFormat)} onChange={(date, dateString) => { setValues({ ...values, birthDate: dateString }) }} />
                                    </Form.Item>
                                </Col>
                                :
                                <Col className="gutter-row" span={8}>
                                    <Form.Item name="birthDate" label="Date of Birth" rules={[{ required: true }]}>
                                        <DatePicker name="birthDate" onChange={(date, dateString) => { setValues({ ...values, birthDate: dateString }) }} />
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            {!editPage &&
                                <>
                                    <Col className="gutter-row" span={8}>
                                        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
                                            <Input name="email" placeholder="Enter email address" value={values.email} onChange={handleChange} defaultValue={values.email} />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                        <Form.Item name="password" label="Password" rules={[{ required: true }, { message: 'Password must include atleast 8 alphanumeric characters', pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) }]} disabled>
                                            <Input.Password name="password" placeholder="Enter password" value={values.password} onChange={handleChange} defaultValue={values.password} />
                                        </Form.Item>
                                    </Col>
                                </>
                            }
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="contact" label="Contact Number" rules={[{ required: true, message: 'Please input a valid contact number', pattern: new RegExp(/^\+?\d+$/) }]}>
                                    <Input name="contact" placeholder="Enter contact number" value={values.contact} onChange={handleChange} defaultValue={values.contact} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={16}>
                                <Form.Item name="address" label="Residential Address" rules={[{ required: true }]}>
                                    <Input name="address" placeholder="Enter complete address" value={values.address} onChange={handleChange} defaultValue={values.address} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <br />

                    <div className="row">
                        <div className="col">
                            <Button
                                htmlType="submit"
                                disabled={values.loading || values.uploading}
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
            }
        </>
    )
};
export default InstructorRegForm;