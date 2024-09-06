
import {Link, Route, Routes} from 'react-router-dom';
import Categoria from './categoria';
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
            </ul>
        </nav>
        <div className='cuerpo-nav'>
            <Routes>
                <Route path='/'/>
                <Route path='/categoria' element={<Categoria token={token} />}/>
            </Routes>
        </div>
    </div>
    )
}

export default Cuerpo;