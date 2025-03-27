import React, { useState } from "react";
import "./style.css"

const DropZone = ({targetPeriod, index, setCards}) => {
    const [isDragging, setIsDragging] = useState(false)
    
    const handleDragOver = e => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDrop = e => {
        e.preventDefault();
        
        const card = e.dataTransfer.getData("card");
        const period = e.dataTransfer.getData("period");
    
        if (!card || period === targetPeriod) return;
        
        setCards(prevCards => {
            const updatedCards = { ...prevCards };
    
            updatedCards[period] = updatedCards[period].filter(currentCard => currentCard !== card);
            
            const newPeriodCards = [...updatedCards[targetPeriod]];
            newPeriodCards.splice(index, 0, card); 
            
            updatedCards[targetPeriod] = newPeriodCards;
            
            return updatedCards;
        });

        setIsDragging(false)
    };
    
    return (
        <div className={`drop-area  drop-area-leave ${isDragging ? "drop-area-over" : "drop-area-teste" }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={_ => setIsDragging(false)}
        >
        </div>
    )
}

export default DropZone;
