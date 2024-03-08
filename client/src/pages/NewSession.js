import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import NavContext from '../contexts/NavContext';
import { useSocketContext } from '../contexts/SocketContext';

const NewSession = function(props) {

    const [socket, setSocket] = useSocketContext();

    const navigate = useNavigate();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {

        socket.on("logout_confirmed", (userData) => {

            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("user", userData);
    
            socket.emit("register_user", sessionUser.username);

        });

        socket.on("login", () => {

            navigate("/messages");

        });

        return () => {

            socket.removeAllListeners("logout_confirmed");
            socket.removeAllListeners("login");

        };

    }, [socket, sessionUser]);

    const handleClick = () => {

        socket.emit("log_out_everywhere", sessionUser.username);

    }

    sessionStorage.setItem("secondAttempt", false);

    return (

        <>

            <NavContext.Provider value={[]}>
                <Header />
            </NavContext.Provider>

            <div className="already-logged-in">

                <div className="logged-in-content">

                    <h1>You're already logged in!</h1>

                    <div className="logged-in-btns">

                        <Button btnID="blue-btn" label="Log Out Everywhere and Log In Here" btnClick={handleClick} />
                        
                        <Link to="/">

                            <Button btnID="red-btn" label="Cancel" />

                        </Link>

                    </div>

                </div>

            </div>

        </>

    );
}

export default NewSession;