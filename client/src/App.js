import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './css/styles.css';
import Login from './pages/Login';
import Messages from './pages/Messages';
import NewSession from './pages/NewSession';
import ModalCreateAccount from './components/ModalCreateAccount';
import ModalChangePassword from './components/ModalChangePassword';
import SocketContext from './contexts/SocketContext';
import NotificationContext from './contexts/NotificationContext';

import io from "socket.io-client";

const mainSocket = io.connect("http://localhost:3005");

function App() {

	const location = useLocation();
	const previousLocation = location.state?.previousLocation;

	const navigate = useNavigate();

	const [socket, setSocket] = useState(mainSocket);

	const [notifications, setNotifications] = useState(0);

	const sessionUser = JSON.parse(sessionStorage.getItem("user"));

	useEffect(() => {

		const isLoggedIn = sessionStorage.getItem("isLoggedIn");

		console.log("session " + isLoggedIn);

	}, []);

	useEffect(() => {

		window.addEventListener("load", () => {

            if (sessionUser && JSON.parse(sessionStorage.getItem("isRefresh"))) {

                socket.emit("register_user", sessionUser.username);

                sessionStorage.setItem("isRefresh", false);

            }

        });

		window.addEventListener("beforeunload", () => {sessionStorage.setItem("isRefresh", true);});

		socket.on("log_out_all", (socketID) => {

			console.log("log out here");

			if (sessionStorage.getItem("isLoggedIn")) {

				socket.emit("logout", sessionUser.username);

				socket.emit("confirm_logout", sessionStorage.getItem("user"), socketID);

				sessionStorage.setItem("isLoggedIn", false);

				sessionStorage.setItem("user", null);

				navigate("/");

				console.log("isLoggedIn: " + sessionStorage.getItem("isLoggedIn"));
				console.log(sessionStorage.getItem("user"));

			}

		});

		socket.on("send_req_info", (requestFrom) => {

            const {username, accountID, socketID} = requestFrom;

            console.log("you have a request from " + username + " (" + accountID + "): " + socketID);

            socket.emit("send_res_info", sessionUser.accountID, socketID, sessionUser.username);

        });

		return () => {

			window.removeEventListener("load", () => { if (sessionUser && JSON.parse(sessionStorage.getItem("isRefresh"))) { socket.emit("register_user", sessionUser.username); sessionStorage.setItem("isRefresh", false); }});
			window.removeEventListener("beforeunload", () => {sessionStorage.setItem("isRefresh", true);});
			socket.removeAllListeners("log_out_all");
			socket.removeAllListeners("send_req_info");

		};

	}, [socket, sessionUser]);

	const nowLoggedIn = (sessionStorage.getItem("isLoggedIn") === "true");

	const alreadyLoggedIn = (sessionStorage.getItem("secondAttempt") === "true");

	return (

		<>

			<SocketContext.Provider value={[socket, setSocket]}>

				<NotificationContext.Provider value={[notifications, setNotifications]}>

					<Routes location={previousLocation || location}>

						<Route path="/" exact element={<Login />} />

						<Route path="/messages" exact element={nowLoggedIn ? (<Messages />) : (<Navigate to="/" />)} />

						<Route path="/loggedIn" exact element={nowLoggedIn ? (<Navigate to="/" />) : alreadyLoggedIn ? (<NewSession />) : (<Navigate to="/" />)} />

					</Routes>

					{previousLocation && (

						<Routes>

							<Route path="/signup" exact element={<ModalCreateAccount />} />

							<Route path="/changePassword" exact element={<ModalChangePassword />} />

						</Routes>

					)}

				</NotificationContext.Provider>

			</SocketContext.Provider>

		</>
	);
}

export default App;
