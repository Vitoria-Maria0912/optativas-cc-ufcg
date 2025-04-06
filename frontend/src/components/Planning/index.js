import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Card from "../Card";
import DropZone from "../DropZone";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Modal, Space } from "antd";
import Search from "antd/es/input/Search";
import Select from "../Select";
import { getDefaultPlanning } from "../../routes/LoginRoutes";
import { getAllDisciplinesRoute } from "../../routes/DisciplineRoutes";
import { useNotificationApi } from "../Alert";
import { useNavigate } from "react-router-dom";
import { createPlanning, putPlanning } from "../../routes/PlanningRoutes";
import { defaultPeriodStructure } from "../util";

const Planning = () => {
    const notification = useNotificationApi();
    const navigate = useNavigate();

    const [plannings, setPlannings] = useState([]);
    const [currentPlanning, setCurrentPlanning] = useState(null);
    const [disciplines, setDisciplines] = useState([]);
    const [modalDisciplines, setModalDisciplines] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [select, setSelect] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const hasFetched = useRef(false);

    const updateSelect = (plannings) => {
        const items = [...plannings]
            .sort((a, b) => a.id - b.id) // <-- Ordena só por garantia
            .map((planning, index) => ({
                key: planning.id,
                name: `Planejamento ${index + 1}`,
                label: (
                    <a
                        onClick={() => {
                            setCurrentPlanning({
                                ...planning,
                                name: `Planejamento ${index + 1}`,
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
        if (hasFetched.current) return;
        hasFetched.current = true;
        const getData = async () => {
            try {
                const planningResponse = await getDefaultPlanning();
                const disciplineResponse = await getAllDisciplinesRoute();

                const allPlannings = planningResponse.data.planning;
                const allDisciplines = disciplineResponse.data.disciplines;

                setDisciplines(allDisciplines);
                console.log(allPlannings)

                if (allPlannings.length > 0) {
                    const renamedPlannings = allPlannings
                        .map((p, index) => ({
                            ...p,
                            name: `Planejamento ${index + 1}`
                        }))
                        .sort((a, b) => a.id - b.id);


                    setPlannings(renamedPlannings);

                    setCurrentPlanning({
                        ...renamedPlannings[0],
                        periods: [...renamedPlannings[0].periods].sort((a, b) => Number(a.name) - Number(b.name)),
                    });

                    console.log(renamedPlannings[0])

                    updateSelect(renamedPlannings);
                } else {
                    const buildInitialPeriods = () => {
                        return Object.entries(defaultPeriodStructure).map(([periodNumber, disciplineNames]) => {

                            const normalize = str => str.toLowerCase().trim();
                            const foundDisciplines = disciplineNames.map((name) => {
                                const found = allDisciplines.find((d) => normalize(d.acronym) === normalize(name));
                                if (!found) console.warn(`Disciplina com acrônimo "${name}" não encontrada.`);
                                return found;
                            }).filter(Boolean);

                            return {
                                name: periodNumber,
                                disciplines: foundDisciplines.map((d) => d.id),
                            };
                        });
                    };

                    const newPlanning = {
                        name: `Planejamento 1`,
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
                        if (err.status === 409) {
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
        if (!modalDisciplines) return;

        const searchValue = value.trim().toLowerCase();

        const filteredDisciplines = disciplines.filter(discipline =>
            discipline.acronym.trim().toLowerCase().includes(searchValue)
        );

        setModalDisciplines(filteredDisciplines);
    };


    const showModal = (periodId) => {
        setCurrentPeriod(periodId);
        setIsModalOpen(true);
        setModalDisciplines(disciplines)
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
        console.log(disciplines)
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

            const updatedPlannings = plannings
                .map((p) => (p.id === formattedPlanning.id ? { ...currentPlanning } : p))
                .sort((a, b) => a.id - b.id);

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
            const maxId = plannings.length + 1;
            const newPlanning = {
                name: `Planejamento ${maxId}`,
                periods: currentPlanning.periods.map((period, i) => ({
                    name: `${i + 1}`,
                    disciplines: period.disciplines.map(d => d.id),
                })),
            };

            const response = await createPlanning(newPlanning);
            const createdPlanning = response.data.createdPlanning;

            const updatedPlannings = [...plannings, createdPlanning].sort((a, b) => a.id - b.id); // <-- Ordena aqui também
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

    const [highlightedDisciplines, setHighlightedDisciplines] = useState([]);

    const getDisciplineIdByName = (name) => {
        const discipline = disciplines.find(discipline => discipline.name === name)
        return discipline.id
    }

    const handleCardHover = (discipline) => {
        const related = new Set();

        const findRelated = (disc) => {
            disc.pre_requisites?.forEach((name) => related.add(getDisciplineIdByName(name)));
            disc.post_requisites?.forEach((name) => related.add(getDisciplineIdByName(name)));
        };

        findRelated(discipline);

        console.log(related)

        setHighlightedDisciplines([...related]);
    };

    const handlePeriodDelete = () => {
        const lastPeriod = currentPlanning.periods[currentPlanning.periods.length - 1]
        if (currentPlanning.periods.length > 1) {
            setCurrentPlanning(prevPlanning => {
                return {
                    ...prevPlanning,
                    periods: prevPlanning.periods.filter(period => {
                        return period.id !== lastPeriod.id
                    })
                }
            })
        }
    }

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
                    {Array.isArray(modalDisciplines) &&
                        modalDisciplines.map((discipline) => (
                            <Card
                                key={discipline.id}
                                card={discipline}
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
                    currentPlanning?.periods?.map((period, index) => {
                        const isLast = index === currentPlanning.periods.length - 1;

                        return (
                            <div key={period.id} className="period" id={period.id}>
                                <DropZone targetPeriod={period.id} index={0} setCurrentPlanning={setCurrentPlanning} />
                                {isLast &&
                                    <div className="delete-last-period">
                                        <DeleteOutlined onClick={handlePeriodDelete} />
                                    </div>
                                }
                                {period.disciplines.map((card, index) => (
                                    <React.Fragment key={card.id}>
                                        <Card
                                            onHover={() => handleCardHover(card)}
                                            highlight={highlightedDisciplines.includes(card.id)}
                                            card={card}
                                            period={period.id}
                                            canDelete
                                            handleCardDelete={() => handleCardDelete(period.id, card.id)}
                                        />
                                        <DropZone targetPeriod={period.id} index={index + 1} setCurrentPlanning={setCurrentPlanning} />
                                    </React.Fragment>
                                ))}
                                <div className="plus-icon plus-icon-discipline">
                                    <button className="button-show-modal" onClick={() => showModal(period.id)}>
                                        <PlusCircleOutlined />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }

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
