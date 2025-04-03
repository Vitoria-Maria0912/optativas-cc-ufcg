import React, { useState } from 'react';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { createUserRoute } from '../../../routes/UserRoutes';
import './style.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Common');
    
    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await createUserRoute({ name, email, role });
            alert(response.data.message);
            
        } catch (error) { alert("Error: " + (error.response.data.message ?? "Server is not running!")); }
    }

    return (
        <div className="register">
            <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                    <div className='option-class'>
                        <label>
                            <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Common">Usuário comum</option>
                                <option value="Administrator">Administrador</option>
                            </select>
                        </label>
                    </div>
                    <label>Nome:</label>
                    <UserOutlined className='input-icon'/>
                    <input type="text" value={name} placeholder='username' onChange={(e) => setName(e.target.value)}></input>
                    <label>Email:</label>
                    <MailOutlined className='input-icon'/>
                    <input type="text" value={email} placeholder='example@ccc.ufcg.edu.br' onChange={(e) => setEmail(e.target.value)}></input>
                    <button type="submit">Register</button>                
                </div>
            </form>
        </div>
    )
}

export default Register;