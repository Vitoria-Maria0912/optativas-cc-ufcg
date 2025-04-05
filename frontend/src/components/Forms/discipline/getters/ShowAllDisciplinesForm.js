import React, { useEffect, useState } from 'react';
import { deleteDisciplineRoute, getAllDisciplinesRoute, getOneDisciplineByNameRoute } from '../../../../routes/DisciplineRoutes';
import { useNavigate } from 'react-router-dom';
import { toPascalCase } from './ShowOneDisciplineForm.js'
import './style.css';
import { SquarePen, Trash2 } from 'lucide-react';

const ShowAllDisciplinesForm =  () => {
  const PAGE_SIZE = 5;

  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchDisciplines = async () => {
    try {
      const response = await getAllDisciplinesRoute(page * PAGE_SIZE, PAGE_SIZE);
      setCards(response.data.disciplines);
      setTotal(response.data.total);
    } catch (error) { 
      const data = error.response.data;
      alert("Error: " + (data.error ?? data.message ?? "Server is not running!")); 
    }
  };

  useEffect(() => { fetchDisciplines(); }, [page]);

  const handleDelete = async (acronym, id) => {
    if (window.confirm(`Tem certeza que deseja deletar ${ acronym }?`)) {
      try {
        const response = await deleteDisciplineRoute(id);
        alert(response.data.message);
      } catch (error) { 
        const data = error.response.data;
        alert("Error: " + (data.error ?? data.message ?? "Server is not running!")); 
      }
    }
  };

  const handlePatch = async () => { navigate('/disciplines/update'); }

  const filteredCards = cards.filter(
    (discipline) => discipline.name.toLowerCase().includes(filter.toLowerCase()) ||
                    discipline.acronym.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE) || 0;

  return (
    <div className="get-all-disciplines">
      <input
        placeholder="Filtrar por nome ou sigla"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '95%' }}
      />

      {filteredCards.map((card, index) => (
        <div key={index} className="discipline-card">
          <div>
          ({toPascalCase(card.type)}) <strong>{card.name}</strong> ({card.acronym})
          </div>
          <div className='buttons-put-delete-discipline' style={{padding: '0.5rem'}}>
            <button id='delete-discipline' className='trash-icon' onClick={() => handleDelete(card.acronym, card.id)}><Trash2/></button>
            <button id='patch-discipline' className='edit-icon' onClick={handlePatch}><SquarePen/></button>
          </div>
        </div>
      ))}

      <div className='pagination'>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))} disabled={page + 1 >= totalPages}>Próxima</button>
      </div>
    </div>
)};

export default ShowAllDisciplinesForm;