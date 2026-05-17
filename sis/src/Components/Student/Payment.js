import './HomeStudent.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

import {
    FiMenu, FiLogOut, FiClipboard, FiBookOpen,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",    icon: FiClipboard },
    { label: "Add Courses", icon: FaGraduationCap },
    { label: "Grades",      icon: FaChalkboardTeacher },
    { label: "Payment",     icon: FiBookOpen },
];

const NAV_ROUTES = {
    Overview:      "/HomeStudent",
    "Add Courses": "/AddCourses",
    Grades:        "/Grades",
    Payment:       "/Payment",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Payment() {

    const navigate = useNavigate();

    const [active,      setActive]      = useState("Payment");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studentName]                 = useState(localStorage.getItem("userName")  || "Student");
    const [studentEmail]                = useState(localStorage.getItem("userEmail") || "student@met.com");

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/StudentLogin");
    }, [navigate]);

    // ─── Sidebar nav ──────────────────────────────────────────────────────────
    const handleNav = (label) => {
        setSidebarOpen(false);
        setActive(label);
        if (NAV_ROUTES[label]) navigate(NAV_ROUTES[label]);
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="adm-root">

            {/* ── Sidebar ── */}
            <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="adm-brand">
                    <div className="adm-brandMark">FCI</div>
                    <div className="adm-brandText">Luxor</div>
                </div>
                <nav className="adm-nav">
                    {SidebarItems.map((it) => {
                        const Icon = it.icon;
                        return (
                            <button
                                key={it.label}
                                className={`adm-navItem ${active === it.label ? "active" : ""}`}
                                onClick={() => handleNav(it.label)}
                                type="button"
                            >
                                <span className="adm-navIcon"><Icon /></span>
                                <span className="adm-navLabel">{it.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="adm-sidebarBottom">
                    <button className="adm-logoutBtn" onClick={handleLogout}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="adm-main">

                {/* ── Topbar ── */}
                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button
                            className="adm-hamburger"
                            onClick={() => setSidebarOpen(s => !s)}
                            aria-label="Toggle sidebar"
                        >
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">Payment</div>
                    </div>
                    <div className="adm-topbarRight">
                        <div className="adm-user">
                            <div className="adm-userAvatar">🎓</div>
                            <div className="adm-userMeta">
                                <div className="adm-userName">{studentName}</div>
                                <div className="adm-userEmail">{studentEmail}</div>
                            </div>
                        </div>
                        <button className="adm-logoutPill" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* ── Page Content ── */}
                <main className="adm-content">
                    {/* Content goes here */}
                </main>

            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}