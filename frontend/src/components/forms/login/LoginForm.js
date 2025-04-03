import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { createLoginRoute } from '../../../routes/LoginRoutes';
import './style.css';

const CreateLogin = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
      
        try {
          const response = await createLoginRoute({ email, password });
          alert(response.data.message);
          // navigate to planning page 
          navigate('/planning');

        } catch (error) { alert("Error: " + (error.response?.data?.message ?? "Server is not running!")); }
    };
      
    return (
        <div className='login-header'>
            <form onSubmit={handleLogin} className='login-form'>
                <label>Nome:</label> 
                <UserOutlined className='input-icon'/>
                <input type='text' value={username} placeholder={'username'} onChange={e => setUsername(e.target.value)}></input>
                <label>Email:</label>
                <MailOutlined className='input-icon'/>
                <input type='text' value={email} placeholder='example@ccc.ufcg.edu.br' onChange={e => setEmail(e.target.value)}></input>
                <label>Senha:</label>
                <LockOutlined className='input-icon'/>
                <input type='password' value={password} placeholder='password' onChange={e => setPassword(e.target.value)}></input>
                <button type='submit'>Criar login</button>
            </form>
        </div>
    );
};

export default CreateLogin;