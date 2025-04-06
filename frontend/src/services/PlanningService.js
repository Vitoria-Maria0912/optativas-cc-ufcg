import React from 'react';
import { Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import Planning from '../components/Planning';

const PlanningService = () => {

  return (
    <div>
        <Routes>
            <Route path="/" element={ <Planning/> }/> 
            <Route path="/delete" element={ <Planning/> }/>
            <Route path="/update" element={ <Planning/> }/> 
            <Route path="/getOne" element={ <Planning/> }/>
            <Route path="/getAll" element={ <Planning/> }/>
        </Routes>
        <Outlet />
    </div>
  );
};

export default PlanningService;
