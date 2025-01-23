import { Link } from "react-router-dom";
import style from './navbar.module.css';

function Navbar(){
    return(
        <header className={style.container}>
            <div className={style.logo}>
                <Link to="/">
                    <img src="/img/logofitflex.PNG" alt="logo" className={style.imagem}/>
                </Link>
            </div>
            <nav>
                <ul className={style.list}>
                    <li>
                        <Link to = "/">Home</Link>
                    </li>
                    <li>
                        <Link to = "/about">Sobre Nós</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}export default Navbar;