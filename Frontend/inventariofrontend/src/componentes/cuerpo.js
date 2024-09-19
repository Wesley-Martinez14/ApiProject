
import {Link, Route, Routes} from 'react-router-dom';
import Categoria from './categoria';
import Suplidor from './suplidor';
import Producto from './producto';
import Cliente from './cliente';
import Venta from './venta';
import '../hojas de estilo/cuerpo-nav.css'

function Cuerpo({token}){
    return(
    <div className='nav-contenedor'>
        <nav>
            <ul>
                <li>
                    <Link className='nav-link' to="/">Inicio</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/categoria">Categorias</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/suplidor">Suplidores</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/producto">Productos</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/cliente">Clientes</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/venta">Ventas</Link>
                </li>
            </ul>
        </nav>
        <div className='cuerpo-nav'>
            <Routes>
                <Route path='/'/>
                <Route path='/categoria' element={<Categoria token={token} />}/>
                <Route path='/suplidor' element={<Suplidor token={token} />} />
                <Route path='/producto' element={<Producto token={token} />} />
                <Route path='/cliente' element={<Cliente token={token} />} />
                <Route path='/venta' element={<Venta token={token} />} />
            </Routes>
        </div>
    </div>
    )
}

export default Cuerpo;