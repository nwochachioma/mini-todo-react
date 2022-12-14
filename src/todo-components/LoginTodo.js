import '../css/login-todo.css'
import { Link, Redirect } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Loader from './Loader'
import { useMutation } from 'react-query'

function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
const LoginTodo = () => {
    const [token, setToken] = useState(null)
    const [messageError, setMessageError] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [userEmail, setUserEmail] = useState(() => {
        const email = getCookie(`"email`);
        if(email){
            return (email).replace(`"`,'')
        } else {
            return ''
        }
    })

    const auth = (email) => {
        return axios.post('https://todo-api-12iv.onrender.com/users/login', email)
    }

    const {mutate, status, error} = useMutation(auth, {
        onError: (data) => {
            setMessageError(data.response.data.message)
        },
        onSuccess: (data) => {
            document.cookie = `"username=${data.data.data.firstname}"`;
            setToken(data.data.data.token)
            setRedirect(true)
        }
    })
    const login = (e) => {
        e.preventDefault();
        const email = {
            email: userEmail
        }
        mutate(email)
    }
    
    if(redirect){
        return <Redirect to={`/${token}`} />
    }

    return ( 
        <div className="container">
            <div className="welcome-hero">
                <p>Welcome,</p>
                <p>Glad to see you !</p>
            </div>
            {status === 'loading' &&
                <div className='login-loader'>
                    <Loader />
                </div>
            }
            {status === 'error' && <p className='error'>{messageError}</p>}
            {status !== 'loading' &&
                <div>
                    <form onSubmit={(e) => login(e)}>
                        <input type="email" name="email" id="email" required placeholder="Email Address" className="details" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} autoFocus/>
                        <button className='login-button'>Login</button>
                    </form>
                </div>
            }
            <p>Don't have an account yet? <Link to="/signup">Sign up here</Link></p>
        </div>
     );
}
 
export default LoginTodo;