import React, { useEffect, useState } from "react"
import "./style.css"
import Card from "../Card";
import DropZone from "../DropZone";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Modal, Space } from "antd";
import Search from "antd/es/input/Search";
import Select from "../Select";
import { getDefaultPlanning } from "../../routes/LoginRoutes";

import {defaultPlanning} from "../util"

const Planning = ({ }) => {

    const [cards, setCards] = useState(defaultPlanning)

    useEffect(() => {
        const getData = async () => {
            const response = await getDefaultPlanning();
            try {
                const planning = response.data.planning
                if (planning.length > 0){
                    const defaultPlanning = planning[0]
                    const data = {}
                    defaultPlanning.periods.forEach(period => {
                        const disciplinas = period.disciplines.map(discipline => discipline.acronym)
                        
                        data[period.name] = disciplinas 
                    })
                    console.log(data)
                    setCards(data)
                }
            } catch (e){
                console.log(e)
            }
        }

        getData()

    },[])

    
    const onSearch = (value, _e, info) =>
        console.log(info === null || info === void 0 ? void 0 : info.source, value);

    const [currentPeriod, setCurrentPeriod] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCardDelete = (period, card) => {
        setCards(prevCards => {
            return {
                ...prevCards,
                [period]: prevCards[period].filter(c => c != card)
            }
        })
    }

    const handleSelectPeriod = (period) => {
        setCurrentPeriod(period)
    }

    const handleAddDiscipline = (card) => {
        setCards(prevCards => {
            return {
                ...prevCards,
                [currentPeriod]: [...prevCards[currentPeriod], card]
            }
        })
        setIsModalOpen(false);
    }

    const handleAddPeriod = () => {
        setCards(prevCards => {
            return {
                ...prevCards,
                [Math.max(...Object.keys(prevCards)) + 1]: []
            }

        })
    }

    return (
        <div className="planning-wrapper">
            <Modal className="discipline-modal" title="Selecione a disciplina" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Space direction="vertical">
                    <Search placeholder="Disciplina" onSearch={onSearch} style={{ width: 200 }} />
                </Space>
                <div className="select-cards">
                    {Object.values(cards).flat().map(card => (
                        <Card card={card} handleAddDiscipline={() => handleAddDiscipline(card)} />
                    ))}
                </div>
            </Modal>
            <div className="planning-header-wrapper">
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Planejamento</Breadcrumb.Item>
                </Breadcrumb>
                <div className="planning-header">
                    <Select/>
                </div>
            </div>
            <div className="planning">
                {Object.keys(cards).map(period => (
                    <div id={period} className="period">
                        <DropZone targetPeriod={period} index={0} setCards={setCards} />
                        {cards[period].map((card, index) => (
                            <React.Fragment>
                                <Card card={card} period={period} canDelete={true} handleCardDelete={(_) => handleCardDelete(period, card)} />
                                <DropZone targetPeriod={period} index={index + 1} setCards={setCards} />
                            </React.Fragment>
                        ))}
                        <div className="plus-icon plus-icon-discipline">
                            <button className="button-show-modal" onClick={showModal}>
                                <PlusCircleOutlined onClick={() => handleSelectPeriod(period)} />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="plus-icon">
                    <PlusCircleOutlined onClick={handleAddPeriod} />
                </div>
            </div>
            <div id="button-wrapper" >
                <button className="planning-button">Editar</button>
                <button className="planning-button">Salvar novo</button>
            </div>
        </div>
    )
}

export default Planning;

