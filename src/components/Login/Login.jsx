import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Joi from 'joi';

const Login = ({saveUserData}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [errorList, setErrorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        username: '', 
        password: ''
    });

    const getUserData = (event) => {
        const myUser = { ...user };
        myUser[event.target.name] = event.target.value;
        setUser(myUser);
    };

    const sendLoginDataToApi = async () => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/Login`, user);
            console.log('Response data:', data);
            if (data.token && data.token.length > 0) {
                setIsLoading(false);
                localStorage.setItem('userToken', data.token);
                saveUserData();
                navigate('/todolist');
                window.location.reload(); // ليس الحل المثالي، ولكنه يمكن أن يكون حلاً مؤقتًا
            } else {
                setIsLoading(false);
                setError(data.message || 'An error occurred during Login');
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response) {
                console.error('Error Response:', err.response.data);
                if (err.response.status === 400) {
                    setError(err.response.data.message || 'Invalid credentials');
                } else {
                    setError('An error occurred during Login');
                }
            } else {
                console.error('Error:', err.message);
                setError('An error occurred during Login');
            }
        }
    };
    

    const submitLoginForm = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const validation = validateLoginForm();

        if (validation.error) {
            setErrorList(validation.error.details);
            setIsLoading(false);
        } else {
            setErrorList([]);
            sendLoginDataToApi();
        }
    };

    const validateLoginForm = () => {
        const schema = Joi.object({
            username: Joi.string()
                .email({ tlds: { allow: ['com', 'net'] } })
                .required()
                .messages({
                    'string.empty': 'Email is required',
                    'string.email': 'Invalid email format',
                }),
            password: Joi.string()
                .min(6)
                .required()
                .messages({
                    'string.empty': 'Password is required',
                    'string.min': 'Password must be at least 6 characters long',
                }),
        });

        return schema.validate(user, { abortEarly: false });
    };

    return (
        <>
            {errorList.length > 0 && (
                <div className="alert alert-danger my-2">
                    <ul className="mb-0">
                        {errorList.map((err, index) => (
                            <li key={index}>
                                {err.context.label === 'password' ? 'Invalid password' : err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div className='alert alert-danger my-2'>{error}</div>}

            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={submitLoginForm}>
                    <input
                        name='username'
                        onChange={getUserData}
                        type="email"
                        placeholder="Email"
                        value={user.username}
                        required
                    />
                    <input
                        name='password'
                        onChange={getUserData}
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
                    </button>
                    <p className="login-link">
                        Don’t have an account? <Link to="/">Register now</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Login;
