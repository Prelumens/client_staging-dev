import axios from "axios";
import { useEffect, useState } from "react";
import { ChatEngine, NewMessageForm } from 'react-chat-engine'
import user from "../../server/models/user";

const message = () => {
    const [username, setUsername] = useState("")
    const [secret, setSecret] = useState("")

    useEffect(() => {
        document.title = "Message"
    }, []);

    useEffect(() => {
        getCurrentUser();
    })
    const getCurrentUser = async () => {
        try {
            const { data } = await axios.get("api/getCurrent-user")
            setUsername(data.name)
            setSecret(data.username)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {username && secret &&
                <ChatEngine
                    height='90vh'
                    projectID='f034756a-a9bc-4f3a-b984-9fa3f249c526'
                    userName={username}
                    userSecret={secret}
                />
            }

        </>
    );
}

export default message;
