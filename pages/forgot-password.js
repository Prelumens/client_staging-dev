import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'
import {
    Typography,
    Layout,
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    Image,
    Card
} from "antd";

const ForgotPassword = () => {
    const { Content } = Layout;
    const { Title } = Typography;

    //state, for user input storage
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.title = "Forgot Password"
    }, []);
    //state
    const {
        state: { user }
    } = useContext(Context);

    //router
    const router = useRouter();

    //redirect if user is logged in
    useEffect(() => {
        if (user !== null) router.push("/")
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setLoading(false)
            const { data } = await axios.post('/api/forgot-password', { email });
            setSuccess(true);
            toast('Check your email for reset code');
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault()
        // console.log(email, code, newPassword);
        // return;
        try {
            setLoading(true)
            const { data } = await axios.post('/api/reset-password', {
                email,
                code,
                newPassword
            })
            setEmail('')
            setCode('')
            setNewPassword('')
            setLoading(false)
            toast('Great! Now you can login with your new password')
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    }

    return (
        <div className='forgot-password-content'>
            <div className='forgot-password-content-card'>
                <Card
                    className="card-profile-head-forgot-password m-4"
                    bodyStyle={{ display: "none" }}
                    style={{
                        width: 500
                    }}
                    title={
                        <div>
                            <div className='m-4 text-center'>
                                <Title className="mb-40 text-center" level={2}>Forgot Password</Title>
                                <form onSubmit={success ? handleResetPassword : handleSubmit}>
                                    <input
                                        type="email"
                                        className="form-control mb-4 p-4 text-center"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email" required
                                    />
                                    {success &&
                                        <>
                                            <input
                                                type="text"
                                                className="form-control mb-4 p-4 text-center"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                placeholder="Enter secret code" required
                                            />

                                            <input
                                                type="password"
                                                className="form-control mb-4 p-4 text-center"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password" required
                                            />

                                        </>

                                    }
                                    <button className="btn btn-primary btn-block p-2" disabled={loading || !email}>
                                        {loading ? <SyncOutlined spin /> : "Submit"}
                                    </button>
                                </form>
                            </div>
                        </div>

                    }
                >
                </Card>
            </div>
        </div >
    )
}

export default ForgotPassword;