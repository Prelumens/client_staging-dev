import AdminRoute from "../../components/routes/AdminRoute"
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import {
    Row,
    Col,
    Card,
    Descriptions,
    Avatar
} from "antd";

const AdminProfile = () => {

    const [admin, setAdmin] = useState([]);
    const [loading, setLoading] = useState(false);
    // router
    const router = useRouter();

    useEffect(() => {
        document.title="Profile"
        loadAdmin()
    }, [])

    const loadAdmin = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/admin/profile");
            console.log(data);
            if (data) setAdmin(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    return (
        <AdminRoute>
            {admin &&
                <>
                    <Card
                        loading={loading}
                        className="card-profile-head"
                        bodyStyle={{ display: "none" }}
                        title={
                            <Row justify="space-between" align="middle" gutter={[24, 0]}>
                                <Col span={24} md={12} className="col-info">
                                    <Avatar.Group>
                                        <Avatar size={74} shape="square" src='https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true' />

                                        <div className="avatar-info">
                                            <h4 className="font-semibold m-0">{admin.name}</h4>
                                            <p>{admin.username}</p>
                                            <p>{admin.email}</p>
                                            <p>Role: Admin</p>
                                        </div>
                                    </Avatar.Group>
                                </Col>
                                <Col
                                    span={24}
                                    md={12}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                </Col>
                            </Row>
                        }
                    ></Card>
                </>
            }

        </AdminRoute>
    );
};

export default AdminProfile;
