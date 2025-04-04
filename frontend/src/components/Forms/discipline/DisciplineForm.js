import React, { useState } from 'react';
import { getOneDisciplineByNameRoute, getOneDisciplineByAcronymRoute } from '../../../routes/DisciplineRoutes'

const DisciplineForm = ({ onSubmit, submitText = "Submit" }) => {
    const [form, setForm] = useState({
        name: '',
      });
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          validate(form.name);
          const data = await getOneDisciplineByNameRoute(form.name).catch();
          const data2 = await getOneDisciplineByAcronymRoute(form.name).catch();

          if (data.data || data2.data) { alert("sucesso"); onSubmit(data.data || data2.data); }

        } catch (error) {
          alert(error.message);
        }
      };

      const validate = (name) => { if (!name) { throw new Error("Discipline's name cannot be empty!"); }}

    return (
        <div className='get-one-discipline'>
          <form onSubmit={handleSubmit}>
          <input style={{}} 
                 name="name" placeholder="Name or acronym" value={form.name} onChange={handleChange} />
          <button style={{cursor: 'pointer', alignItems:'center'}} type="submit">{submitText}</button>
          </form>
        </div>
    );
};

export default DisciplineForm;
    