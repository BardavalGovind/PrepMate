import {useState, useContext, useEffect, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children })=>{
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if(data){
            const parseData = JSON.parse(data);
            setAuth(parseData);

            //default axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${parseData.token}`;
        }
        //eslint-disable-next-line
    }, []);

    return(
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };