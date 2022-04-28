import axios from "axios";
import { useEffect, useState } from "react";
import { ChatEngine, NewMessageForm } from 'react-chat-engine'
import user from "../../server/models/user";

const messageGuardian = () => {
    const [username, setUsername] = useState("")
    const [secret, setSecret] = useState("")

    useEffect(() => {
        document.title = "Message"
    }, []);
    useEffect(() => {
        getCurrentParent();
    })
    const getCurrentParent = async () => {
        try {
            const { data } = await axios.get("api/getCurrent-parent")
            console.log(data)
            // console.log("GUARDIAN =>", data.guardian)
            // console.log("USERNAME =>", data.username)
            setUsername(data.guardian)
            setSecret(data.username)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {username && secret &&
                < ChatEngine
                    height='90vh'
                    projectID='f034756a-a9bc-4f3a-b984-9fa3f249c526'
                    userName={username}
                    userSecret={secret}
                />
            }
        </>
    );
}

export default messageGuardian;
