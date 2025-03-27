import React from 'react';

const toPascalCase = (str) => str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));

const ShowOneDiscipline =  ({selectedDiscipline}) => {
    return (    
        <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
            <h2>Discipline Details</h2>
            <p><strong>Type:</strong> {toPascalCase(selectedDiscipline.type)}</p>
            <p><strong>Name:</strong> {selectedDiscipline.name}</p>
            <p><strong>Acronym:</strong> {selectedDiscipline.acronym}</p>
            <p><strong>Available:</strong> {toPascalCase(selectedDiscipline.available)}</p>
            <p><strong>Description:</strong> {selectedDiscipline.description}</p>
            <p><strong>Teacher:</strong> {selectedDiscipline.teacher}</p>
            <p><strong>Schedule:</strong> {selectedDiscipline.schedule}</p>

            {selectedDiscipline.pre_requisites?.length > 0 && (
            <div>
                <strong>Pre-Requisites:</strong>
                <ul>
                {selectedDiscipline.pre_requisites.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
                </ul>
            </div>
            )}
            
            {selectedDiscipline.post_requisites?.length > 0 && (
            <div>
                <strong>Post-Requisites:</strong>
                <ul>
                {selectedDiscipline.post_requisites.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
                </ul>
            </div>
            )}
        </div>
)}

export default ShowOneDiscipline;
export { toPascalCase };