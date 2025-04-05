import React from 'react';
import { Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import Register from '../components/Forms/user/UserCreateForm';

const UserService = () => {

  return (
    <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Usuários</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
            <Route path="create" element={ <Register/> }/> 
            <Route path="delete" element={ <></> }/>
            <Route path="update" element={ <></> }/> 
            <Route path="getOne" element={ <></> }/>
            <Route path="getAll" element={ <></> }/>
        </Routes>
        <Outlet />
    </div>
  );
};

export default UserService;
