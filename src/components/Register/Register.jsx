import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Joi from 'joi';

const Register = () => {
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
    const sendRegisterDataToApi = async () => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/register`, user);
            if (data.message === 'User registered successfully') {
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
    const submitRegisterForm = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate the form data
        const validation = validateRegisterForm();

        if (validation.error) {
            setErrorList(validation.error.details);
            setIsLoading(false);
        } else {
            setErrorList([]);
            sendRegisterDataToApi();
        }
    };

    // Function to validate form data using Joi
    const validateRegisterForm = () => {
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

            <div className="register-container">
                <h1>Register</h1>
                <form onSubmit={submitRegisterForm}>
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
                        {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Register'}
                    </button>
                    <p className="login-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Register;
