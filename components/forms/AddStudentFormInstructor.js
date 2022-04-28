import { Table, Space, Tooltip, Tag, Input } from 'antd';
import {
    UserDeleteOutlined,
    UserAddOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AddStudentFormInstructor = ({ students, courseId }) => {
    const data = [];
    for (let i = 0; i < students.length; i++) {
        data.push({
            key: students[i].student._id,
            name: students[i].student.name,
            enrollmentStatus: students[i].enrollmentStatus
        });
    }
    console.log(data)
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
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
            title: 'Enrollment Status',
            key: 'enrollmentStatus',
            render: (data) => (
                <Space size="middle">
                    {data.enrollmentStatus ? <Tag color="success">Enrolled</Tag> : <Tag color="error">Not Enrolled</Tag>}
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (student) => (
                <Space size="middle">
                    {student.enrollmentStatus ?
                        <Tooltip title="Remove student" onClick={() => onRemoveStudent(student)}>
                            <UserDeleteOutlined style={{ fontSize: '18px' }} className="text-danger" />
                        </Tooltip >
                        :
                        <Tooltip title="Add student" onClick={() => onAddStudent(student)}>
                            <UserAddOutlined style={{ fontSize: '18px' }} className="text-success" />
                        </Tooltip >
                    }
                </Space>
            ),
        },
    ];

    //Remove student in the course
    const onRemoveStudent = async (student) => {
        // frontend magic
        student.enrollmentStatus = !student.enrollmentStatus;
        console.log("Student id => ", student.key)

        // sending data to backend
        try {
            const { removeStudent } = await axios.put(`/api/instructor/course/${courseId}/remove-student/${student.key}`)
        } catch (error) {
            console.log(error)
        }
    }

    const onAddStudent = async (student) => {
        // frontend magic
        student.enrollmentStatus = !student.enrollmentStatus;
        console.log("Student current enrollment status => ", student.enrollmentStatus)

        // sending data to backend
        try {
            const { addStudent } = await axios.put(`/api/instructor/course/${courseId}/add-student/${student.key}`)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Table columns={columns} dataSource={data} scroll={{ y: 350 }} pagination={false} />
    )
}
export default AddStudentFormInstructor;