import React, { useEffect, useState, useRef } from 'react';
import './CrearUsuario.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

const CrearUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const intervalRef = useRef();

  useEffect(() => {
    obtenerUsuarios();
    intervalRef.current = setInterval(obtenerUsuarios, 10000); // auto-actualiza cada 10s
    return () => clearInterval(intervalRef.current);
  }, []);


  const exportarCSV = () => {
    const encabezados = ['Nombre', 'Correo'];
    const filas = usuarios.map(u => [u.name, u.email]);
    let csv = encabezados.join(',') + '\n';
    filas.forEach(fila => {
      csv += fila.map(campo => '"' + (campo ? String(campo).replace(/"/g, '""') : '') + '"').join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'usuarios.csv');
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usuarios.map(u => ({
      'Nombre': u.name,
      'Correo': u.email
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'usuarios.xlsx');
  };
  const exportarPDF = () => {
    const body = [
      ['Nombre', 'Correo'],
      ...usuarios.map(u => [u.name, u.email])
    ];
    const docDefinition = {
      content: [
        { text: 'Lista de Usuarios', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
    pdfMake.createPdf(docDefinition).download('usuarios.pdf');
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/usuarios');
      // Eliminar duplicados por id
      const unicos = Array.isArray(res.data)
        ? res.data.filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i)
        : [];
      setUsuarios(unicos);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email) {
      setError('El nombre y el correo son obligatorios.');
      return;
    }

    const nombreExiste = usuarios.some(u => u.name.trim().toLowerCase() === form.name.trim().toLowerCase() && u.id !== editId);
    const correoExiste = usuarios.some(u => u.email.trim().toLowerCase() === form.email.trim().toLowerCase() && u.id !== editId);
    if (nombreExiste && correoExiste) {
      setError('El nombre de usuario y el correo ya existen, elija otros.');
      return;
    } else if (nombreExiste) {
      setError('El nombre de usuario ya existe, elija otro.');
      return;
    } else if (correoExiste) {
      setError('El correo ya está registrado, elija otro.');
      return;
    }
    // Solo validar contraseña si el campo está lleno
    if (form.password && form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      if (editId) {
        const updateData = {};
        if (form.name) updateData.name = form.name;
        if (form.email) updateData.email = form.email;
        if (form.password) updateData.password = form.password;
        await axios.put(`http://localhost:8000/api/usuarios/${editId}`, updateData);
        setSuccess('Usuario actualizado correctamente.');
      } else {
        await axios.post('http://localhost:8000/api/usuarios', form);
        setSuccess('Usuario creado correctamente.');
      }
      setUsuarios([]);
      await obtenerUsuarios();
      setForm({ name: '', email: '', password: '' });
      setEditId(null);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError('Verifica los datos ingresados. El correo debe ser único y la contraseña de al menos 6 caracteres.');
      } else {
        setError('Error al guardar usuario.');
      }
    }
  };

  const handleEdit = (usuario) => {
    setForm({ name: usuario.name, email: usuario.email, password: '' });
    setEditId(usuario.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:8000/api/usuarios/${id}`);
  setUsuarios([]);
  await obtenerUsuarios();
        setSuccess('Usuario eliminado correctamente.');
      } catch (err) {
        setError('Error al eliminar usuario.');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Crear Usuario</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-usuario">
        <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="input-usuario" />
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} className="input-usuario" />
        <input type="password" name="password" placeholder={editId ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={form.password} onChange={handleChange} className="input-usuario" />
        <button type="submit" className={editId ? 'btn-editar' : 'btn-guardar'}>
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setForm({ name: '', email: '', password: '' }); setEditId(null); setError(''); setSuccess(''); }} className="btn-cancelar">
            Cancelar
          </button>
        )}
      </form>
      {error && <div className="mensaje-error">{error}</div>}
      {success && <div className="mensaje-exito">{success}</div>}

      <hr />

      <div className="cuadro-lista-usuarios" style={{background:'#fff', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', padding:'20px', marginBottom:'20px'}}>
        <div className="lista-header">
          <h3 className="lista-title">Lista de Usuarios</h3>
          <div className="lista-botones">
            <button className="btn-actualizar-reporte" onClick={obtenerUsuarios}>Actualizar lista</button>
            <button className="btn-exportar-reporte" onClick={exportarCSV}>Exportar CSV</button>
            <button className="btn-exportar-reporte" onClick={exportarExcel}>Exportar Excel</button>
            <button className="btn-exportar-reporte" onClick={exportarPDF}>Exportar PDF</button>
          </div>
        </div>
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="acciones-cell">
                  <div className="acciones-container">
                    <button onClick={() => handleEdit(u)} className="btn-editar">
                      <span className="btn-icon">✎</span> Editar
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="btn-eliminar">
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

export default CrearUsuario;
