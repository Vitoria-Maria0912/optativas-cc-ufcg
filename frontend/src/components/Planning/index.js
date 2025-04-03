import React, { useState } from "react"
import "./style.css"
import Card from "../Card";
import DropZone from "../DropZone";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Modal, Space } from "antd";
import Search from "antd/es/input/Search";
import Select from "../Select";

const Planning = ({ }) => {
    const onSearch = (value, _e, info) =>
        console.log(info === null || info === void 0 ? void 0 : info.source, value);

    const [currentPeriod, setCurrentPeriod] = useState(null)

    const [cards, setCards] = useState({
        1: ["P1", "LP1", "FMCC1", "IC", "Direito"],
        2: ["P2", "LP2", "FMCC2", "C1", "Economia"],
        3: ["C2", "EDA", "LEDA", "Lógica", "Linear"],
        4: ["TC", "OAC", "BD1", "PLP", "Grafos", "Prob"],
        5: ["IA", "SO", "ES", "PSoft", "Redes", "Estatística"],
        6: ["AS", "ATAL", "Concorrente", "Optativa", "Optativa"],
        7: ["Compila", "Metodologia", "Optativa", "Optativa", "Optativa"],
        8: ["P1", "Português", "Optativa", "Optativa", "Optativa"],
        9: ["P2", "TCC", "Optativa", "Optativa", "Optativa"],
    })
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

