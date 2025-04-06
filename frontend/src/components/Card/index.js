import React from "react";
import "./style.css"
import Icon, { DeleteOutlined } from "@ant-design/icons";

const Card = ({card, period, highlight=false, canDelete=false, onHover=() => null, handleCardDelete=() => null, handleAddDiscipline=() => null}) => {
    const handleDragStart = e => {
        e.dataTransfer.setData("card", card.id)
        e.dataTransfer.setData("period", period)
    }

    return (
        
        <div className={`card ${highlight ? "highlighted" : ""}`}
            onMouseEnter={onHover}
            onClick={handleAddDiscipline}
            draggable onDragStart={e => handleDragStart(e)}>
            {canDelete ? <DeleteOutlined onClick={handleCardDelete} /> : <></>}
            <h3 className="title">{card.acronym}</h3>
        </div>
    )
}

export default Card;
