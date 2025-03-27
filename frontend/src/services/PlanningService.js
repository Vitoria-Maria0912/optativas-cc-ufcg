import React from 'react';
import { Breadcrumb } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Planning from '../components/Flowchart';

const PlanningService = () => {

  return (
    <div>
        {/* <Breadcrumb>
          <Breadcrumb.Item>Planning</Breadcrumb.Item>
        </Breadcrumb> */}
        <Routes>
            <Route path="/create" element={ <Planning/> }/> 
            <Route path="/delete" element={ <Planning/> }/>
            <Route path="/update" element={ <Planning/> }/> 
            <Route path="/getOne" element={ <Planning/> }/>
            <Route path="/getAll" element={ <Planning/> }/>
        </Routes>
    </div>
  );
};

export default PlanningService;
