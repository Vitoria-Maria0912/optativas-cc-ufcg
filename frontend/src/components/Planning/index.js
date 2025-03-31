import React, { useState } from "react"
import "./style.css"
import Card from "../Card";
import DropZone from "../DropZone";
import { PlusCircleOutlined } from '@ant-design/icons';


const Planning = ({ }) => {
    const [cards, setCards] = useState({
            periodo1: ["P1", "LP1", "FMCC1", "IC", "Direito"],
            periodo2: ["P2", "LP2", "FMCC2", "C1", "Economia"],
            periodo3: ["C2", "EDA", "LEDA", "Lógica", "Linear"],
            periodo4: ["TC", "OAC", "BD1", "PLP", "Grafos", "Prob"],
            periodo5: ["IA", "SO", "ES", "PSoft", "Redes", "Estatística"],
            periodo6: ["AS", "ATAL", "Concorrente", "Optativa", "Optativa"],
            periodo7: ["Compila", "Metodologia", "Optativa", "Optativa", "Optativa"],
            periodo8: ["P1", "Português", "Optativa", "Optativa", "Optativa"],
            periodo9: ["P2", "TCC", "Optativa", "Optativa", "Optativa"],
        })

    return (
        <div className="planning">
            {Object.keys(cards).map(period => (
                <div id={period} className="period">
                    <DropZone targetPeriod={period} index={0} setCards={setCards} />
                    {cards[period].map((card, index) => (
                        <React.Fragment>
                            <Card card={card} period={period} />
                            <DropZone targetPeriod={period} index={index + 1} setCards={setCards} />
                        </React.Fragment>
                    ))}
                    <div className="plus-icon plus-icon-discipline">
                        <PlusCircleOutlined />
                    </div>
                </div>
            ))}
            <div className="plus-icon">
                <PlusCircleOutlined />
            </div>
        </div>
    )
}

export default Planning;

