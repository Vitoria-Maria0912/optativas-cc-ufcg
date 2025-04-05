import React from 'react';
import { Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import DisciplineCreateForm from '../components/Forms/discipline/create-update/DisciplineCreateForm.js';
import DisciplinePatchForm from '../components/Forms/discipline/create-update/DisciplinePatchForm.js';
import ShowOneDisciplineForm from '../components/Forms/discipline/getters/ShowOneDisciplineForm.js';
import ShowAllDisciplinesForm from '../components/Forms/discipline/getters/ShowAllDisciplinesForm.js';

const DisciplineService = () => {

  return (
    <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Disciplinas</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
            <Route path="/create" element={ <DisciplineCreateForm/> }/> 
            <Route path="/update" element={ <DisciplinePatchForm/> }/> 
            <Route path="/getOne" element={ <ShowOneDisciplineForm/> }/>
            <Route path="/getAll" element={ <ShowAllDisciplinesForm/> }/>
        </Routes>
        <Outlet/>
    </div>
  );
};

export default DisciplineService;
