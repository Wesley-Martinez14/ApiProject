import { useState, useEffect } from "react"
import '../hojas de estilo/crud.css'

export default function Suplidor({token}){
    const [suplidor, setSuplidor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombre, setNombre] = useState('');
    const [nombre_contacto, setNombreContacto] = useState('');
    const [numero, setNumero] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion]= useState('');
    const [editarSuplidor, setEditarSuplidor] = useState(null);
    const [detallesSuplidor, setDetallesSuplidor] = useState(null);
    const [modoVista, setModoVista] = useState('listar');

    useEffect(() => {
        if(token && modoVista === 'listar'){
            fetch('http://127.0.0.1:8080/api/suplidor/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(respone => respone.json())
            .then(data => {
                setSuplidor(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los suplidores: ', error)
                setLoading(false);
            })
        }
    }, [token, modoVista]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const url = editarSuplidor ?
        `http://127.0.0.1:8080/api/suplidor/${editarSuplidor.id}/`:
        `http://127.0.0.1:8080/api/suplidor/`;

      const method = editarSuplidor ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nombre, nombre_contacto, numero, email, direccion})
      })
      .then(response => response.json())
      .then(data => {
        if(editarSuplidor){
          setSuplidor(suplidor.map(sup => sup.id === data.id ? data : sup));
          setEditarSuplidor(null);
        } else {
          setSuplidor([...suplidor, data]);
        }
        setNombre('');
        setNombreContacto('');
        setNumero('');
        setDireccion('');
        setEmail('');
        setModoVista('listar');
      })
      .catch(error => console.error('Error al crear/editar suplidor: ', error))
    }

    const handleDelete = (id) => {
      fetch(`http://127.0.0.1:8080/api/suplidor/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setSuplidor(suplidor.filter(suplidor => suplidor.id !== id))
      })
      .catch(error => console.error('Error al eliminar categoria: ', error));
    };

    const handleEdit = (suplidor) => {
      setNombre(suplidor.nombre);
      setNombreContacto(suplidor.nombre_contacto);
      setNumero(suplidor.numero);
      setEmail(suplidor.email);
      setDireccion(suplidor.direccion);
      setEditarSuplidor(suplidor);
      setModoVista('editar');
    };

    const handleDetalles = (suplidor) => {
      setDetallesSuplidor(suplidor);
      setModoVista('detalles');
    };

    if (loading) {
      return <div>Cargando...</div>;
    }

    return(
    <>
      {modoVista === 'listar' && (
        <>
        <h2>Lista de Suplidores</h2>
        <table className="tabla-con-datos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>nombre_contacto</th>
              <th>Numero</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suplidor.map((suplidor) => (
              <tr key={suplidor.id}>
                <td>{suplidor.nombre}</td>
                <td>{suplidor.nombre_contacto}</td>
                <td>{suplidor.numero}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleEdit(suplidor)}>Editar</button>
                  <button className="btn btn-info" onClick={() => handleDetalles(suplidor)}>Detalles</button>
                  <button className="btn btn-secondary" onClick={() => handleDelete(suplidor.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nueva Suplidor</button>
      </>
      )}

      {(modoVista === 'crear' || modoVista === 'editar') && (
        <>
          <h2>{editarSuplidor ? 'Editar Suplidor' : 'Crear Nuevo Suplidor'}</h2>
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
              placeholder="Nombre del contacto"
              value={nombre_contacto}
              onChange={(e) => setNombreContacto(e.target.value)}
              required
            />
            <input 
              type="text"
              placeholder="Numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
            <input 
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="text"
              placeholder="Direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">{editarSuplidor ? 'Guardar Cambios' : 'Crear'}</button>
            <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>Cancelar</button>
          </form>
        </>
      )}

      {modoVista === 'detalles' && detallesSuplidor &&(
        <>
          <h2>Detalles del suplidor</h2>
          <p><strong>Nombre:</strong> {detallesSuplidor.nombre}</p>
          <p><strong>Nombre del contacto:</strong> {detallesSuplidor.nombre_contacto}</p>
          <p><strong>Numero:</strong> {detallesSuplidor.numero}</p>
          <p><strong>Email:</strong> {detallesSuplidor.email}</p>
          <p><strong>Direccion:</strong> {detallesSuplidor.direccion}</p>
          <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>Volver</button>
        </>
      )}
    </>
    );
}

