import './HomeAffaris.css';
import './Teacher.css';

import {
    useNavigate,
    useLocation
} from 'react-router-dom';

import { useEffect, useState } from "react";
import axios from "axios";

import {
    FiMenu,
    FiLogOut,
    FiUsers,
    FiClipboard,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaTrophy
} from "react-icons/fa";

const SidebarItems = [
    {
        label: "Overview",
        icon: FiClipboard,
        path: "/HomeAffaris"
    },
    {
        label: "Students",
        icon: FaGraduationCap,
        path: "/StudentReview"
    },
    {
        label: "Teachers",
        icon: FaChalkboardTeacher,
        path: "/Teacher"
    },
    {
        label: "Courses",
        icon: FiUsers,
        path: "/AffairsCourses"
    },
];

export default function Teacher() {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [adminName] = useState(
        localStorage.getItem("userName") || "Admin"
    );

    const [adminEmail] = useState(
        localStorage.getItem("userEmail") || "admin@met.com"
    );

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");

        navigate("/AffairsLogin");
    };

    // Fetch Teachers
    useEffect(() => {

        const fetchTeachers = async () => {

            try {

                setLoading(true);
                setLoadError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    setLoadError("No token found. Please login again.");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/admin/doctors",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                let data = res.data;

                if (data.data) data = data.data;
                if (data.result) data = data.result;
                if (data.payload) data = data.payload;
                if (data.teachers) data = data.teachers;

                setTeachers(Array.isArray(data) ? data : []);

            } catch (err) {

                console.error(err);
                setLoadError("Failed to load teachers list.");

            } finally {

                setLoading(false);
            }
        };

        fetchTeachers();

    }, []);

    return (

        <div className="adm-root">

            {/* Sidebar */}
            <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>

                <div className="adm-brand">

                    <div className="adm-brandMark">
                        FCI
                    </div>

                    <div className="adm-brandText">
                        Luxor
                    </div>

                </div>

                <nav className="adm-nav">

                    {SidebarItems.map((it) => {

                        const Icon = it.icon;

                        // Active item based on current route
                        const isActive = location.pathname === it.path;

                        return (

                            <button
                                key={it.label}
                                className={`adm-navItem ${isActive ? "active" : ""}`}
                                type="button"
                                onClick={() => {

                                    setSidebarOpen(false);

                                    navigate(it.path);
                                }}
                            >

                                <span className="adm-navIcon">
                                    <Icon />
                                </span>

                                <span className="adm-navLabel">
                                    {it.label}
                                </span>

                            </button>
                        );
                    })}

                </nav>

                <div className="adm-sidebarBottom">

                    <button
                        className="adm-logoutBtn"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <div className="adm-main">

                {/* Topbar */}
                <header className="adm-topbar">

                    <div className="adm-topbarLeft">

                        <button
                            className="adm-hamburger"
                            onClick={() => setSidebarOpen(s => !s)}
                        >
                            <FiMenu />
                        </button>

                        <div className="adm-topbarTitle">
                            Teachers List
                        </div>

                    </div>

                    <div className="adm-topbarRight">

                        <div className="adm-user">

                            <div className="adm-userAvatar">
                                🧑‍💼
                            </div>

                            <div className="adm-userMeta">

                                <div className="adm-userName">
                                    {adminName}
                                </div>

                                <div className="adm-userEmail">
                                    {adminEmail}
                                </div>

                            </div>

                        </div>

                        <button
                            className="adm-logoutPill"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>

                {/* Page Content */}
                <main className="adm-content">

                    <div className="adm-welcomeCard">

                        <div className="adm-welcomeText">
                            List of all registered teachers
                        </div>

                    </div>

                    {loading ? (

                        <div
                            style={{
                                padding: 40,
                                textAlign: "center",
                                color: "#64748b",
                                fontSize: "18px"
                            }}
                        >
                            Loading teachers...
                        </div>

                    ) : loadError ? (

                        <div
                            style={{
                                padding: 40,
                                color: "red",
                                textAlign: "center"
                            }}
                        >
                            {loadError}
                        </div>

                    ) : (

                        <div className="adm-panelCard">

                            <div className="adm-panelTitle">
                                <FaTrophy style={{ marginRight: "8px" }} />
                                Teachers ({teachers.length})
                            </div>

                            <div className="adm-tableWrap">

                                <table className="adm-table">

                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {teachers.length > 0 ? (

                                            teachers.map((teacher) => (

                                                <tr key={teacher.id || teacher._id}>

                                                    <td>
                                                        <strong>
                                                            {teacher.fullName}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {teacher.email}
                                                    </td>

                                                    <td>
                                                        {
                                                            teacher.phone ||
                                                            teacher.phoneNumber ||
                                                            teacher.mobile ||
                                                            teacher.mobileNumber ||
                                                            teacher.fullNumber ||
                                                            teacher.contactNumber ||
                                                            teacher.telephone ||
                                                            "Not Provided"
                                                        }
                                                    </td>

                                                </tr>
                                            ))

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        textAlign: "center",
                                                        padding: "40px"
                                                    }}
                                                >
                                                    No teachers found.
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}