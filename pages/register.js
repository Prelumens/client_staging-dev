import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from "../context";
import { useRouter } from 'next/router'

const Register = () => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false)

    //state
    const { state: { user } } = useContext(Context);
    //router
    const router = useRouter();
    //allow no access to register page once logged in
    useEffect(() => {
        if (user && user.role.includes("Instructor"))
            router.push("/")
        else if (user && user.role.includes("Subscriber"))
            router.push("/")
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //register admin to db
        try {
            setLoading(true)
            const { data } = await axios.post(`api/register`, {
                username,
                name,
                email,
                password,
            })
            toast.success('Registration successful')
            setUsername('')
            setName('');
            setEmail('');
            setPassword('');
            setLoading(false);
            setIsValid(true)
        } catch (err) {
            toast.error(err.response.data)
            setLoading(false)
        }
    };


    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Register</h1>

            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control mb-4 p-4"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                    />

                    <input
                        type="text"
                        className="form-control mb-4 p-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                    />

                    <input
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />

                    <input
                        type="password"
                        className="form-control mb-4 p-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={!name || !email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>
                <p className="text-center p-3">
                    Already registered?
                    <Link href="/login">
                        <a> Login</a>
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Register;
