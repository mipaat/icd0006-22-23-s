import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../routes/Root";
import IdentityHeader from "./IdentityHeader";

const Header = () => {
    const { jwt } = useContext(AuthContext);

    const AdminDropdown = () => {
        if (!jwt?.isAdmin) return <></>
        return (
            <div className="btn-group">
                <button type="button" className="btn btn-danger dropdown-toggle"
                data-bs-toggle="dropdown" aria-expanded="false">
                    ADMIN
                </button>
                <ul className="dropdown-menu">
                    <li className="nav-item">
                        <Link to="" className="dropdown-item nav-link text-dark">
                            TODO Manage users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="" className="dropdown-item nav-link text-dark">
                            TODO Manage queue items
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">VideoArchiver</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-dark">Home</Link>
                            </li>
                            <li>
                                <Link to="">TODO: Videos search</Link>
                            </li>
                            <AdminDropdown />
                        </ul>

                        <ul className="navbar-nav">
                            <IdentityHeader />
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;