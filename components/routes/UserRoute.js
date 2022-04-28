import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { route } from "next/dist/server/router";
import { SyncOutlined } from "@ant-design/icons";
import UserNav from "../nav/UserNav";

const UserRoute = ({ children }) => {
    // state
    const [ok, setOk] = useState(false);
    const [user, setUser] = useState({})

    //router
    const router = useRouter();

    useEffect(() => {
        fetchUser();
        fetchUserForSideNav();
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/current-user");
            // console.log(data);
            if (data) setOk(true);
        } catch (err) {
            console.log(err);
            setOk(false);
            router.push("/login");
        }
    };

    const fetchUserForSideNav = async () => {
        try {
            const { data } = await axios.get("/api/current-userNavbar");
            setUser(data)
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <>
            {!ok && !user ? (
                <SyncOutlined
                    spin
                    className="d-flex justify-content-center display-1 text-primary p-5"
                />
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <UserNav user={user} />
                        </div>
                        <div className="col-md-10">{children}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserRoute;
