import React, { useState } from 'react';

const DisciplineForm = ({ onSubmit, submitText = "Submit" }) => {
    const [form, setForm] = useState({
        name: '',
      });
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
      
      const handleSubmit = (e) => {
        try {
          validate(form.name);
          e.preventDefault();
          onSubmit(form);          
        } catch (error) {
          alert(error.message);
        }
      };

      const validate = (name) => { if (!name) { throw new Error("Discipline's name cannot be empty!"); }}

    return (
        <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name or acronym" value={form.name} onChange={handleChange} />
        <button type="submit" style={{cursor: 'pointer', alignItems:'center'}}>{submitText}</button>
    </form>
    );
};

export default DisciplineForm;
    