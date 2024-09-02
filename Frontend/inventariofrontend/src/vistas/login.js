import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import '../hojas de estilo/login.css';

function Login(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const submit = async(e) => {
        e.preventDefault();

        const loginData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/login/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();

            if(response.ok){
                console.log("login exitoso", data);

                localStorage.setItem('token', data.token);
                props.onLogin();
                navigate('/');
            }
            else{
                setError("Credenciales incorrectas");
                console.error("Error en el login", data);
            }
        }
        catch(error){
            setError("Error en la solicitud");
            console.error("Error en la solicitud", error);
        }
    };

    return(
        <form onSubmit={submit}>
            <div className="contenedor-login-principal">
                <div className="campos-login">
                    <label htmlFor="username">
                        Nombre de usuario: 
                    </label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="campos-login">
                    <label htmlFor="password">
                        Contraseña: 
                    </label>
                    <input type="password"
                    id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="campos-login-boton">
                    {error && <p>{error}</p>}
                    <button type="submit" className="btn btn-primary">Iniciar sesion</button>
                </div>  
            </div>
        </form>
    )
}

export default Login;