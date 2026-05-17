import './HomeAffaris.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
    FiMenu, FiLogOut, FiUsers, FiClipboard,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaCheckCircle,
    FaTrophy,
    FaCalendarCheck,
    FaChartBar
} from "react-icons/fa";

// ─── Axios instance with auto token ──────────────────────────────────────────
const api = axios.create({
    baseURL: "https://ssis.runasp.net/api/v1",
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",  icon: FiClipboard },
    { label: "Students",  icon: FaGraduationCap },
    { label: "Teachers",  icon: FaChalkboardTeacher },
    { label: "Courses",   icon: FiUsers },
];

const ROUTE_MAP = {
    "/HomeAffaris":    "Overview",
    "/":               "Overview",
    "/StudentReview":  "Students",
    "/Teacher":        "Teachers",
    "/AffairsCourses": "Courses",
};

export default function HomeAffaris() {
    const navigate  = useNavigate();
    const location  = useLocation();

    const [active,      setActive]      = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [adminName,  setAdminName]  = useState(localStorage.getItem("userName")  || "Admin");
    const [adminEmail, setAdminEmail] = useState(localStorage.getItem("userEmail") || "admin@met.com");

    const [statCards,        setStatCards]        = useState([]);
    const [topStudentsTable, setTopStudentsTable] = useState([]);
    const [avgAttendance,    setAvgAttendance]    = useState(0);
    const [avgGrade,         setAvgGrade]         = useState(0);

    const [loading,   setLoading]   = useState(true);
    const [loadError, setLoadError] = useState("");

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/AffairsLogin");
    }, [navigate]);

    // ─── Sync active tab with route ───────────────────────────────────────────
    useEffect(() => {
        setActive(ROUTE_MAP[location.pathname] ?? "Overview");
    }, [location.pathname]);

    // ─── Fetch dashboard ──────────────────────────────────────────────────────
    useEffect(() => {

        const fetchDashboard = async () => {
            setLoading(true);
            setLoadError("");

            // 1️⃣ Must have a token
            const token = localStorage.getItem("token");
            if (!token) {
                setLoadError("No authentication token found. Please login again.");
                setLoading(false);
                setTimeout(handleLogout, 1500);
                return;
            }

            // 2️⃣ Check role saved at login time
            const role = (localStorage.getItem("userRole") || "").toLowerCase();
            const blockedRoles = ["student", "doctor"];
            if (blockedRoles.includes(role)) {
                setLoadError("Access denied. This page is for Affairs staff only.");
                setLoading(false);
                setTimeout(handleLogout, 2000);
                return;
            }

            try {
                const res = await api.get("/dashboard/admin");

                console.log("✅ Dashboard response:", res.data);

                // Normalise response shape
                let d = res.data?.data ?? res.data?.result ?? res.data?.payload ?? res.data;

                // Update name/email from API if available
                const apiName  = d.adminName || d.name  || d.fullName  || null;
                const apiEmail = d.adminEmail || d.email || null;

                if (apiName  && apiName  !== adminName)  { localStorage.setItem("userName",  apiName);  setAdminName(apiName); }
                if (apiEmail && apiEmail !== adminEmail) { localStorage.setItem("userEmail", apiEmail); setAdminEmail(apiEmail); }

                // Stat cards
                setStatCards([
                    { title: "Total Students",   value: String(d.totalStudents  ?? d.studentsCount ?? 0),   color: "#0EA5E9", icon: <FaGraduationCap /> },
                    { title: "Total Doctors",    value: String(d.totalDoctors   ?? d.doctorsCount  ?? 0),   color: "#00A6FF", icon: <FiUsers /> },
                    { title: "Pass Percentage",  value: `${d.passPercentage     ?? d.passRate      ?? 0}%`, color: "#00C2FF", icon: <FaCheckCircle /> },
                ]);

                // Top students
                const raw = d.topStudents || d.topPerformers || d.excellentStudents || d.bestStudents || [];
                setTopStudentsTable(
                    raw.slice(0, 10).map((s, i) => ({
                        rank:         i + 1,
                        studentId:    s.studentId    || s.id       || s.rollNumber  || "N/A",
                        name:         s.fullName     || s.name     || s.studentName || "N/A",
                        gpa:          s.gpa          || s.GPA      || 0,
                        totalCredits: s.totalCredits || s.credits  || 0,
                    }))
                );

                setAvgAttendance(d.averageAttendance ?? d.avgAttendance ?? d.attendanceRate ?? 0);
                setAvgGrade(     d.averageGrade      ?? d.avgGrade      ?? d.avgGPA         ?? 0);

            } catch (err) {

                console.error("❌ Dashboard Error:", err);
                const status = err.response?.status;

                if (status === 401) {
                    setLoadError("⚠️ Session expired. Redirecting to login…");
                    setTimeout(handleLogout, 1500);
                } else if (status === 403) {
                    setLoadError("🚫 Access denied (403). Your account does not have Admin permissions. Redirecting…");
                    setTimeout(handleLogout, 2500);
                } else if (!err.response || err.code === "ECONNABORTED") {
                    setLoadError("🌐 Network error — check your connection and try again.");
                } else {
                    setLoadError(`❌ Failed to load dashboard (${status ?? "unknown error"}).`);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, [handleLogout]);

    // ─── Sidebar nav ──────────────────────────────────────────────────────────
    const handleNav = (label) => {
        setSidebarOpen(false);
        const routes = {
            Overview: "/HomeAffaris",
            Students: "/StudentReview",
            Teachers: "/Teacher",
            Courses:  "/AffairsCourses",
        };
        if (routes[label]) navigate(routes[label]);
        else setActive(label);
    };

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

                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button className="adm-hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle sidebar">
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">{active}</div>
                    </div>

                    <div className="adm-topbarRight">
                        <div className="adm-user">
                            <div className="adm-userAvatar">🧑‍💼</div>
                            <div className="adm-userMeta">
                                <div className="adm-userName">{adminName}</div>
                                <div className="adm-userEmail">{adminEmail}</div>
                            </div>
                        </div>
                        <button className="adm-logoutPill" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <main className="adm-content">

                    <div className="adm-welcomeCard">
                        <div className="adm-welcomeText">
                            Welcome <span className="adm-welcomeBold">{adminName}</span>{" "}
                            <span className="adm-welcomeEmail">({adminEmail})</span>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: "18px" }}>
                            Loading Dashboard...
                        </div>
                    ) : loadError ? (
                        <div style={{ padding: 40, color: "red", textAlign: "center" }}>
                            <p>{loadError}</p>
                            {/* Only show retry for network errors, not auth errors */}
                            {!loadError.includes("403") && !loadError.includes("session") && !loadError.includes("denied") && (
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{ marginTop: 12, padding: "8px 24px", cursor: "pointer", borderRadius: 6, border: "1px solid #ccc" }}
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <section className="adm-statGrid">
                                {statCards.map((c, i) => (
                                    <div key={i} className="adm-statCard" style={{ borderColor: c.color }}>
                                        <div className="adm-statIcon" style={{ color: c.color }}>{c.icon}</div>
                                        <div className="adm-statInfo">
                                            <div className="adm-statTitle">{c.title}</div>
                                            <div className="adm-statValue">{c.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <section className="adm-panels">
                                <div className="adm-panelCard">
                                    <div className="adm-panelTitle">
                                        <FaTrophy style={{ marginRight: "8px" }} /> Top Students
                                    </div>
                                    <div className="adm-tableWrap">
                                        <table className="adm-table">
                                            <thead>
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Student ID</th>
                                                    <th>Student Name</th>
                                                    <th>GPA</th>
                                                    <th>Total Credits</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topStudentsTable.length > 0 ? (
                                                    topStudentsTable.map((s) => (
                                                        <tr key={s.rank}>
                                                            <td><strong>#{s.rank}</strong></td>
                                                            <td>{s.studentId}</td>
                                                            <td>{s.name}</td>
                                                            <td><strong>{s.gpa}</strong></td>
                                                            <td>{s.totalCredits}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="5" style={{ textAlign: "center" }}>No top students data available</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="adm-panelCard">
                                    <div className="adm-panelTitle">
                                        <FaChartBar style={{ marginRight: "8px" }} /> Average Performance
                                    </div>
                                    <div className="adm-averagePerformance">
                                        <div className="adm-avgCard">
                                            <div className="adm-avgIcon" style={{ color: "#10B981" }}><FaCalendarCheck /></div>
                                            <div className="adm-avgInfo">
                                                <div className="adm-avgTitle">Average Attendance</div>
                                                <div className="adm-avgValue">{avgAttendance}%</div>
                                            </div>
                                        </div>
                                        <div className="adm-avgCard">
                                            <div className="adm-avgIcon" style={{ color: "#4F7CFF" }}><FaChartBar /></div>
                                            <div className="adm-avgInfo">
                                                <div className="adm-avgTitle">Average Grade</div>
                                                <div className="adm-avgValue">{avgGrade}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>

            {sidebarOpen && (
                <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}