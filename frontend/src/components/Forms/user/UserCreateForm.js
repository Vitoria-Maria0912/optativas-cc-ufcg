import React, { useState } from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { createUserRoute } from '../../../routes/UserRoutes';
import './style.css';

import Input from "../../Input"
import { useNotificationApi } from "../../Alert"
import { createLoginRoute } from '../../../routes/LoginRoutes';

const Register = () => {
    const notification = useNotificationApi();
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRetype, setPasswordRetype] = useState('');

    const resetValues = () => {
        setName("")
        setEmail("")
        setPassword("")
        setPasswordRetype("")
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        if (!name || !email || !password || !passwordRetype) {
            setError("Todos os campos devem ser preenchidos");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("O e-mail informado não é válido");
            return;
        }

        if (password !== passwordRetype) {
            setError("As senhas não correspondem");
            return;
        }

        try {
            const response = await createUserRoute({ name, email, password });
            await createLoginRoute({ email, password });
            notification.success({
                message: 'Sucesso!',
                description: response.data.message,
            });
            resetValues()
        } catch (error) {
            const data = error.response.data;
            notification.error({
                message: "Error!",
                description: "Error: " + (data.error ?? data.message ?? "Server is not running!"),
            });
        }
    }

    return (
        <div className="register-wrapper">
            <div className="register">
                <h1>Cadastro</h1>
                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-group">
                        <Input
                            label={"Nome"}
                            inputType={"text"}
                            placeholder={"nome"}
                            icon={<UserOutlined className='input-icon' />}
                            data={name}
                            setData={setName}
                        />
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
                            icon={<LockOutlined className='input-icon' />}
                            data={[password, passwordRetype]}
                            setData={[setPassword, setPasswordRetype]}
                        />

                        <div className="input-error">
                            <span>{error}</span>
                        </div>
                        <button onClick={handleRegister}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;