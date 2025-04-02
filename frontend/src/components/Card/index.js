import React from "react";
import "./style.css"
import Icon, { DeleteOutlined } from "@ant-design/icons";

const Card = ({card, period}) => {
    const handleDragStart = e => {
        e.dataTransfer.setData("card", card)
        e.dataTransfer.setData("period", period)
    }

    return (
        <div className="card"
            draggable onDragStart={e => handleDragStart(e)}>
            <DeleteOutlined />
            <h3 className="title">{card}</h3>
        </div>
    )
}

export default Card;
