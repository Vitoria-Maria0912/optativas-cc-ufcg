import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Trash2 } from 'lucide-react';
import { getOneDisciplineByAcronymRoute, getOneDisciplineByNameRoute, patchDisciplineRoute } from '../../../../routes/DisciplineRoutes';

const DisciplinePatchForm = () => {

  const [form, setForm] = useState({
    id: 0,
    type: 'OBRIGATORY',
    name: '',
    acronym: '',
    available: true,
    description: '',
    pre_requisites: [],
    post_requisites: [],
    professor: 'Undefined',
    schedule: 'Undefined',
  });

  const getDisciplineByAcronym = async (acronym) => { return (await getOneDisciplineByAcronymRoute(acronym));}
  const getDisciplineByName = async (name) => { return (await getOneDisciplineByNameRoute(name));};

  const getOneDiscipline = async (input) => { 
    try {
      const discipline = (await getDisciplineByAcronym(input.target.value)) ?? (await getDisciplineByName(input.target.value));
      alert(discipline.message);
      setForm(discipline);
      
    } catch (error) { 
      const data = error.response.data;
      alert("Error: " + (data.error ?? data.message ?? "Server is not running!")); 
    }
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = (await patchDisciplineRoute(form.id)).data;
      alert(response.message);
    } catch (error) { 
      const data = error.response.data;
      alert("Error: " + (data.error ?? data.message ?? "Server is not running!")); 
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [showPreRequisites, setShowPreRequisites] = useState(false);
  const [showProfessor, setShowProfessor] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPostRequisites, setShowPostRequisites] = useState(false);

  const handlePreRequisiteChange = (index, value) => {
    const updatedPreRequisites = [...form.pre_requisites];
    updatedPreRequisites[index] = value;
    setForm({ ...form, pre_requisites: updatedPreRequisites });
  };

  const addPreRequisiteField = () => {
    setShowPreRequisites(true);
    setForm({ ...form, pre_requisites: [...form.pre_requisites, ''] });
  };

  const removePreRequisiteField = (index) => {
    const updatedPreRequisites = form.pre_requisites.filter((_, i) => i !== index);
    setForm({ ...form, pre_requisites: updatedPreRequisites });
  };

  const handlePostRequisiteChange = (index, value) => {
    const updatedPostRequisites = [...form.post_requisites];
    updatedPostRequisites[index] = value;
    setForm({ ...form, post_requisites: updatedPostRequisites });
  };

  const addPostRequisiteField = () => {
    setShowPostRequisites(true);
    setForm({ ...form, post_requisites: [...form.post_requisites, ''] });
  };

  const removePostRequisiteField = (index) => {
    const updatedPostRequisites = form.post_requisites.filter((_, i) => i !== index);
    setForm({ ...form, post_requisites: updatedPostRequisites });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-discipline-form">
        <div className='form-group find=discipline'>
          <label>Nome ou acronym: </label>
          <input name="name" placeholder="name or acronym" value={form.name} onChange={getOneDiscipline} /> 
        </div>
        
        <div className="form-group">

          <label>Nome: </label>
          <input name="name" placeholder="example 1" value={form.name} onChange={handleChange} />
          <label>Sigla: </label>
          <input name="acronym" placeholder="e1" value={form.acronym} onChange={handleChange} />

          <div id='description-label'>
            <label>Descrição: </label>
            <textarea 
                name="description" placeholder="Digite uma descrição..."
                value={form.description} onChange={handleChange} rows={5} 
            />
          </div>
        </div>

        <div className="form-group-2">
            
          <div id='available-label'>
            <label>
              Disponível: {" "}
              <select name="available" value={form.available} onChange={handleChange}>
                <option value="YES">Sim</option>
                <option value="NO">Não</option>
              </select>
            </label>
          </div>

          <div id='type-label'>
            <label>
              Tipo: {" "} 
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="OBRIGATORY">Obrigatória</option>
                <option value="OPTATIVE">Optativa</option>
              </select>
            </label>
          </div>

          <label id='professor-label'>
            Professor: {" "}
            <select name="professor" onChange={(e) => { handleChange(e);
                                                        setShowProfessor(e.target.value !== "Undefined");
              }}>
            <option value="Undefined">Indefinido</option>
            <option value=''>Outro</option>
            </select>
            {showProfessor && ( <input name="professor" placeholder="professor" value={form.professor} 
                              onChange={(e) => {setForm({ ...form, professor: e.target.value })}} /> )}
          </label>

          <label id='schedule-label'>
            Horário: {" "} 
            <select name="schedule" onChange={(e) => { handleChange(e); 
                                                      setShowSchedule(e.target.value !== "Undefined")
            }}>
              <option value="Undefined">Indefinido</option>
              <option value="">Outro</option>
            </select>
            {showSchedule && ( <input name="schedule" placeholder="schedule" value={form.schedule} 
                              onChange={(e) => {setForm({ ...form, schedule: e.target.value })}} /> )}
          </label>
        </div>

        <button className='pre-req-button' type="button" onClick={addPreRequisiteField}><PlusCircleOutlined/> Pré requisitos</button>

        <div style={{ display: showPreRequisites ? 'block' : 'none'}}> {form.pre_requisites.map((preReq, index) => (
          <div className='pre-req' key={index}>
              <input
                type="text"
                placeholder="Pre requisite"
                value={preReq}
                onChange={(e) => handlePreRequisiteChange(index, e.target.value)}
                />
              <button className='remove-req' style={{background: 'transparent'}} type="button" 
                  onClick={() => removePreRequisiteField(index)}>
                  <div style={{fontSize: ''}} className='trash-icon'><Trash2/></div>
              </button>
            </div>
          ))}
        </div>

        <button className='post-req-button' type="button" onClick={addPostRequisiteField}><PlusCircleOutlined/> Pós requisitos</button>

        <div style={{ display: showPostRequisites ? 'block' : 'none'}}> {form.post_requisites.map((postReq, index) => (
            <div className="post-req" key={index}>
              <input
                type="text"
                placeholder="Post requisite"
                value={postReq}
                onChange={(e) => handlePostRequisiteChange(index, e.target.value)}
                />
              <button className='remove-req' style={{background: 'transparent'}}type="button" 
                  onClick={() => removePostRequisiteField(index)}>
                  <div className='trash-icon'><Trash2/></div>
              </button>
            </div>
          ))}
        </div>
        <button style={{ margin: 17, display: 'flex', marginTop: 100, justifyContent: 'center' }} type="submit">Save discipline</button>
      </form>
    </div>

  );
};

export default DisciplinePatchForm;
    