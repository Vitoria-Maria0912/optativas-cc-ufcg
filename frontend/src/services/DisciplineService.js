import React from 'react';
import { Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import DisciplineCreateForm from '../components/Forms/discipline/DisciplineCreateForm.js';
import DisciplinePatchForm from '../components/Forms/discipline/DisciplinePatchForm.js';
// import ShowOneDiscipline from '../components/Forms/discipline/ShowOneDisciplineForm.js';
import ShowAllDisciplinesForm from '../components/Forms/discipline/ShowAllDisciplinesForm.js';

const DisciplineService = () => {

  return (
    <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Disciplinas</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
            <Route path="/create" element={ <DisciplineCreateForm/> }/> 
            <Route path="/delete" element={ <></> }/>
            <Route path="/update" element={ <DisciplinePatchForm/> }/> 
            <Route path="/getOne" element={ <></> }/>
            <Route path="/getAll" element={ <ShowAllDisciplinesForm/> }/>
        </Routes>
        <Outlet/>
    </div>
  );
};

export default DisciplineService;
