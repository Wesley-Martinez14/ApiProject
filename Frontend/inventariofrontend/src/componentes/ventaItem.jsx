import { useState, useEffect } from "react";
import '../hojas de estilo/crud.css';

export default function VentaItem({ token }) {
  const [ventaItems, setVentaItems] = useState([]);
  const [ventas, setVentas] = useState([]); 
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState('');
  const [ventaId, setVentaId] = useState(''); 
  const [productoId, setProductoId] = useState('');
  const [precio, setPrecio] = useState('');
  const [editandoVentaItem, setEditandoVentaItem] = useState(null); 
  const [detallesVentaItem, setDetallesVentaItem] = useState(null); 
  const [modoVista, setModoVista] = useState('listar');

  useEffect(() => {
    if (token && modoVista === 'listar') {
      fetch('http://127.0.0.1:8080/api/ventaitem/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setVentaItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los ventaItems: ', error);
        setLoading(false);
      });

      fetch('http://127.0.0.1:8080/api/venta/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => setVentas(data))
      .catch(error => console.error('Error al obtener ventas:', error));

      
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
      venta_id: parseInt(ventaId),  
      producto_id: parseInt(productoId),
      precio: parseFloat(precio) 
    };
    
    const url = editandoVentaItem ? 
      `http://127.0.0.1:8080/api/ventaitem/${editandoVentaItem.id}/` : 
      'http://127.0.0.1:8080/api/ventaitem/';

    const method = editandoVentaItem ? 'PUT' : 'POST';

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
      if (editandoVentaItem) {
        setVentaItems(ventaItems.map(item => item.id === dat.id ? dat : item));
        setEditandoVentaItem(null); 
      } else {
        setVentaItems([...ventaItems, dat]);
      }
     
      setCantidad('');
      setVentaId('');
      setProductoId('');
      setPrecio(''); 
      setModoVista('listar'); 
    })
    .catch(error => console.error('Error al crear/editar ventaItem:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8080/api/ventaitem/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setVentaItems(ventaItems.filter(item => item.id !== id));
    })
    .catch(error => console.error('Error al eliminar ventaItem:', error));
  };

  const handleEdit = (ventaItem) => {
    setCantidad(ventaItem.cantidad);
    setVentaId(ventaItem.venta.id); 
    setProductoId(ventaItem.producto.id);
    setPrecio(ventaItem.precio); 
    setEditandoVentaItem(ventaItem); 
    setModoVista('editar');
  };

  const handleDetalles = (ventaItem) => {
    console.log('Detalles del VentaItem:', ventaItem);
    setDetallesVentaItem(ventaItem);
    setModoVista('detalles');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {modoVista === 'listar' && (
        <>
          <h2>Lista de VentaItems</h2>
          <table className="tabla-con-datos">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Venta (ID - Fecha)</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventaItems.map((ventaItem) => (
                <tr key={ventaItem.id}>
                  <td>{ventaItem.cantidad}</td>
                  <td>{ventaItem.venta}</td>
                  <td>{ventaItem.producto.nombre}</td>
                  <td>{ventaItem.precio}</td> 
                  <td>
                    <button className="btn btn-success" onClick={() => handleEdit(ventaItem)}>Editar</button>
                    <button className="btn btn-info" onClick={() => handleDetalles(ventaItem)}>Detalles</button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(ventaItem.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nuevo VentaItem</button>
        </>
      )}

      {(modoVista === 'crear' || modoVista === 'editar') && (
        <>
          <h2>{editandoVentaItem ? 'Editar VentaItem' : 'Crear Nuevo VentaItem'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            <select
              value={ventaId}
              onChange={(e) => setVentaId(e.target.value)}
              required
            >
              <option value="">Seleccionar Venta</option>
              {ventas.map(venta => (
                <option key={venta.id} value={venta.id}>
                  {venta.id} - {new Date(venta.fecha).toLocaleDateString()}
                </option>
              ))}
            </select>
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
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              {editandoVentaItem ? 'Guardar Cambios' : 'Crear'}
            </button>
            <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modoVista === 'detalles' && detallesVentaItem && (
        <>
          <h2>Detalles del VentaItem</h2>
          <p><strong>Cantidad:</strong> {detallesVentaItem.cantidad}</p>
          <p><strong>Venta:</strong> {detallesVentaItem.venta}</p>
          <p><strong>Producto:</strong> {detallesVentaItem.producto.nombre}</p>
          <p><strong>Precio:</strong> {detallesVentaItem.precio}</p> {/* Mostrar precio en detalles */}
          <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
            Volver
          </button>
        </>
      )}
    </>
  );
}
