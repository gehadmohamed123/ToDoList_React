import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Joi from 'joi';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [errorList, setErrorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        username: '', // Now the email is used as 'username'
        password: ''
    });

    // Function to update user state based on input changes
    const getUserData = (event) => {
        const myUser = { ...user };
        myUser[event.target.name] = event.target.value;
        setUser(myUser);
    };

    // Function to send registration data to the API
    const sendLoginDataToApi = async () => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/Login`, user);
            if (data.message === 'User Logined successfully') {
                setIsLoading(false);
                navigate('/login');
            } else {
                setIsLoading(false);
                setError(data.message || 'An error occurred during registration');
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response) {
                console.error('Error Response:', err.response.data);
                if (err.response.status === 400) {
                    setError(err.response.data.message || 'Email already exists');
                } else {
                    setError('An error occurred during registration');
                }
            } else {
                console.error('Error:', err.message);
                setError('An error occurred during registration');
            }
        }
    };

    // Function to handle form submission
    const submitLoginForm = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate the form data
        const validation = validateLoginForm();

        if (validation.error) {
            setErrorList(validation.error.details);
            setIsLoading(false);
        } else {
            setErrorList([]);
            sendLoginDataToApi();
        }
    };

    // Function to validate form data using Joi
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
            {/* Display validation error messages */}
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

            {/* Display general error message */}
            {error && <div className='alert alert-danger my-2'>{error}</div>}

            <div className="Login-container">
                <h1>Login</h1>
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

               
