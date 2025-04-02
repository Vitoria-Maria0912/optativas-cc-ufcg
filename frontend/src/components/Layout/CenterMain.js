import React from "react";
import Flowchart from "../Flowchart";
import { Breadcrumb } from "antd";
import "./style.css"

export const Home = () => {
    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Fluxograma</Breadcrumb.Item>
            </Breadcrumb>
            <Flowchart />
        </div>
    );
}

export const About = () => {
    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>About</Breadcrumb.Item>
            </Breadcrumb>
            <div id="about">
                <p>Este projeto visa facilitar o planejamento de disciplinas do curso de Ciência da Computação da UFCG, permitindo a visualização de disciplinas obrigatórias e optativas, incluindo informações como disponibilidade de professores e requisitos.
                    Administradores podem gerenciar o catálogo de disciplinas por meio de funcionalidades de CRUD.</p>
                <h3>Foram utilizadas as seguintes tecnologias:</h3>
                <ul>
                    <li><b>Back-end:</b> Typescript, Node.js, Docker, Prisma e JWT </li><br></br>
                    <li><b>Front-end:</b> Express.js, React</li><br></br>
                    <li><b>Database:</b> PostgreSQL</li><br></br>
                    <li><b>Documentação:</b> Swagger</li>
                </ul>
            </div>
        </div>
    );
}