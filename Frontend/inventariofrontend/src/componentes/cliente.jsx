import { useState, useEffect } from "react";
import '../hojas de estilo/crud.css';

export default function Cliente({ token }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [editandoCliente, setEditandoCliente] = useState(null); 
  const [detallesCliente, setDetallesCliente] = useState(null); 
  const [modoVista, setModoVista] = useState('listar'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (token && modoVista === 'listar') {
      fetch('http://127.0.0.1:8080/api/cliente/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los clientes: ', error);
        setLoading(false);
      });
    }
  }, [token, modoVista]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editandoCliente ? 
      `http://127.0.0.1:8080/api/cliente/${editandoCliente.id}/` : 
      'http://127.0.0.1:8080/api/cliente/';

    const method = editandoCliente ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellido, telefono, email, direccion })
    })
    .then(response => response.json())
    .then(data => {
      if (editandoCliente) {
        setClientes(clientes.map(cli => cli.id === data.id ? data : cli));
        setEditandoCliente(null); 
      } else {
        setClientes([...clientes, data]);
      }
      setNombre('');
      setApellido('');
      setTelefono('');
      setEmail('');
      setDireccion('');
      setModoVista('listar');
    })
    .catch(error => console.error('Error al crear/editar cliente:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8080/api/cliente/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    })
    .catch(error => console.error('Error al eliminar cliente:', error));
  };

  const handleEdit = (cliente) => {
    setNombre(cliente.nombre);
    setApellido(cliente.apellido);
    setTelefono(cliente.telefono);
    setEmail(cliente.email);
    setDireccion(cliente.direccion);
    setEditandoCliente(cliente); 
    setModoVista('editar');
  };

  const handleDetalles = (cliente) => {
    setDetallesCliente(cliente);
    setModoVista('detalles');
  };
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentCliente = clientes.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(clientes.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {modoVista === 'listar' && (
        <>
          <h2>Lista de Clientes</h2>
          <table className="tabla-con-datos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCliente.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.direccion}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleEdit(cliente)}>Editar</button>
                    <button className="btn btn-info" onClick={() => handleDetalles(cliente)}>Detalles</button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nuevo Cliente</button>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(clientes.length / itemsPerPage)}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {(modoVista === 'crear' || modoVista === 'editar') && (
        <>
          <h2>{editandoCliente ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
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
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">{editandoCliente ? 'Guardar Cambios' : 'Crear'}</button>
            <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>Cancelar</button>
          </form>
        </>
      )}

      {modoVista === 'detalles' && detallesCliente && (
        <>
          <h2>Detalles del Cliente</h2>
          <p><strong>Nombre:</strong> {detallesCliente.nombre}</p>
          <p><strong>Apellido:</strong> {detallesCliente.apellido}</p>
          <p><strong>Teléfono:</strong> {detallesCliente.telefono}</p>
          <p><strong>Email:</strong> {detallesCliente.email}</p>
          <p><strong>Dirección:</strong> {detallesCliente.direccion}</p>
          <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>Volver</button>
        </>
      )}
    </>
  );
}
