// import './HomeAffaris.css';
// import './Teacher.css';

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FiMenu,
    FiLogOut,
    FiUsers,
    FiClipboard,
    FiRefreshCw,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaCalendarAlt,
} from "react-icons/fa";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const SidebarItems = [
    { label: "Overview", icon: FiClipboard,        path: "/HomeAffaris"    },
    { label: "Students", icon: FaGraduationCap,    path: "/StudentReview"  },
    { label: "Courses",  icon: FiUsers,             path: "/AffairsCourses" },
    { label: "Tables",   icon: FaChalkboardTeacher, path: "/Teacher"        },
        { label: "Schedule", icon: FaCalendarAlt,      path: "/Sch"            },
];

// ─── Day label ────────────────────────────────────────────────────────────────

const DAY_NAMES = {
    0: "Sunday",
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
    Sunday:    "Sunday",
    Monday:    "Monday",
    Tuesday:   "Tuesday",
    Wednesday: "Wednesday",
    Thursday:  "Thursday",
    Friday:    "Friday",
    Saturday:  "Saturday",
};

function getDayName(val) {
    if (val === null || val === undefined) return "—";
    return DAY_NAMES[val] ?? String(val);
}

// Format "HH:mm:ss" → "HH:mm AM/PM"
function formatTime(t) {
    if (!t) return "—";
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sch() {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName]  = useState(localStorage.getItem("userName")  || "Admin");
    const [adminEmail] = useState(localStorage.getItem("userEmail") || "admin@met.com");

    const [schedule,  setSchedule]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        navigate("/AffairsLogin");
    };

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://ssis.runasp.net/api/v1/Schedules/my-schedule",
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );

            console.log("=== RAW SCHEDULE RESPONSE ===", JSON.stringify(res.data, null, 2));

            let data = res.data;
            if (data?.data)      data = data.data;
            if (data?.result)    data = data.result;
            if (data?.payload)   data = data.payload;
            if (data?.schedules) data = data.schedules;
            if (data?.schedule)  data = data.schedule;

            console.log("=== FIRST SCHEDULE ITEM ===", JSON.stringify(data?.[0], null, 2));

            setSchedule(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Schedule fetch error:", err);
            setError("Failed to load schedule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedule(); }, []);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="adm-root">

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="adm-brand">
                    <div className="adm-brandMark">FCI</div>
                    <div className="adm-brandText">Luxor</div>
                </div>
                <nav className="adm-nav">
                    {SidebarItems.map((it) => {
                        const Icon     = it.icon;
                        const isActive = location.pathname === it.path;
                        return (
                            <button
                                key={it.label}
                                className={`adm-navItem ${isActive ? "active" : ""}`}
                                type="button"
                                onClick={() => { setSidebarOpen(false); navigate(it.path); }}
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

            {/* ── Main ──────────────────────────────────────────────────────── */}
            <div className="adm-main">

                {/* Topbar */}
                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button className="adm-hamburger" onClick={() => setSidebarOpen(s => !s)}>
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">My Schedule</div>
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

                {/* Content */}
                <main className="adm-content">

                    {loading ? (
                        <div style={{ padding: 60, textAlign: "center", color: "#64748b", fontSize: 18 }}>
                            Loading schedule...
                        </div>

                    ) : error ? (
                        <div style={{ padding: 40, textAlign: "center" }}>
                            <div style={{ color: "#ef4444", marginBottom: 16, fontSize: 15 }}>{error}</div>
                            <button className="sch-retryBtn" onClick={fetchSchedule}>
                                <FiRefreshCw style={{ marginRight: 6 }} /> Retry
                            </button>
                        </div>

                    ) : (
                        <div className="adm-panelCard">

                            <div className="adm-panelTitle" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span>
                                    <FaCalendarAlt style={{ marginRight: 8 }} />
                                    Schedule ({schedule.length} {schedule.length === 1 ? "entry" : "entries"})
                                </span>
                                <button className="sch-retryBtn" onClick={fetchSchedule}>
                                    <FiRefreshCw style={{ marginRight: 6 }} /> Refresh
                                </button>
                            </div>

                            {schedule.length === 0 ? (
                                <div style={{ padding: "60px 40px", textAlign: "center", color: "#94a3b8" }}>
                                    <FaCalendarAlt style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }} />
                                    <div style={{ fontSize: 16 }}>No schedule entries found.</div>
                                </div>
                            ) : (
                                <div className="adm-tableWrap">
                                    <table className="adm-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Course</th>
                                                <th>Day</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                                <th>Room</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((item, index) => {

                                                // Support both camelCase and PascalCase field names
                                                const courseName =
                                                    item.courseName  ||
                                                    item.CourseName  ||
                                                    item.course?.name ||
                                                    item.Course?.Name ||
                                                    item.name        ||
                                                    item.Name        ||
                                                    "—";

                                                const day =
                                                    item.dayOfWeek   ??
                                                    item.DayOfWeek   ??
                                                    item.day         ??
                                                    item.Day         ??
                                                    null;

                                                const startTime =
                                                    item.startTime   ||
                                                    item.StartTime   ||
                                                    null;

                                                const endTime =
                                                    item.endTime     ||
                                                    item.EndTime     ||
                                                    null;

                                                const room =
                                                    item.room        ||
                                                    item.Room        ||
                                                    "—";

                                                return (
                                                    <tr key={item.id || item.Id || item._id || index}>
                                                        <td style={{ color: "#94a3b8", fontWeight: 500 }}>
                                                            {index + 1}
                                                        </td>
                                                        <td>
                                                            <strong style={{ color: "#1e293b" }}>
                                                                {courseName}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <span className="sch-dayBadge">
                                                                {getDayName(day)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="sch-timeBadge sch-timeBadge--start">
                                                                {formatTime(startTime)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="sch-timeBadge sch-timeBadge--end">
                                                                {formatTime(endTime)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="sch-roomBadge">
                                                                {room}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}