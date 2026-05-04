import logo from "../../Images/logo.jpeg";

export default function Sidebar() {
    return (
        <>
        {/* زرار يظهر في الموبايل */}
        <button
            className="btn btn-primary d-md-none m-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
        >
            ☰
        </button>

        {/* Sidebar */}
        <div
            className="offcanvas-md offcanvas-start bg-dark text-white p-3"
            tabIndex="-1"
            id="sidebar"
        >
            {/* Header */}
            <div className="text-center mb-4">
            <img
                src={logo}
                alt="logo"
                className="img-fluid rounded mb-2"
                style={{ width: "80px" }}
            />
            <h3>FCI Luxor</h3>
            </div>

            {/* Menu */}
            <ul className="nav flex-column gap-2">

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Overview</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Assignments</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Internal Marks</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Semester Results</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Download Notes</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Pay Dues</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Dues & Approval</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Time Table</a>
            </li>

            <li className="nav-item">
                <a className="nav-link text-white" href="#">Circular</a>
            </li>

            </ul>
        </div>
        </>
    );
    }