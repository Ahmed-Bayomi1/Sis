import './HomeStudent.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
    FiMenu, FiLogOut, FiUsers, FiClipboard, FiBookOpen, FiBell,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaCheckCircle,
    FaTimesCircle,
    FaChartLine,
    FaCalendarCheck,
    FaInfoCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const SidebarItems = [
    { label: "Overview",    icon: FiClipboard },
    { label: "Courses", icon: FaGraduationCap },      // ← single space (was double)
    { label: "Grades",      icon: FaChalkboardTeacher },
    { label: "Payment",     icon: FiBookOpen },
    { label: "Schedule",    icon: FaCalendarCheck },
];

const ROUTE_MAP = {
    "/HomeStudent": "Overview",
    "/":            "Overview",
};

const NAV_ROUTES = {
    Overview:      "/HomeStudent",
    "Courses": "/Courses",
    Grades:        "/Grades",
    Payment:       "/Payment",
    Schedule:      "/Sch",
};

// ─── GPA Pie Chart Component ──────────────────────────────────────────────────
function GPAPieChart({ gpa }) {

    const numericGpa = parseFloat(gpa) || 0;
    const remaining  = Math.max(0, 4 - numericGpa);

    const data = [
        { name: "GPA",       value: numericGpa },
        { name: "Remaining", value: remaining  },
    ];

    const gpaColor =
        numericGpa >= 3.5 ? "#4FBF6F" :
        numericGpa >= 2.5 ? "#4F86F7" :
        numericGpa >= 1.5 ? "#F7A24F" :
                            "#EF4444";

    const gpaLabel =
        numericGpa >= 3.5 ? "Excellent" :
        numericGpa >= 2.5 ? "Good"      :
        numericGpa >= 1.5 ? "Fair"      :
                            "Poor";

    const COLORS = [gpaColor, "#E2E8F0"];

    return (
        <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                                strokeWidth={0}
                            />
                        ))}
                    </Pie>

                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="-18" fill={gpaColor} fontSize="28" fontWeight="700">
                            {numericGpa.toFixed(2)}
                        </tspan>
                        <tspan x="50%" dy="22" fill="#64748b" fontSize="13">
                            out of 4.00
                        </tspan>
                        <tspan x="50%" dy="18" fill={gpaColor} fontSize="12" fontWeight="600">
                            {gpaLabel}
                        </tspan>
                    </text>

                    <Tooltip
                        formatter={(value, name) =>
                            name === "GPA"
                                ? [`${value.toFixed(2)} / 4.00`, "Your GPA"]
                                : [`${value.toFixed(2)}`, "Remaining"]
                        }
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// ─── Notification Item ────────────────────────────────────────────────────────
function NotificationItem({ notification }) {

    const typeConfig = {
        warning: { color: "#F59E0B", bg: "#FFFBEB", icon: <FaExclamationTriangle /> },
        success: { color: "#10B981", bg: "#ECFDF5", icon: <FaCheckCircle /> },
        info:    { color: "#3B82F6", bg: "#EFF6FF", icon: <FaInfoCircle /> },
        error:   { color: "#EF4444", bg: "#FEF2F2", icon: <FaTimesCircle /> },
    };

    const type   = notification.type?.toLowerCase() || "info";
    const config = typeConfig[type] || typeConfig.info;

    return (
        <div style={{
            display:      "flex",
            alignItems:   "flex-start",
            gap:          "12px",
            padding:      "14px 16px",
            borderRadius: "10px",
            background:   config.bg,
            borderLeft:   `4px solid ${config.color}`,
            marginBottom: "10px",
        }}>
            <span style={{ color: config.color, fontSize: "16px", marginTop: "2px", flexShrink: 0 }}>
                {config.icon}
            </span>
            <div style={{ flex: 1 }}>
                {notification.title && (
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B", marginBottom: "3px" }}>
                        {notification.title}
                    </div>
                )}
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                    {notification.message || notification.body || notification.text || "No message"}
                </div>
                {notification.date && (
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "5px" }}>
                        {new Date(notification.date).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeStudent() {

    const navigate = useNavigate();
    const location = useLocation();

    const [active,         setActive]        = useState("Overview");
    const [sidebarOpen,    setSidebarOpen]   = useState(false);
    const [studentName]                      = useState(localStorage.getItem("userName")  || "Student");
    const [studentEmail]                     = useState(localStorage.getItem("userEmail") || "student@met.com");
    const [statCards,      setStatCards]     = useState([]);
    const [gpa,            setGpa]           = useState(0);
    const [notifications,  setNotifications] = useState([]);
    const [loading,        setLoading]       = useState(true);
    const [loadError,      setLoadError]     = useState("");

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/StudentLogin");
    }, [navigate]);

    // ─── Sync active tab ──────────────────────────────────────────────────────
    useEffect(() => {
        setActive(ROUTE_MAP[location.pathname] ?? "Overview");
    }, [location.pathname]);

    // ─── Fetch dashboard ──────────────────────────────────────────────────────
    useEffect(() => {

        const fetchDashboard = async () => {

            setLoading(true);
            setLoadError("");

            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/StudentLogin");
                return;
            }

            try {

                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/dashboard/student",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                let d = res.data?.data ?? res.data?.result ?? res.data;

                // GPA
                const gpaValue = d.cgpa ?? d.CGPA ?? d.gpa ?? d.GPA ?? 0;
                setGpa(gpaValue);

                // Status
                const isSuccess = d.isSuccess ?? d.isPassed ?? d.passed ?? d.success ?? null;

                // Stat cards
                setStatCards([
                    {
                        title: "Courses Count",
                        value: d.coursesCount ?? d.courseCount ?? d.totalCourses ?? d.courses ?? "N/A",
                        icon:  <FiBookOpen />,
                        color: "#A855F7",
                    },
                    {
                        title: "Attendance",
                        value: `${d.attendancePercentage ?? d.attendance ?? d.attendanceRate ?? 0}%`,
                        icon:  <FaCalendarCheck />,
                        color: "#F7A24F",
                    },
                    {
                        title: "Status",
                        value: isSuccess === null ? "N/A" : isSuccess ? "Pass ✓" : "Fail ✗",
                        icon:  isSuccess ? <FaCheckCircle /> : <FaTimesCircle />,
                        color: isSuccess === null ? "#94A3B8" : isSuccess ? "#4FBF6F" : "#EF4444",
                    },
                ]);

                // Notifications
                const notifs =
                    d.notifications ??
                    d.Notifications ??
                    d.alerts        ??
                    d.messages      ??
                    [];

                setNotifications(notifs);

            } catch (err) {

                const status = err.response?.status;

                if (status === 401) {
                    setLoadError("Session expired. Redirecting to login…");
                    setTimeout(handleLogout, 1500);
                } else if (status === 403) {
                    setLoadError("Access denied. You don't have permission to view this page.");
                    setTimeout(handleLogout, 2000);
                } else if (err.code === "ECONNABORTED" || !err.response) {
                    setLoadError("Network error — please check your connection and try again.");
                } else {
                    setLoadError(`Failed to load dashboard (${status ?? "unknown error"}).`);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, [navigate, handleLogout]);

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

                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button
                            className="adm-hamburger"
                            onClick={() => setSidebarOpen(s => !s)}
                            aria-label="Toggle sidebar"
                        >
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">{active}</div>
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

                <main className="adm-content">

                    {loading ? (

                        <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: "18px" }}>
                            Loading dashboard...
                        </div>

                    ) : loadError ? (

                        <div style={{ padding: 40, color: "red", textAlign: "center" }}>
                            <p>{loadError}</p>
                            {!loadError.includes("expired") && !loadError.includes("denied") && (
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
                            {/* ── Stat Cards ── */}
                            <div className="adm-statGrid">
                                {statCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="adm-statCard"
                                        style={{ borderColor: card.color }}
                                    >
                                        <div className="adm-statIcon" style={{ color: card.color }}>
                                            {card.icon}
                                        </div>
                                        <div>
                                            <div className="adm-statTitle">{card.title}</div>
                                            <div className="adm-statValue" style={{ color: card.color }}>
                                                {card.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ── GPA Chart + Notifications ── */}
                            <div style={{
                                display:             "grid",
                                gridTemplateColumns: "1fr 2fr",
                                gap:                 "20px",
                                marginTop:           "20px",
                            }}>

                                {/* GPA Card */}
                                <div style={{
                                    background:    "#ffffff",
                                    borderRadius:  "16px",
                                    padding:       "24px 20px",
                                    boxShadow:     "0 2px 12px rgba(0,0,0,0.07)",
                                    display:       "flex",
                                    flexDirection: "column",
                                    alignItems:    "center",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", alignSelf: "flex-start" }}>
                                        <FaChartLine style={{ color: "#4F86F7", fontSize: "18px" }} />
                                        <span style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>
                                            GPA Status
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "0 0 8px 0", alignSelf: "flex-start" }}>
                                        Max GPA: 4.00
                                    </p>

                                    <GPAPieChart gpa={gpa} />

                                    {/* Legend */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "8px" }}>
                                        {[
                                            { label: "Excellent", range: "3.5 – 4.0", color: "#4FBF6F" },
                                            { label: "Good",      range: "2.5 – 3.4", color: "#4F86F7" },
                                            { label: "Fair",      range: "1.5 – 2.4", color: "#F7A24F" },
                                            { label: "Poor",      range: "0.0 – 1.4", color: "#EF4444" },
                                        ].map((item) => (
                                            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                                                <span style={{ color: "#475569", flex: 1 }}>{item.label}</span>
                                                <span style={{ color: "#94A3B8" }}>{item.range}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notifications Card */}
                                <div style={{
                                    background:    "#ffffff",
                                    borderRadius:  "16px",
                                    padding:       "24px",
                                    boxShadow:     "0 2px 12px rgba(0,0,0,0.07)",
                                    display:       "flex",
                                    flexDirection: "column",
                                }}>
                                    <div style={{
                                        display:        "flex",
                                        alignItems:     "center",
                                        justifyContent: "space-between",
                                        marginBottom:   "16px",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FiBell style={{ color: "#4F86F7", fontSize: "18px" }} />
                                            <span style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>
                                                Notifications
                                            </span>
                                            {notifications.length > 0 && (
                                                <span style={{
                                                    background:   "#4F86F7",
                                                    color:        "#fff",
                                                    fontSize:     "11px",
                                                    fontWeight:   "700",
                                                    borderRadius: "999px",
                                                    padding:      "2px 8px",
                                                }}>
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ overflowY: "auto", maxHeight: "340px", paddingRight: "4px" }}>
                                        {notifications.length > 0 ? (
                                            notifications.map((n, i) => (
                                                <NotificationItem key={i} notification={n} />
                                            ))
                                        ) : (
                                            <div style={{
                                                display:        "flex",
                                                flexDirection:  "column",
                                                alignItems:     "center",
                                                justifyContent: "center",
                                                padding:        "40px 20px",
                                                color:          "#94A3B8",
                                                gap:            "12px",
                                            }}>
                                                <FiBell style={{ fontSize: "40px", opacity: 0.3 }} />
                                                <p style={{ margin: 0, fontSize: "14px" }}>No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
            )}

        </div>
    );
}