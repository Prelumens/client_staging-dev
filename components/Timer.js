import { useEffect, useContext } from "react";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";

const Timer = () => {
    const router = useRouter();

    //get the current state - just to check if the user is logged in or not
    const { state, dispatch } = useContext(Context);
    const { user } = state;

    useEffect(() => {
        if (user) {
            getCurrentUser()
        } else {
            console.log("NO USER TO CHECK TIMER")
        }
    }, [user]);

    const getCurrentUser = async () => {
        try {
            const { data } = await axios.get("/api/current-userNavbar");
            if (
                data.role.toString() == "Student" &&
                data.parentMode == false &&
                data.screenTimeoutEnabled == true
            ) {
                setTimeout(() => {
                    router.push("/time-out")
                }, data.screenTimeout)
                return
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div></div>
    )
}

export default Timer