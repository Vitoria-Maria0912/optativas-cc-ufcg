/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { getAllDisciplinesRoute } from '../../../routes/DisciplineRoutes';

const ShowAllDisciplinesForm =  () => {
const [disciplines, setDisciplines] = useState([]);

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const response = await getAllDisciplinesRoute(page * PAGE_SIZE, PAGE_SIZE);
      setDisciplines(response.data.disciplines);
      setTotal(response.data.total);
    } catch (error) { 
        const data = error.response.data;
        alert("Error: " + (data.error ?? data.message ?? "Server is not running!")); 
    }
    };

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <ul>
        {disciplines.map((d, index) => (
          <li key={index}>{d.name} ({d.acronym})</li>
        ))}
      </ul>

      <div style={{ marginTop: '48rem', position: 'relative', display: 'flex', justifyContent: 'space-evenly'}}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))} disabled={page + 1 >= totalPages}>
          Próxima
        </button>
      </div>
    </div>
)};

export default ShowAllDisciplinesForm;