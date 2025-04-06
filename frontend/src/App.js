import React, { useState } from 'react';
import { HomeOutlined, UserOutlined, BookOutlined, UsbOutlined, BulbOutlined, LinkOutlined } from '@ant-design/icons';
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

const App = () => {

    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => { setCollapsed(collapsed); };

    const navigate = useNavigate();

    return (
        <NotificationProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" >
                        <span className="logo-T">T</span>
                        <span className="logo-text">rilharei</span>
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="vertical">
                        <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>Home</Menu.Item>
                        <Menu.Item key="about" icon={<BulbOutlined />} onClick={() => navigate('/about')}>About</Menu.Item>
                        <Menu.Item key="login" icon={<LinkOutlined />} onClick={() => navigate('/auth/login')}>Criar login</Menu.Item>

                        <SubMenu key="users" icon={<UserOutlined />} title="Usuário">
                            <Menu.Item key="11" onClick={() => navigate('/users/create')}>Criar novo usuário</Menu.Item>
                            <Menu.Item key="12" onClick={() => navigate('/users/delete')}>Deletar usuário</Menu.Item>
                            <Menu.Item key="13" onClick={() => navigate('/users/update')}>Editar usuário</Menu.Item>
                            <Menu.Item key="14" onClick={() => navigate('/users/getOne')}>Visualizar usuário</Menu.Item>
                            <Menu.Item key="15" onClick={() => navigate('/users/getAll')}>Visualizar todos os usuários</Menu.Item>
                        </SubMenu>
                        <SubMenu key="discipline" icon={<UsbOutlined />} title="Disciplina">
                            <Menu.Item key="21" onClick={() => navigate('/disciplines/create')}>Criar nova disciplina</Menu.Item>
                            <Menu.Item key="22" onClick={() => navigate('/disciplines/delete')}>Apagar disciplina</Menu.Item>
                            <Menu.Item key="23" onClick={() => navigate('/disciplines/update')}>Editar disciplina</Menu.Item>
                            <Menu.Item key="24" onClick={() => navigate('/disciplines/getOne')}>Visualizar disciplina</Menu.Item>
                            <Menu.Item key="25" onClick={() => navigate('/disciplines/getAll')}>Visualizar todas as disciplinas</Menu.Item>
                        </SubMenu>
                        <SubMenu key="planning" icon={<BookOutlined />} title="Planejamento">
                            <Menu.Item key="31" onClick={() => navigate('/planning')}>Criar planejamento</Menu.Item>
                            <Menu.Item key="32" onClick={() => navigate('/planning/save')}>Salvar planejamento</Menu.Item>
                            <Menu.Item key="34" onClick={() => navigate('/planning/delete')}>Apagar planejamento</Menu.Item>
                            <Menu.Item key="33" onClick={() => navigate('/planning/update')}>Editar planejamento</Menu.Item>
                            <Menu.Item key="34" onClick={() => navigate('/planning/getOne')}>Visualizar planejamento</Menu.Item>
                        </SubMenu>

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/about" exact element={<About />} />
                            <Route path="/users/*" element={<UserService />} />
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
