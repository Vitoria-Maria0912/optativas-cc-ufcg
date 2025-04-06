import React from 'react';
import { Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import Register from '../components/Forms/user/UserCreateForm';

const AdminService = () => {

  return (
    <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
            <Route path="/" element={ <Register/> }/> 
        </Routes>
        <Outlet />
    </div>
  );
};

export default AdminService;
