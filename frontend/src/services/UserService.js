import React from 'react';
import { Breadcrumb } from 'antd';
import { Route, Routes } from 'react-router-dom';

const UserService = () => {

  return (
    <div>
        {/* <Breadcrumb>
          <Breadcrumb.Item>Usuários</Breadcrumb.Item>
        </Breadcrumb> */}
        <Routes>
            <Route path="/auth/login" element={<></>} />
            <Route path="/create" element={ <></> }/> 
            <Route path="/delete" element={ <></> }/>
            <Route path="/update" element={ <></> }/> 
            <Route path="/getOne" element={ <></> }/>
            <Route path="/getAll" element={ <></> }/>
        </Routes>
    </div>
  );
};

export default UserService;
