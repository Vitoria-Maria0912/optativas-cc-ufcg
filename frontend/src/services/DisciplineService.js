import React from 'react';
import { Breadcrumb } from 'antd';
import { Route, Routes } from 'react-router-dom';

const DisciplineService = () => {

  return (
    <div>
        {/* <Breadcrumb>
          <Breadcrumb.Item>Disciplinas</Breadcrumb.Item>
        </Breadcrumb> */}
        <Routes>
            <Route path="/create" element={ <></> }/> 
            <Route path="/delete" element={ <></> }/>
            <Route path="/update" element={ <></> }/> 
            <Route path="/getOne" element={ <></> }/>
            <Route path="/getAll" element={ <></> }/>
        </Routes>
    </div>
  );
};

export default DisciplineService;
