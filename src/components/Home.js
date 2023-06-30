import React from "react"
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Home() {

    //create useNavigate Hook
    const navigate = useNavigate();

    //storing the genearted id in state setRoomId 
    const [roomId, setRoomId] = React.useState('');

    //storing  the user name in state
    const [userName, setUserName] = React.useState('');


    //id generation
    const createNewRoom = (e) => {
        //e->event receive hoga

        //after clicking on new room, this function does'nt allow to refresh the page
        e.preventDefault();

        //to store new id in id variable
        const id = uuidV4();
        setRoomId(id);
        //adding toast
        toast.success('Created a new Room');

        //id generation end

    }


    //joinRoom button 
    const joinRoom = () => {
        //check if roomid and username is filled or not
        if (!roomId && !userName) {
            toast.error('ROOM ID & username is required');
            return;
        }
        if (!roomId) {
            toast.error('ROOM ID is required');
            return;
        }
        if (!userName) {
            toast.error('Username is required');
            return;
        }


        //redirect to next editor page
        navigate(`/editor/${roomId}`, {
            state: {
                userName,
            },
        });

    };


    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }


    return (
        <div className="homePageWrapper">

            <div className="formWrapper">
                <div className="formWrapper--logo">
                    <img src="../images/logo2.png" className="logo--image"></img>
                    <div className="logo-title">
                        <h1 className="logo--title1">Code</h1>
                        <h1 className="logo--title2">Edit</h1>
                    </div>
                </div>

                <div className="mainForm">
                    <h4 className="main--Label">Paste invitation ROOM ID</h4>

                    <div className="main-inputGroup">
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="ROOM ID"
                            //to write id manually
                            onChange={(e) => setRoomId(e.target.value)}

                            value={roomId}
                            onKeyUp={handleInputEnter}
                        >
                        </input>
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="USERNAME"
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                            onKeyUp={handleInputEnter}
                        >
                        </input>
                        <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                        <span className="createInfo">
                            If you don't have an invite then create &nbsp;
                            <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
                        </span>
                    </div>
                </div>
            </div>
            <footer>
                <h4>Built with Love</h4>
            </footer>
        </div>
    )
}

export default Home; 