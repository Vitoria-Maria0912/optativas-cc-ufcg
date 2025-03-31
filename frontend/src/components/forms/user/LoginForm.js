import React, { useState } from 'react';
import '../style.css';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const CreateLogin = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleCreate = () => {};

    return (
        <div>
            <div className='login-header'>
                <form onSubmit={handleCreate} className='login-form'>
                    <label icon={<UserOutlined />}>Nome:</label>
                    <input type='text' value={username} placeholder='username' onChange={e => setUsername(e.target.value)}></input>
                    <label icon={<MailOutlined />}>Email:</label>
                    <input type='email' value={email} placeholder='example@ccc.ufcg.edu.br' onChange={e => setEmail(e.target.value)}></input>
                    <label icon={<LockOutlined />}>Senha:</label>
                    <input type='password' value={password} placeholder='password' onChange={e => setPassword(e.target.value)}></input>
                    <button type='submit'>Criar login</button>
                </form>

            </div>
        </div>
    );
};

export default CreateLogin;