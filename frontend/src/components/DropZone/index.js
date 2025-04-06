import React, { useState } from "react";
import "./style.css"

const DropZone = ({ targetPeriod, index, setCurrentPlanning }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const disciplineId = Number(e.dataTransfer.getData("card"));
        const sourcePeriod = e.dataTransfer.getData("period");

        if (!disciplineId || sourcePeriod === targetPeriod) return;

        setCurrentPlanning((prevPlanning) => {
            const newPeriods = prevPlanning.periods.map(period => ({
                ...period,
                disciplines: [...period.disciplines]
            }));

            const sourceIndex = newPeriods.findIndex(p => p.id === Number(sourcePeriod));
            const targetIndex = newPeriods.findIndex(p => p.id === targetPeriod);

            if (sourceIndex === -1 || targetIndex === -1) return prevPlanning;

            const sourceDisciplines = newPeriods[sourceIndex].disciplines;
            const disciplineToMove = sourceDisciplines.find(d => d.id === disciplineId);
            if (!disciplineToMove) return prevPlanning;

            newPeriods[sourceIndex].disciplines = sourceDisciplines.filter(d => d.id !== disciplineId);
            newPeriods[targetIndex].disciplines.splice(index, 0, disciplineToMove);

            return {
                ...prevPlanning,
                periods: newPeriods
            };
        });

        setIsDragging(false);
    };

    return (
        <div
            className={`drop-area drop-area-leave ${isDragging ? "drop-area-over" : "drop-area-teste"}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => setIsDragging(false)}
        >
        </div>
    );
};

export default DropZone;
