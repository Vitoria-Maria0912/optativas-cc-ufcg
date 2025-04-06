import React, { useState } from 'react';
import { HomeOutlined, UserOutlined, BookOutlined, UsbOutlined, BulbOutlined, LinkOutlined, ArrowLeftOutlined, ArrowRightOutlined, FormOutlined, LoginOutlined, ScheduleOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, About } from './components/Layout/CenterMain.js'
import './style.css';
// import UserService from './services/UserService.js';
import DisciplineService from './services/DisciplineService.js';
import PlanningService from './services/PlanningService.js';
import LoginService from './services/LoginService.js';
import Planning from './components/Planning/index.js';
import UserService from './services/UserService.js';
import { NotificationProvider } from './components/Alert/index.js';
import AdminService from './services/AdminService.js';

const App = () => {

    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => { setCollapsed(collapsed); };

    const navigate = useNavigate();

    return (
        <NotificationProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider trigger={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        border: '2px solid white',
                    }}>
                        {collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                    </div>
                } width={346} className="main-menu" collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" >
                        <span className="logo-T">T</span>
                        <span className="logo-text">rilharei</span>
                    </div>
                    <Menu icon={<ArrowLeftOutlined />} className="main-menu-items" theme="dark" defaultSelectedKeys={['1']} mode="vertical">
                        <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>Home</Menu.Item>
                        <Menu.Item key="cadastro" icon={<FormOutlined />} onClick={() => navigate('/users/create')}>Cadastrar</Menu.Item>
                        <Menu.Item key="login" icon={<LoginOutlined />} onClick={() => navigate('/auth/login')}>Fazer login</Menu.Item>
                        <Menu.Item key="planejamento" icon={<ScheduleOutlined />} onClick={() => navigate('/planning')}>Planejamento</Menu.Item>
                        <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>Dashboard</Menu.Item>
                        <Menu.Item key="about" icon={<BulbOutlined />} onClick={() => navigate('/about')}>About</Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/about" exact element={<About />} />
                            <Route path="/users/*" element={<UserService />} />
                            <Route path="/admin" element={<AdminService />} />
                            <Route path="/auth/login" exact element={<LoginService />} />
                            <Route path="/disciplines/*" element={<DisciplineService />} />
                            <Route path="/planning/*" element={<PlanningService />} />
                        </Routes>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Trilharei - Computação UFCG © 2025 Created by UFCG alumni</Footer>
                </Layout>
            </Layout>
        </NotificationProvider>
    );
};

export default App;
