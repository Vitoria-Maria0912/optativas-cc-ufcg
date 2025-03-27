import React, { useState } from "react"
import "./style.css"
import Card from "../Card";
import DropZone from "../DropZone";

const Planning = ({ }) => {
    const [cards, setCards] = useState({
        periodo1: [],
        periodo2: [],
        periodo3: [],
        periodo4: [],
        periodo5: [],
        periodo6: [],
        periodo7: [],
        periodo8: [],
        periodo9: [],
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
                </div>
            ))}
        </div>
    )
}

export default Planning;

