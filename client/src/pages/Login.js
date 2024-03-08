import React from 'react';
import Header from '../components/Header';
import AdText from '../components/AdText';
import LoginBox from '../components/LoginBox';
import LoggedIn from '../components/LoggedIn';
import NavContext from '../contexts/NavContext';

const Login = function(props) {

    const nowLoggedIn = (sessionStorage.getItem("isLoggedIn") === "true");

    let linkTo = nowLoggedIn ? [ 

        {
            dest: '#',
            label: 'My Account'
        }

    ] : [ 

        {
            dest: '/',
            label: 'Log In'
        }, {
            dest: '/signup',
            label: 'Create Account'
        }
        
    ];

    return (

        <div className="pageContent">

            <NavContext.Provider value={linkTo}>
                <Header />
            </NavContext.Provider>

            {
                (!nowLoggedIn && 

                    <div className="content">
                        
                        <AdText />

                        <LoginBox />

                    </div>

                ) || <LoggedIn />
            }

        </div>

    );
}

export default Login;