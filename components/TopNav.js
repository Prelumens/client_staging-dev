import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserAddOutlined,
    CoffeeOutlined,
    CarryOutOutlined,
    TeamOutlined,
    DesktopOutlined,
    UserOutlined,
    SettingOutlined,
    MessageOutlined,
    HomeOutlined
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [visible, setVisible] = useState(false);
    const showMessagesDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const [current, setCurrent] = useState("");

    const { state, dispatch } = useContext(Context);

    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem("user");
        const { data } = await axios.get("/api/logout");
        toast(data.message);
        router.push("/");
    };

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[current]}
            style={{ flexDirection: 'row' }}
            className="mb-2"
        >


            {user === null && (
                <>
                    <Item
                        className="float-left"
                        key="/"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<AppstoreOutlined />}
                    >
                        <Link href="/">
                            <a>Prelumens</a>
                        </Link>
                    </Item>
                </>
            )}


            {user !== null && (
                <>
                    <SubMenu
                        key="submenu"
                        style={{ marginLeft: 'auto' }}
                        icon={<CoffeeOutlined />}
                        title={user && user.name}
                    >
                        <ItemGroup>
                            {user.role && user.role.includes("Student") &&
                                <Item
                                    key="/user"
                                    icon={<DesktopOutlined />}
                                >
                                    <Link href="/user">
                                        <a>Dashboard</a>
                                    </Link>
                                </Item>
                            }

                            {user.role && user.role.includes("Instructor") &&
                                <Item
                                    key="/instructor"
                                    icon={<DesktopOutlined />}
                                >
                                    <Link href="/instructor">
                                        <a>Dashboard</a>
                                    </Link>
                                </Item>
                            }

                            {user.role && user.role.includes("Admin") &&
                                <Item
                                    key="/admin"
                                    icon={<DesktopOutlined />}
                                >
                                    <Link href="/admin">
                                        <a>Dashboard</a>
                                    </Link>
                                </Item>
                            }

                            <Item
                                onClick={logout}
                                icon={<LogoutOutlined />}
                            >
                                Logout
                            </Item>
                        </ItemGroup>
                    </SubMenu>
                </>

            )}


        </Menu>
    );
};

export default TopNav;