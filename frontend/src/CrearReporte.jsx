import React, { useEffect, useState, useRef } from 'react';
import './CrearReporte.css';
import axios from 'axios';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

const CrearReporte = () => {
  const [reportes, setReportes] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    autor: ''
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const intervalRef = useRef();

  useEffect(() => {
    obtenerReportes();
    intervalRef.current = setInterval(obtenerReportes, 10000); // auto-actualiza cada 10s
    return () => clearInterval(intervalRef.current);
  }, []);

  const obtenerReportes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/reportes');
      setReportes(res.data);
    } catch (err) {
      console.error('Error al obtener reportes:', err);
    }
  };

  const exportarCSV = () => {
    const encabezados = ['Título', 'Descripción', 'Fecha', 'Autor'];
    const filas = reportes.map(r => [r.titulo, r.descripcion, r.fecha, r.autor]);
    let csv = encabezados.join(',') + '\n';
    filas.forEach(fila => {
      csv += fila.map(campo => '"' + (campo ? String(campo).replace(/"/g, '""') : '') + '"').join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reportes.csv');
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportes.map(r => ({
      'Título': r.titulo,
      'Descripción': r.descripcion,
      'Fecha': r.fecha,
      'Autor': r.autor
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'reportes.xlsx');
  };

  const exportarPDF = () => {
    const body = [
      ['Título', 'Descripción', 'Fecha', 'Autor'],
      ...reportes.map(r => [r.titulo, r.descripcion, r.fecha, r.autor])
    ];
    const docDefinition = {
      content: [
        { text: 'Lista de Reportes', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 'auto', '*'],
            body
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
    pdfMake.createPdf(docDefinition).download('reportes.pdf');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.titulo || !form.descripcion || !form.fecha || !form.autor) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    
    const tituloExiste = reportes.some(r => r.titulo.trim().toLowerCase() === form.titulo.trim().toLowerCase() && r.id !== editId);
    const descripcionExiste = reportes.some(r => r.descripcion.trim().toLowerCase() === form.descripcion.trim().toLowerCase() && r.id !== editId);
    if (tituloExiste && descripcionExiste) {
      setError('El título y la descripción del reporte ya existen, elija otros.');
      return;
    } else if (tituloExiste) {
      setError('El título del reporte ya existe, elija otro.');
      return;
    } else if (descripcionExiste) {
      setError('La descripción del reporte ya existe, elija otra.');
      return;
    }
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/reportes/${editId}`, form);
        setSuccess('Reporte actualizado correctamente.');
      } else {
        await axios.post('http://localhost:8000/api/reportes', form);
        setSuccess('Reporte creado correctamente.');
      }
      obtenerReportes();
      setForm({ titulo: '', descripcion: '', fecha: '', autor: '' });
      setEditId(null);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError('Verifica los datos ingresados. Todos los campos son obligatorios.');
      } else {
        setError('Error al guardar reporte.');
      }
    }
  };

  const handleEdit = (reporte) => {
    setForm({
      titulo: reporte.titulo,
      descripcion: reporte.descripcion,
      fecha: reporte.fecha,
      autor: reporte.autor
    });
    setEditId(reporte.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este reporte?')) {
      try {
        await axios.delete(`http://localhost:8000/api/reportes/${id}`);
        obtenerReportes();
        setSuccess('Reporte eliminado correctamente.');
      } catch (err) {
        setError('Error al eliminar reporte.');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Crear Reporte</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-reporte">
        <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} className="input-reporte" />
        <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="input-reporte" />
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="input-reporte" />
        <input type="text" name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} className="input-reporte" />
        <button type="submit" className={editId ? 'btn-editar-reporte' : 'btn-guardar-reporte'}>
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setForm({ titulo: '', descripcion: '', fecha: '', autor: '' }); setEditId(null); setError(''); setSuccess(''); }} className="btn-cancelar-reporte">
            Cancelar
          </button>
        )}
      </form>
      <hr />
      <div className="cuadro-lista-reportes" style={{background:'#fff', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', padding:'20px', marginBottom:'20px'}}>
        <div className="lista-header">
          <h3 className="lista-title">Lista de Reportes</h3>
          <div className="lista-botones">
            <button className="btn-actualizar-reporte" onClick={obtenerReportes}>Actualizar lista</button>
            <button className="btn-exportar-reporte" onClick={exportarCSV}>Exportar CSV</button>
            <button className="btn-exportar-reporte" onClick={exportarExcel}>Exportar Excel</button>
            <button className="btn-exportar-reporte" onClick={exportarPDF}>Exportar PDF</button>
          </div>
        </div>
        {error && <div className="mensaje-error-reporte">{error}</div>}
        {success && <div className="mensaje-exito-reporte">{success}</div>}
        <table className="tabla-reportes">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes
              .filter(r => r.titulo && r.descripcion && r.fecha && r.autor)
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.titulo}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.fecha}</td>
                  <td>{r.autor}</td>
                  <td className="acciones-cell">
                    <div className="acciones-container">
                      <button onClick={() => handleEdit(r)} className="btn-editar-reporte">
                        <span className="btn-icon">✎</span> Editar
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="btn-eliminar-reporte">
                        <span className="btn-icon">✕</span> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
  </table>
      </div>
    </div>
  );
};

export default CrearReporte;
