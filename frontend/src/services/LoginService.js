import React from 'react';
import { Breadcrumb } from 'antd';
import { Route, Routes } from 'react-router-dom';
import CreateLogin from '../components/Forms/login/LoginForm';

const LoginService = () => {

  return (
    <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Login</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
            <Route path="/" element={<CreateLogin/>} />
        </Routes>
    </div>
  );
};

export default LoginService;
