
import React, { useEffect, useRef } from "react"
import toast from 'react-hot-toast';
import Client from "./Client"
import Editor from "./Editor"
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

function EditorPage() {


    //useRef-> useRef is used for storing ,and it prevents from re-rendering the component if any changes occur
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = React.useState([]);


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed,try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName: location.state?.userName,
            });

            // listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, userName, socketId }) => {

                    if (userName !== location.state?.userName) {
                        toast.success(`${userName} joined the room.`);
                        console.log(`${userName} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    })
                }
            );

            //Listening from disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, userName }) => {
                    toast.success(`${userName} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );

        };

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }

    },
        []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard')
        }
        catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator("/");

    }

    if (!location.state) {
        return <Navigate to="/" />;
    }


    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='aside--inner'>
                    <div className="Wrapper--logo">
                        <img src="../images/logo2.png" className="logo--image"></img>
                        <div className="logo-title">
                            <h1 className="logo--title1">Code</h1>
                            <h1 className="logo--title2">Edit</h1>
                        </div>
                    </div>
                    <h3 className="connected">Connected</h3>
                    <div className="clientsList">
                        {
                            clients.map((client) => (
                                <Client
                                    key={client.socketId}
                                    userName={client.userName}
                                />
                            ))
                        }
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
            </div>
            <div className='editorWrap'>
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    )
}

export default EditorPage