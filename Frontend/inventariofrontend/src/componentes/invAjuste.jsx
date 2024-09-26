import { useState, useEffect } from "react";
import '../hojas de estilo/crud.css';

export default function InventarioAjuste({ token }) {
  const [inventarioAjustes, setInventarioAjustes] = useState([]);
  const [productos, setProductos] = useState([]); // Para la relación con Producto
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState('');
  const [productoId, setProductoId] = useState('');
  const [tipoProceso, setTipoProceso] = useState('');
  const [razon, setRazon] = useState('');
  const [editandoAjuste, setEditandoAjuste] = useState(null);
  const [detallesAjuste, setDetallesAjuste] = useState(null);
  const [modoVista, setModoVista] = useState('listar');

  useEffect(() => {
    if (token && modoVista === 'listar') {
      fetch('http://127.0.0.1:8080/api/inventario/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setInventarioAjustes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los Ajustes de inventario: ', error);
        setLoading(false);
      });

      fetch('http://127.0.0.1:8080/api/producto/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));
    }
  }, [token, modoVista]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      cantidad: parseInt(cantidad),
      producto_id: parseInt(productoId),
      tipo_proceso: tipoProceso,
      razon: razon
    };
    
    const url = editandoAjuste ? 
      `http://127.0.0.1:8080/api/inventario/${editandoAjuste.id}/` : 
      'http://127.0.0.1:8080/api/inventario/';

    const method = editandoAjuste ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(dat => {
      if (editandoAjuste) {
        setInventarioAjustes(inventarioAjustes.map(item => item.id === dat.id ? dat : item));
        setEditandoAjuste(null); 
      } else {
        setInventarioAjustes([...inventarioAjustes, dat]);
      }
      setCantidad('');
      setProductoId('');
      setTipoProceso('');
      setRazon('');
      setModoVista('listar');
    })
    .catch(error => console.error('Error al crear/editar inventarioAjuste:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8080/api/inventario/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setInventarioAjustes(inventarioAjustes.filter(item => item.id !== id));
    })
    .catch(error => console.error('Error al eliminar inventarioAjuste:', error));
  };

  const handleEdit = (ajuste) => {
    setCantidad(ajuste.cantidad);
    setProductoId(ajuste.producto.id);
    setTipoProceso(ajuste.tipo_proceso);
    setRazon(ajuste.razon);
    setEditandoAjuste(ajuste);
    setModoVista('editar');
  };

  const handleDetalles = (ajuste) => {
    setDetallesAjuste(ajuste);
    setModoVista('detalles');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {modoVista === 'listar' && (
        <>
          <h2>Lista de Ajustes de Inventario</h2>
          <table className="tabla-con-datos">
            <thead>
              <tr>
                <th>Tipo Proceso</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Razón</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioAjustes.map((ajuste) => (
                <tr key={ajuste.id}>
                  <td>{ajuste.tipo_proceso}</td>
                  <td>{ajuste.producto.nombre}</td>
                  <td>{ajuste.cantidad}</td>
                  <td>{ajuste.razon}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleEdit(ajuste)}>Editar</button>
                    <button className="btn btn-info" onClick={() => handleDetalles(ajuste)}>Detalles</button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(ajuste.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nuevo Ajuste</button>
        </>
      )}

      {(modoVista === 'crear' || modoVista === 'editar') && (
        <>
          <h2>{editandoAjuste ? 'Editar Ajuste de Inventario' : 'Crear Nuevo Ajuste'}</h2>
          <form onSubmit={handleSubmit}>
            <select
              value={tipoProceso}
              onChange={(e) => setTipoProceso(e.target.value)}
              required
            >
              <option value="">Seleccionar Tipo de Proceso</option>
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
            >
              <option value="">Seleccionar Producto</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Razón"
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              {editandoAjuste ? 'Guardar Cambios' : 'Crear'}
            </button>
            <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modoVista === 'detalles' && detallesAjuste && (
        <>
          <h2>Detalles del Ajuste de Inventario</h2>
          <p><strong>Tipo de Proceso:</strong> {detallesAjuste.tipo_proceso}</p>
          <p><strong>Producto:</strong> {detallesAjuste.producto.nombre}</p>
          <p><strong>Cantidad:</strong> {detallesAjuste.cantidad}</p>
          <p><strong>Razón:</strong> {detallesAjuste.razon}</p>
          <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
            Volver
          </button>
        </>
      )}
    </>
  );
}
