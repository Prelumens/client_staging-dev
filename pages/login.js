import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from "../context";
import { useRouter } from 'next/router'
import TermsAndCondition from "../components/modal/TermsAndCondition";

import {
    Typography,
    Layout,
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal
} from "antd";

const Login = ({ courses }) => {
    const { Title } = Typography;
    const { Content } = Layout;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [termsAndConditionModal, setTermsAndConditionModal] = useState(false)

    useEffect(() => {
        document.title = "Prelumens"
    }, []);
    //state
    const {
        state: { user },
        dispatch
    } = useContext(Context);

    //router
    const router = useRouter();

    //allow no access to login page once logged in
    useEffect(() => {
        if (user !== null) {
            if (user.role && user.role.includes("Instructor")) {
                router.push("/instructor")
            } else if (user.role && user.role.includes("Admin")) {
                router.push("/admin")
            } else {
                router.push("/user")
            }
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.table({ name, email, password });
        try {
            setLoading(true)
            const { data } = await axios.post(`api/login`, {
                email,
                password
            });

            if (data.agreedToTermsAndCondition == false) {
                setTermsAndConditionModal(true)
            } else {
                dispatch({
                    type: "LOGIN",
                    payload: data,
                })

                //save in local storage
                window.localStorage.setItem('user', JSON.stringify(data))

                // redirect
                if (data.role && data.role.includes("Instructor")) {
                    router.push("/instructor")
                } else if (data.role && data.role.includes("Admin")) {
                    router.push("/admin")
                } else {
                    router.push("/user")
                }
            }
        } catch (err) {
            toast.error(err.response.data)
            setLoading(false)
        }
    };

    const handleShowPassword = () => {
        var password = document.getElementById("password")
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        }
    }

    const handleAgree = async () => {
        setTermsAndConditionModal(false)

        // if the user agree to terms and CSSConditionRule, the user can now login
        try {
            setLoading(true)
            const { data } = await axios.post(`api/login`, {
                email,
                password
            });
            updatedUser(data)
            console.log('LOGIN RESPONSE', data)
            dispatch({
                type: "LOGIN",
                payload: data,
            })

            //save in local storage
            window.localStorage.setItem('user', JSON.stringify(data))

            // redirect
            if (data.role && data.role.includes("Instructor")) {
                router.push("/instructor")
            } else if (data.role && data.role.includes("Admin")) {
                router.push("/admin")
            } else {
                router.push("/user")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDisagree = () => {
        setTermsAndConditionModal(false)
        setEmail("")
        setPassword("")
        setLoading(false)
    }

    const updatedUser = async (userToLoggedIn) => {
        try {
            const { data } = await axios.put(`api/terms-and-condition/${userToLoggedIn._id}`);
        } catch (error) {
            console.log("Update user failed")
        }
    }

    return (
        <>
            <div className="layout-default ant-layout layout-landing">
                <div className="landing-page">
                    <div className="content" style={{backgroundColor:'transparent'}}>
                        <div className="landing-text-wrap">
                            <div className="landing-text">
                                <h1 className="hero-title ff-inter">Preschool Learning Management System</h1>
                                <p className="hero-description">
                                    <em className="hero-description">Bringing light to the minds of the future generation...</em>
                                </p>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="landing-img">
                                <img src="images/kid1.png" alt="kid1" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="log-in-wrapper">
                    <Content className="signin">
                        <Row gutter={[24, 0]} justify="space-around">
                            <Col
                            // xs={{ span: 24, offset: 0 }}
                            // lg={{ span: 6, offset: 2 }}
                            // md={{ span: 12 }}
                            >
                            </Col>
                            <Col
                                xs={{ span: 24, offset: 0 }}
                                lg={{ span: 6, offset: 2 }}
                                md={{ span: 12 }}
                                className="signin-form"
                            >
                                <Title className="mb-15">Sign In</Title>
                                <Title className="font-regular text-muted" level={5}>
                                    Enter your credentials to sign in
                                </Title>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        name="email"
                                        type="text"
                                        className="login-input form-control mb-4 p-4"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email/username"
                                        required
                                    />
                                    <input
                                        name="password"
                                        id="password"
                                        type="password"
                                        className="login-input form-control mb-2 p-4"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />

                                    <input
                                        className="mb-4 p-4 ml-2"
                                        name="show password"
                                        type="checkbox"
                                        onClick={handleShowPassword}
                                    />  Show Password

                                    <button
                                        type="submit"
                                        className="btn btn-block btn-primary"
                                        disabled={!email || !password || loading}
                                    >
                                        {loading ? <SyncOutlined spin /> : "Submit"}
                                    </button>
                                </form>

                                <p className="text-center">
                                    <Link href="/forgot-password">
                                        <a className="text-danger">Forgot password</a>
                                    </Link>
                                </p>
                            </Col>
                        </Row>
                    </Content>
                </div>

                {/* modal for terms and condition */}
                <Modal
                    title="ℹ Terms and Condition"
                    centered
                    visible={termsAndConditionModal}
                    footer={[
                        <Button key="submit" type="secondary" onClick={handleDisagree}>
                            No
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleAgree}>
                            Yes
                        </Button>
                    ]}
                    width='1000px'
                >
                    <TermsAndCondition />
                </Modal>
            </div>
        </>
    );
};


export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.API}/courses`);
    return {
        props: {
            courses: data
        },
    };
}

export default Login;