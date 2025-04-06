import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { createLoginRoute, getTokenByUserEmailRoute } from '../../../routes/LoginRoutes';
import './style.css';
import Input from "../../Input"
import { useNotificationApi } from '../../Alert';

const CreateLogin = () => {
    const notification = useNotificationApi();
    const [error, setError] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const resetValues = () => {
        setEmail("")
        setPassword("")
    }

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError("Todos os campos devem ser preenchidos");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("O e-mail informado não é válido");
            return;
        }

        try {
            const response = await getTokenByUserEmailRoute({ email, password });
            localStorage.setItem("token", response.data.login.token);
            setTimeout(() => {
                navigate('/planning');
            }, 2000);
            notification.success({
                message: 'Sucesso!',
                description: response.data.message,
            });
            resetValues()

        } catch (error) {
            console.log(error)
            const data = error.response.data;

            notification.error({
                message: "Error!",
                description: "Error: " + (data.error ?? data.message ?? "Server is not running!"),
            });
        }
    };

    return (
        <div className="login-wrapper">
            <div className='login'>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className='login-form'>
                    <Input
                        label={"Email"}
                        inputType={"text"}
                        placeholder={"e-mail"}
                        icon={<UserOutlined className='input-icon' />}
                        data={email}
                        setData={setEmail}
                    />
                    <Input
                        label={"Password"}
                        inputType={"password"}
                        placeholder={"senha"}
                        duplicatedPass={false}
                        icon={<LockOutlined className='input-icon' />}
                        data={password}
                        setData={setPassword}
                    />

                    <div className="input-error">
                        <span>{error}</span>
                    </div>
                    <button onClick={handleLogin}>Criar login</button>
                </form>
            </div>
        </div>
    );
};

export default CreateLogin;