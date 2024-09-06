import { useState, useEffect } from "react";
import '../hojas de estilo/categoria.css'

function Categoria({ token }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoCategoria, setEditandoCategoria] = useState(null); 

  useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8080/api/categoria/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las categorías: ', error);
        setLoading(false);
      });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editandoCategoria ? 
      `http://127.0.0.1:8080/api/categoria/${editandoCategoria.id}/` : 
      'http://127.0.0.1:8080/api/categoria/';

    const method = editandoCategoria ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, descripcion })
    })
    .then(response => response.json())
    .then(data => {
      if (editandoCategoria) {

        setCategorias(categorias.map(cat => cat.id === data.id ? data : cat));
        setEditandoCategoria(null); 
      } else {
        setCategorias([...categorias, data]);
      }

      setNombre('');
      setDescripcion('');
    })
    .catch(error => console.error('Error al crear/editar categoría:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8080/api/categoria/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setCategorias(categorias.filter(categoria => categoria.id !== id));
    })
    .catch(error => console.error('Error al eliminar categoría:', error));
  };

  const handleEdit = (categoria) => {
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setEditandoCategoria(categoria); 
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>{editandoCategoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">{editandoCategoria ? 'Guardar Cambios' : 'Crear'}</button>
      </form>

      <h2>Lista de Categorías</h2>
      <table className="tabla-con-datos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>
                <button className="btn btn-success" onClick={() => handleEdit(categoria)}>Editar</button>
                <button className="btn btn-secondary" onClick={() => handleDelete(categoria.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categoria;
