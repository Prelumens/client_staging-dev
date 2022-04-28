import { List, Avatar, Badge } from 'antd';
import {
    UserAddOutlined,
    UserDeleteOutlined,
    UserOutlined,
    FileAddOutlined,
    UnorderedListOutlined,
    FileExcelOutlined,
    FormOutlined,
    QuestionCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const NotificationModal = (notifications) => {
    const data = notifications.notifications.reverse()
    return (
        <>
            {/* <pre>{JSON.stringify(notifications, null, 4)}</pre> */}
            <div
                id="scrollableDiv"
                style={{
                    overflow: 'auto',
                }}
            >
                <List
                    className='ml-2'
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={notification => (
                        <List.Item>

                            <List.Item.Meta
                                avatar={

                                    //notification: Student Added
                                    notification.title == "Student Added" ?
                                        <Avatar
                                            style={{ backgroundColor: '#F6FFED' }}
                                            size="large"
                                            icon={<UserAddOutlined className='text-success' />}
                                        /> :

                                        //notification: Student Removed
                                        notification.title == "Student Removed" ?
                                            <Avatar
                                                style={{ backgroundColor: '#FFF2F0' }}
                                                size="large"
                                                icon={<UserDeleteOutlined className='text-danger' />}
                                            /> :

                                            notification.title == "Course Details Updated" ?
                                                <Avatar
                                                    style={{ backgroundColor: '#E6F7FF' }}
                                                    size="large"
                                                    icon={<UnorderedListOutlined className='text-info' />}
                                                /> :

                                                //notification: Lesson Added
                                                notification.title == "Lesson Added" ?
                                                    <Avatar
                                                        style={{ backgroundColor: '#F6FFED' }}
                                                        size="large"
                                                        icon={<FileAddOutlined className='text-success' />}
                                                    /> :

                                                    //notification: Lesson Removed
                                                    notification.title == "Lesson Removed" ?
                                                        <Avatar
                                                            style={{ backgroundColor: '#FFF2F0' }}
                                                            size="large"
                                                            icon={<FileExcelOutlined className='text-danger' />}
                                                        /> :

                                                        //notification: Lesson Updated
                                                        notification.title == "Lesson Updated" ?
                                                            <Avatar
                                                                style={{ backgroundColor: '#E6F7FF' }}
                                                                size="large"
                                                                icon={<FormOutlined className='text-info' />}
                                                            /> :

                                                            //notification: Course Published
                                                            notification.title == "Course Published" ?
                                                                <Avatar
                                                                    style={{ backgroundColor: '#FFFBE6' }}
                                                                    size="large"
                                                                    icon={<CheckCircleOutlined className='text-warning' />}
                                                                /> :

                                                                //notification: Course Unpublished
                                                                notification.title == "Course Unpublished" ?
                                                                    <Avatar
                                                                        style={{ backgroundColor: '#FFFBE6' }}
                                                                        size="large"
                                                                        icon={<CloseCircleOutlined className='text-warning' />}
                                                                    /> :

                                                                    //unknown notification
                                                                    <Avatar
                                                                        size="large"
                                                                        icon={<QuestionCircleOutlined />}
                                                                    />
                                }
                                title={notification.title}
                                description={notification.description}

                            />

                            <p>{notification.date} <br /> <p>{notification.time}</p></p>

                        </List.Item>
                    )}
                />
            </div>
        </>
    )
}

export default NotificationModal