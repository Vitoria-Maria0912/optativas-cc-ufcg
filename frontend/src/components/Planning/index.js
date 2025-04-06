import React, { useEffect, useState } from "react";
import "./style.css";
import Card from "../Card";
import DropZone from "../DropZone";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Modal, Space } from "antd";
import Search from "antd/es/input/Search";
import Select from "../Select";
import { getDefaultPlanning } from "../../routes/LoginRoutes";
import { getAllDisciplinesRoute } from "../../routes/DisciplineRoutes";
import { useNotificationApi } from "../Alert";
import { useNavigate } from "react-router-dom";
import { createPlanning, putPlanning } from "../../routes/PlanningRoutes";
import { v4 as uuidv4 } from 'uuid';

const Planning = () => {
    const notification = useNotificationApi();
    const navigate = useNavigate();

    const [plannings, setPlannings] = useState([]);
    const [currentPlanning, setCurrentPlanning] = useState(null);
    const [disciplines, setDisciplines] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [select, setSelect] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateSelect = (plannings) => {
        console.log(plannings)
        const items = plannings.map((planning) => ({
            key: planning.id,
            name: planning.name,
            label: (
                <a
                    onClick={() => {
                        setCurrentPlanning({
                        ...planning,
                        periods: [...planning.periods].sort((a, b) => Number(a.name) - Number(b.name)),
                    });
                    }}
                    rel="noopener noreferrer"
                    href="#"
                >
                    {planning.name}
                </a>
            ),
        }));
        setSelect(items);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const planningResponse = await getDefaultPlanning();
                const disciplineResponse = await getAllDisciplinesRoute();

                const allPlannings = planningResponse.data.planning;
                const allDisciplines = disciplineResponse.data.disciplines;

                setDisciplines(allDisciplines);

                if (allPlannings.length > 0) {
                    setPlannings(allPlannings);

                    setCurrentPlanning({
                        ...allPlannings[0],
                        periods: [...allPlannings[0].periods].sort((a, b) => Number(a.name) - Number(b.name)),
                    });

                    updateSelect(allPlannings);
                    console.log(currentPlanning)
                } else {
                    const defaultPeriodStructure = {
                        1: ["P1", "LP1", "FMCC1", "IC", "D&C"],
                        2: ["P2", "LP2", "FMCC2", "C1", "EC"],
                        3: ["C2", "EDA", "LEDA", "LPC", "Linear"],
                        4: ["TC", "OAC", "BD1", "PLP", "Grafos", "Prob"],
                        5: ["IA", "SO", "ES", "PSoft", "Redes", "Estatística"],
                        6: ["AS", "ATAL", "PC"],
                        7: ["Compiladores", "Metodologia"],
                        8: ["PJ1", "PT"],
                        9: ["PJ2", "TCC"],
                    };

                    const buildInitialPeriods = () => {
                        return Object.entries(defaultPeriodStructure).map(([periodNumber, disciplineNames]) => {
                            const foundDisciplines = disciplineNames.map((name) =>
                                allDisciplines.find((d) => d.acronym === name)
                            ).filter(Boolean);

                            return {
                                name: periodNumber,
                                disciplines: foundDisciplines.map((d) => d.id),
                            };
                        });
                    };

                    const newPlanning = {
                        name: `${Date.now()}`,
                        periods: buildInitialPeriods(),
                    };


                    try {
                        const response = await createPlanning(newPlanning);
                        const createdPlanning = response.data.createdPlanning;


                        setPlannings([createdPlanning]);
                        setCurrentPlanning({
                            ...createdPlanning,
                            periods: [...createdPlanning.periods].sort((a, b) => Number(a.name) - Number(b.name)),
                        });
    
                        updateSelect([createdPlanning]);

                        notification.success({
                            message: "Planejamento criado!",
                            description: "Criamos um planejamento inicial para você começar.",
                        });
                    } catch (err) {
                        if (err.status == 409) {
                            return
                        }
                        console.error(err);
                        notification.error({
                            message: "Erro!",
                            description: "Não foi possível criar um planejamento inicial.",
                        });
                    }
                }
            } catch (e) {
                console.log(e)
                if (e.status === 401) {
                    notification.error({
                        message: "Erro!",
                        description: "Sessão expirada, refaça o login.",
                    });
                    setTimeout(() => navigate("/auth/login"), 2000);
                }
            }
        };

        getData();
    }, []);

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
    };

    const showModal = (periodId) => {
        setCurrentPeriod(periodId);
        setIsModalOpen(true);
    };

    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    const handleCardDelete = (idPeriod, idDiscipline) => {
        setCurrentPlanning((prevPlanning) => ({
            ...prevPlanning,
            periods: prevPlanning.periods.map((period) =>
                period.id === idPeriod
                    ? {
                        ...period,
                        disciplines: period.disciplines.filter((d) => d.id !== idDiscipline),
                    }
                    : period
            ),
        }));
    };

    const handleAddDiscipline = (id) => {
        const newDiscipline = disciplines.find((d) => d.id === id);
        if (!newDiscipline) return;

        setCurrentPlanning((prevPlanning) => ({
            ...prevPlanning,
            periods: prevPlanning.periods.map((period) =>
                period.id === currentPeriod && !period.disciplines.find((d) => d.id === id)
                    ? { ...period, disciplines: [...period.disciplines, newDiscipline] }
                    : period
            ),
        }));

        setIsModalOpen(false);
    };

    const handleAddPeriod = () => {
        const maxId = currentPlanning.periods.reduce((max, p) => Math.max(max, p.id), 0);
        const newPeriod = {
            id: maxId + 1,
            planningId: currentPlanning.id,
            name: `${maxId + 1}`,
            disciplines: [],
        };

        setCurrentPlanning((prevPlanning) => ({
            ...prevPlanning,
            periods: [...prevPlanning.periods, newPeriod],
        }));
    };

    const handleEditPlanning = async (_) => {
        try {
            const formattedPlanning = {
                id: currentPlanning.id,
                name: currentPlanning.name,
                periods: currentPlanning.periods.map(period => ({
                    id: period.id,
                    name: period.name,
                    disciplines: period.disciplines.map(d => d.id),
                })),
            };

            await putPlanning(formattedPlanning);

            const updatedPlannings = plannings.map((p) =>
                p.id === formattedPlanning.id ? { ...currentPlanning } : p
            );

            setPlannings(updatedPlannings);
            updateSelect(updatedPlannings);

            notification.success({
                message: "Sucesso!",
                description: "Planejamento atualizado com sucesso.",
            });

        } catch (e) {
            console.error(e);
            notification.error({
                message: "Erro!",
                description: "Não foi possível atualizar o planejamento.",
            });
        }
    };

    const handleCreatePlanning = async () => {
        try {
            const maxId = plannings.reduce((max, p) => Math.max(max, p.id), 0);
            const newPlanning = {
                name: `Planning ${maxId + 1}`,
                periods: currentPlanning.periods.map((period, i) => ({
                    name: `${i + 1}`,
                    disciplines: period.disciplines.map(d => d.id),
                })),
            };

            const response = await createPlanning(newPlanning);
            const createdPlanning = response.data.createdPlanning;

            const updatedPlannings = [...plannings, createdPlanning];
            setPlannings(updatedPlannings);
            updateSelect(updatedPlannings);
            setCurrentPlanning({
                ...createdPlanning,
                periods: [...createdPlanning.periods].sort((a, b) => Number(a.name) - Number(b.name)),
            });

            notification.success({
                message: "Sucesso!",
                description: "Novo planejamento criado com sucesso.",
            });
        } catch (e) {
            console.log(e)
            console.error(e);
            notification.error({
                message: "Erro!",
                description: "Não foi possível criar um novo planejamento.",
            });
        }
    };

    return (
        <div className="planning-wrapper">
            <Modal
                className="discipline-modal"
                title="Selecione a disciplina"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Space direction="vertical">
                    <Search placeholder="Disciplina" onSearch={onSearch} style={{ width: 200 }} />
                </Space>
                <div className="select-cards">
                    {disciplines.map((discipline) => (
                        <Card
                            key={discipline.id}
                            card={discipline.acronym}
                            handleAddDiscipline={() => handleAddDiscipline(discipline.id)}
                        />
                    ))}
                </div>
            </Modal>

            <div className="planning-header-wrapper">
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Planejamento</Breadcrumb.Item>
                </Breadcrumb>
                <div className="planning-header">
                    {select.length > 0 && (
                        <Select items={select} current={currentPlanning?.name || "Planejamento"} />
                    )}
                </div>
            </div>

            <div className="planning">
                {
                    currentPlanning?.periods?.map((period) => (
                        <div key={period.id} className="period" id={period.id}>
                            <DropZone targetPeriod={period.id} index={0} setCards={setSelect} />
                            {period.disciplines.map((card, index) => (
                                <React.Fragment key={card.id}>
                                    <Card
                                        card={card.acronym}
                                        period={period.id}
                                        canDelete
                                        handleCardDelete={() => handleCardDelete(period.id, card.id)}
                                    />
                                    <DropZone targetPeriod={period.id} index={index + 1} setCards={setSelect} />
                                </React.Fragment>
                            ))}
                            <div className="plus-icon plus-icon-discipline">
                                <button className="button-show-modal" onClick={() => showModal(period.id)}>
                                    <PlusCircleOutlined />
                                </button>
                            </div>
                        </div>
                    ))}

                <div className="plus-icon">
                    <PlusCircleOutlined onClick={handleAddPeriod} />
                </div>
            </div>

            <div id="button-wrapper">
                <button className="planning-button" onClick={handleEditPlanning}>
                    Editar
                </button>
                <button className="planning-button" onClick={handleCreatePlanning}>Salvar novo</button>
            </div>
        </div>
    );
};

export default Planning;
