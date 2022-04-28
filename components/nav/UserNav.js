import { useState, useEffect, useContext } from 'react'
import { Menu, Space, Divider, Modal, Button, Switch, Select, Form, Col, InputNumber, Tooltip } from 'antd';
import { Context } from '../../context'
import Link from "next/link";
import {
  DesktopOutlined,
  UnorderedListOutlined,
  BookOutlined,
  FormOutlined,
  MessageOutlined,
  UserOutlined,
  PushpinOutlined,
  SettingOutlined,
  ContainerOutlined,
  RobotOutlined,
  SearchOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from "next/router";


const { Item } = Menu;
const { Option } = Select;

const UserNav = ({ user }) => {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [settingsModal, setSettingsModal] = useState(false)
  const [parentMode, setParentMode] = useState(user.parentMode)
  const [screenTimeoutEnabled, setScreenTimeoutEnabled] = useState(user.screenTimeout)
  const [screenTimeout, setScreenTimeout] = useState(user.screenTimeout / 1000 / 60)
  const [showTime, setShowtime] = useState(false)

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const handleSwitchToggleParentMode = (checked) => {
    setParentMode(checked)
  }

  const handleSwitchTogglesSreenTimeoutEnabled = (checked) => {
    setScreenTimeoutEnabled(checked)
  }

  const handleSettings = () => {
    setSettingsModal(true)
  }

  const handleCancel = () => {
    setSettingsModal(false)
    setParentMode(user.parentMode)
    // window.location.reload()
  }

  const handleSubmit = async () => {
    try {
      if (!screenTimeout) {
        screenTimeout = user.screenTimeout / 1000 / 60
      }
      const { data } = await axios.put(`/api/setSettings/${user._id}`, {
        parentMode,
        screenTimeout,
        screenTimeoutEnabled
      });

    } catch (error) {
      console.log(error)
    }
    setSettingsModal(false)
    if (parentMode || parentMode == null) {
      if (current == '/user') {
        window.location.reload()
      } else {
        router.push("/user");
      }
    } else {
      router.push('/user/welcome')
    }

  }

  const handleScreenTimeout = (value) => {
    setScreenTimeout(value)
  }

  const handleMessage = async () => {
    if (user) {
      try {
        const { data } = await axios.put(`/api/student/openMessagingApp/${user._id}`)
      } catch (error) {
        console.log(error)
      }
    }

  }

  return (
    <div className="nav flex-column nav-pills">
      <Space size={30} direction="vertical">
        <div>
          {user.parentMode ?
            <Divider orientation="left" plain>Account Pages</Divider>
            :
            <Divider orientation="left" plain>Student Pages</Divider>
          }

          <Menu
            mode="inline"
            selectedKeys={[current]}
          >
            {/* Dashboard */}
            <Item
              key="/user"
              icon={<DesktopOutlined />}
              onClick={(e) => setCurrent(e.key)}
            >
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>

            {/* List of Courses */}
            {user.parentMode &&
              <Item
                key="/user/list-course"
                icon={<UnorderedListOutlined />}
                onClick={(e) => setCurrent(e.key)}
              >
                <Link href="/user/list-course">
                  <a>List of Courses</a>
                </Link>
              </Item>
            }

            {/* sa parent list lang ng course di clickable */}
            {user.parentMode == false &&
              <Item
                key="/user/enrolled-courses"
                icon={<BookOutlined />}
                onClick={(e) => setCurrent(e.key)}
              >
                <Link href="/user/enrolled-courses">
                  <a>My Courses</a>
                </Link>
              </Item>
            }


            {/* Enrolled Courses*/}
            {user.parentMode == false &&
              <>
                <Item
                  key="/user/list-activity"
                  icon={<PushpinOutlined />}
                  onClick={(e) => setCurrent(e.key)}
                >
                  <Link href="/user/list-activity">
                    <a>To-do</a>
                  </Link>
                </Item>
              </>
            }

            {user.parentMode &&
              <Item
                key="student-activity"
                icon={<ContainerOutlined />}
                onClick={(e) => setCurrent(e.key)}
              >
                <Link href="/user/student-activity">
                  <a>Activity Log</a>
                </Link>
              </Item>
            }
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
            {user.parentMode ?
              <Item
                key="/messages-guardian"
                icon={<MessageOutlined />}
                onClick={(e) => setCurrent(e.key)}
              >
                <Link href="/messages-guardian">
                  <a>Messages</a>
                </Link>
              </Item>
              :
              <Item
                key="/messages"
                icon={<MessageOutlined />}
                onClick={handleMessage}
              >
                <Link href="/messages">
                  <a>Messages</a>
                </Link>
              </Item>
            }


            {user.parentMode &&
              <Item
                key="/user/profile"
                icon={<UserOutlined />}
                onClick={(e) => setCurrent(e.key)}
              >
                <Link href="/user/profile">
                  <a>Profile</a>
                </Link>
              </Item>
            }

            <Item
              key='settings'
              icon={<SettingOutlined />}
              onClick={handleSettings}
            >
              Settings
              {/* <Link href="/user/profile">
                <a>Profile</a>
              </Link> */}
            </Item>
          </Menu>
        </div>

      </Space>

      <Modal
        title="⚙ Settings"
        centered
        visible={settingsModal}
        onCancel={handleCancel}
        onClose={handleCancel}
        footer={
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Save
          </Button>
        }
        width='500px'
      >
        <div>
          {/* Parent Mode */}
          <p>Parent Mode : &nbsp; &nbsp;
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              defaultChecked={user.parentMode}
              onChange={handleSwitchToggleParentMode}
            />

          </p>

          {/* Screen Time Out Enabled */}
          {user.parentMode &&
            <>
              <p>Screen Time Out : &nbsp;
                <Tooltip title={showTime ? "Hide time" : "Show Time"} className='mr-1'>
                  <Button type={showTime && "primary"} size="small" shape="circle" icon={<ClockCircleOutlined onClick={() => { setShowtime(!showTime) }} />} />
                </Tooltip>
                <Switch
                  className='mr-1'
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  defaultChecked={user.screenTimeoutEnabled}
                  onChange={handleSwitchTogglesSreenTimeoutEnabled}
                />
              </p>

              {/* Screen Time */}
              {showTime &&
                <>
                  <p>Time (60 - 120) : &nbsp;
                    <InputNumber
                      style={{ width: '15%' }}
                      className='mr-2'
                      min={60}
                      max={120}
                      defaultValue={user.screenTimeout / 1000 / 60}
                      onChange={handleScreenTimeout}
                    // disabled
                    />
                    minutes
                  </p>

                </>
              }
            </>
          }
        </div>
      </Modal >
    </div >
  )
}
export default UserNav;
