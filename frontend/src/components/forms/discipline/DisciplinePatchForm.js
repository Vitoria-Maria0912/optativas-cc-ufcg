import React, { useState } from 'react';

const DisciplinePatchForm = ({ onSubmit, submitText = "Submit" }) => {
    const [form, setForm] = useState({
        name: '',
        field: '',
        value: '',
      });
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
      
      const handleSubmit = (e) => {
        try {
          validate(form.name, form.value);
          e.preventDefault();
          onSubmit(form);          
        } catch (error) {
          alert(error.message);
        }
      };

      const validate = (name, value) => { 
        if (!name) { throw new Error("Discipline's name cannot be empty!"); }
        if (!value) { throw new Error("Discipline's field value cannot be empty!"); }
      }

    return (
        <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <label>
          Field:
          <select name="field" value={form.field} onChange={handleChange}>
            <option value="name"> Name </option>
            <option value="acronym"> Acronym </option>
            <option value="available"> Available </option>
            <option value="description"> Description </option>
            <option value="pre_requisites"> Pre_requisites </option>
            <option value="post_requisites"> Post_requisites </option>
            <option value="teacher"> Teacher </option>
            <option value="schedule"> Schedule </option>
          </select>
        </label>
        <input name="value" placeholder="Value" value={form.value} onChange={handleChange} />        
        <button type="submit" style={{cursor: 'pointer', alignItems:'center'}}>{submitText}</button>
    </form>
    );
    // <button onClick={() => handlePatch(selectedDiscipline)} style={{ marginTop: '0.5rem' }}>Update field</button>
};

export default DisciplinePatchForm;
    