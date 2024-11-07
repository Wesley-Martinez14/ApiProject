import { useState, useEffect } from "react";
import '../hojas de estilo/crud.css';

export default function Producto({ token }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [suplidores, setSuplidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [suplidorId, setSuplidorId] = useState('');
  const [editandoProducto, setEditandoProducto] = useState(null); 
  const [detallesProducto, setDetallesProducto] = useState(null); 
  const [modoVista, setModoVista] = useState('listar');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (token && modoVista === 'listar') {

      fetch('http://127.0.0.1:8080/api/producto/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los productos: ', error);
        setLoading(false);
      });

      fetch('http://127.0.0.1:8080/api/categoria/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error al obtener categorías:', error));

      fetch('http://127.0.0.1:8080/api/suplidor/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => setSuplidores(data))
      .catch(error => console.error('Error al obtener suplidores:', error));
    }
  }, [token, modoVista]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
        nombre,
        categoria_id: parseInt(categoriaId),  
        suplidor_id: parseInt(suplidorId),   
        precio: parseFloat(precio),   
        cantidad_disponible: parseInt(cantidad),
        descripcion
      };
      
    const url = editandoProducto ? 
      `http://127.0.0.1:8080/api/producto/${editandoProducto.id}/` : 
      'http://127.0.0.1:8080/api/producto/';

    const method = editandoProducto ? 'PUT' : 'POST';

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
      if (editandoProducto) {
        setProductos(productos.map(prod => prod.id === dat.id ? dat : prod));
        setEditandoProducto(null); 
      } else {
        setProductos([...productos, dat]);
      }
      setNombre('');
      setCategoriaId('');
      setSuplidorId('');
      setPrecio('');
      setCantidad('');
      setDescripcion('');
      setModoVista('listar'); 
    })
    .catch(error => console.error('Error al crear/editar producto:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8080/api/producto/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setProductos(productos.filter(producto => producto.id !== id));
    })
    .catch(error => console.error('Error al eliminar producto:', error));
  };

  const handleEdit = (producto) => {
    setNombre(producto.nombre);
    setCategoriaId(producto.categoria.id);
    setSuplidorId(producto.suplidor.id);
    setPrecio(producto.precio);
    setCantidad(producto.cantidad_disponible);
    setDescripcion(producto.descripcion);
    setEditandoProducto(producto); 
    setModoVista('editar');
  };

  const handleDetalles = (producto) => {
    setDetallesProducto(producto);
    setModoVista('detalles');
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(productos.length / itemsPerPage)) {
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
          <h2>Lista de Productos</h2>
          <table className="tabla-con-datos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Suplidor</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria.nombre}</td>
                  <td>{producto.suplidor.nombre}</td>
                  <td>{producto.precio}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleEdit(producto)}>Editar</button>
                    <button className="btn btn-info" onClick={() => handleDetalles(producto)}>Detalles</button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(producto.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => setModoVista('crear')}>Crear Nuevo Producto</button>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(productos.length / itemsPerPage)}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {(modoVista === 'crear' || modoVista === 'editar') && (
        <>
          <h2>{editandoProducto ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Seleccionar Categoría</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <select
              value={suplidorId}
              onChange={(e) => setSuplidorId(e.target.value)}
              required
            >
              <option value="">Seleccionar Suplidor</option>
              {suplidores.map(suplidor => (
                <option key={suplidor.id} value={suplidor.id}>
                  {suplidor.nombre}
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
            <input
              type="number"
              placeholder="Cantidad Disponible"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              {editandoProducto ? 'Guardar Cambios' : 'Crear'}
            </button>
            <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modoVista === 'detalles' && detallesProducto && (
        <>
          <h2>Detalles del Producto</h2>
          <p><strong>Nombre:</strong> {detallesProducto.nombre}</p>
          <p><strong>Categoría:</strong> {detallesProducto.categoria.nombre}</p>
          <p><strong>Suplidor:</strong> {detallesProducto.suplidor.nombre}</p>
          <p><strong>Precio:</strong> {detallesProducto.precio}</p>
          <p><strong>Cantidad Disponible:</strong> {detallesProducto.cantidad_disponible}</p>
          <p><strong>Descripción:</strong> {detallesProducto.descripcion}</p>
          <button className="btn btn-secondary" onClick={() => setModoVista('listar')}>Volver

          </button>
        </>
      )}
    </>
  );
}

