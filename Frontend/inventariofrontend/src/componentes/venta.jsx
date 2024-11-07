import { useState, useEffect } from "react";
import '../hojas de estilo/crud.css';

export default function Venta({token}) {
    const [venta, setVenta] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteid, setClienteId] = useState('');
    const [fecha, setFecha] = useState('');
    const [monto_total, setMontoTotal] = useState('');
    const [modovista, setModoVista] = useState('listar');
    const [editandoVenta, setEditandoVenta] = useState(null);
    const [detalleVenta, setDetallesVenta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        if(token && modovista === 'listar'){
            fetch('http://127.0.0.1:8080/api/venta/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                setVenta(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener las ventas: ', error);
                setLoading(false);
            });
            fetch('http://127.0.0.1:8080/api/cliente/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => setClientes(data))
            .catch(error => console.error('Error al obtener los clientes: ', error));
        }
    }, [token, modovista]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            cliente_id: parseInt(clienteid),
            fecha,
            monto_total
        };

        const url = editandoVenta ?
        `http://127.0.0.1:8080/api/venta/${editandoVenta.id}/`:
        'http://127.0.0.1:8080/api/venta/';

        const method = editandoVenta ? 'PUT' : 'POST';

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
            if(editandoVenta) {
                setVenta(venta.map(vent => vent.id === dat.id ? dat : vent));
                setEditandoVenta(null);
            } else {
                setVenta([...venta, dat]);
            }
            setClienteId('');
            setFecha('');
            setMontoTotal('');
            setModoVista('listar');
        })
        .catch(error => console.error('Error al crear/editar venta:', error));
    };

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8080/api/venta/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            setVenta(venta.filter(venta => venta.id !== id));
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    };
    const handleEdit = (venta) => {
        setClienteId(venta.cliente.id);
        setFecha(venta.fecha);
        setMontoTotal(venta.monto_total);
        setEditandoVenta(venta);
        setModoVista('editar');
    }
    const handleDetalles = (venta) => {
        setDetallesVenta(venta);
        setModoVista('detalles');
    };

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentVenta = venta.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNextPage = () => {
      if (currentPage < Math.ceil(venta.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    if(loading) {
        return <div>Cargando...</div>
    }

    return(
        <>
            {modovista === 'listar' && (
                <>
                <h2>Lista de Productos</h2>
                <table className="tabla-con-datos">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Monto total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVenta.map((venta) => (
                      <tr key={venta.id}>
                        <td>{venta.cliente.nombre}</td>
                        <td>{venta.fecha}</td>
                        <td>{venta.monto_total}</td>
                        <td>
                          <button className="btn btn-success" onClick={() => handleEdit(venta)}>Editar</button>
                          <button className="btn btn-info" onClick={() => handleDetalles(venta)}>Detalles</button>
                          <button className="btn btn-secondary" onClick={() => handleDelete(venta.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nueva Venta</button>
                <div className="pagination">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>Página {currentPage}</span>
                  <button onClick={handleNextPage} disabled={currentPage === Math.ceil(venta.length / itemsPerPage)}>
                    Siguiente
                  </button>
                </div>
              </>
            )}
            {(modovista === 'crear' || modovista === 'editar') && (
                <>
                  <h2>{editandoVenta ? 'Editar Venta' : 'Crear Nueva Venta'}</h2>
                  <form onSubmit={handleSubmit}>
                    <select 
                      value={clienteid}
                      onChange={(e) => setClienteId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un Cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </option>
                      ))}
                    </select>
                    <input 
                      type="date" 
                      value={fecha} 
                      onChange={(e) => setFecha(e.target.value)} 
                      required 
                    />
                    <input 
                      type="number" 
                      placeholder="Monto Total" 
                      value={monto_total} 
                      onChange={(e) => setMontoTotal(e.target.value)} 
                      required 
                    />
                    <button className="btn btn-primary" type="submit">
                      {editandoVenta ? 'Guardar Cambios' : 'Crear'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
                      Cancelar
                    </button>
                  </form>
                </>
            )}

            {modovista === 'detalles' && detalleVenta && (
                <>
                  <h2>Detalles de la Venta</h2>
                  <p><strong>Cliente:</strong> {detalleVenta.cliente.nombre} {detalleVenta.cliente.apellido}</p>
                  <p><strong>Fecha:</strong> {detalleVenta.fecha}</p>
                  <p><strong>Monto Total:</strong> {detalleVenta.monto_total}</p>
                  <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
                    Volver
                  </button>
                </>
            )}          
        </>
    )
}