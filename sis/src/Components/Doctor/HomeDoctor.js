import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
    FiMenu, FiLogOut, FiClipboard, FiBookOpen, FiUsers,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaChartBar,
} from "react-icons/fa";

// ─── Embedded styles ──────────────────────────────────────────────────────────
const STYLES = `
  .adm-root {
    display: flex;
    min-height: 100vh;
    background: #f3f5f8;
    font-family: Arial, Helvetica, sans-serif;
  }

  .adm-sidebar {
    width: 260px;
    background: #ffffff;
    border-right: 1px solid #e6e9ef;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .adm-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    padding: 10px 0 4px;
  }

  .adm-brandMark {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    color: #fff;
    font-weight: 900;
  }

  .adm-brandText {
    font-weight: 900;
    letter-spacing: 0.5px;
  }

  .adm-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
    padding-right: 4px;
  }

  .adm-navItem {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    color: #5b6675;
    font-weight: 700;
    cursor: pointer;
    transition: 0.15s ease;
    text-align: left;
  }

  .adm-navItem .adm-navIcon {
    font-size: 16px;
    color: #6b7280;
    display: inline-flex;
  }

  .adm-navItem.active {
    background: #0ea5e9;
    color: #fff;
    border-color: #0ea5e9;
  }

  .adm-navItem.active .adm-navIcon {
    color: #fff;
  }

  .adm-navItem:hover:not(.active) {
    background: #f6f8fb;
    border-color: #eef1f6;
  }

  .adm-sidebarBottom {
    margin-top: auto;
  }

  .adm-logoutBtn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #e6e9ef;
    padding: 10px 12px;
    border-radius: 12px;
    color: #ef4444;
    cursor: pointer;
    font-weight: 900;
  }

  .adm-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .adm-topbar {
    height: 62px;
    background: #f8fafc;
    border-bottom: 1px solid #e6e9ef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .adm-topbarLeft {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .adm-hamburger {
    width: 44px;
    height: 44px;
    display: none;
    align-items: center;
    justify-content: center;
    background: #e0f2fe;
    color: #0891b2;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }

  .adm-topbarTitle {
    font-weight: 900;
    color: #374151;
    font-size: 17px;
  }

  .adm-topbarRight {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .adm-user {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid #eef1f6;
  }

  .adm-userAvatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #fde68a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .adm-userMeta {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }

  .adm-userName {
    font-weight: 900;
    color: #111827;
    font-size: 13px;
  }

  .adm-userEmail {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }

  .adm-logoutPill {
    background: #06b6d4;
    border: none;
    padding: 10px 14px;
    border-radius: 10px;
    color: #fff;
    font-weight: 900;
    cursor: pointer;
  }

  .adm-content {
    padding: 22px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  /* ── Stat cards ── */
  .adm-statGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 22px;
  }

  .adm-statCard {
    background: #ffffff;
    border-radius: 18px;
    border: 2px solid transparent;
    padding: 18px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  .adm-statIcon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .adm-statTitle {
    color: #64748b;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .adm-statValue {
    margin-top: 4px;
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
  }

  /* ── Grade distribution card ── */
  .adm-gradeCard {
    background: #ffffff;
    border-radius: 18px;
    border: 1px solid #e6e9ef;
    padding: 22px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .adm-gradeCardHeader {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .adm-gradeCardTitle {
    font-weight: 900;
    font-size: 16px;
    color: #0f172a;
  }

  .adm-gradeCardSubtitle {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .adm-gradeRow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .adm-gradeLabel {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 15px;
    flex-shrink: 0;
  }

  .adm-gradeBarWrap {
    flex: 1;
    background: #f1f5f9;
    border-radius: 999px;
    height: 12px;
    overflow: hidden;
  }

  .adm-gradeBar {
    height: 100%;
    border-radius: 999px;
    transition: width 0.7s cubic-bezier(.4,0,.2,1);
  }

  .adm-gradeCount {
    font-weight: 800;
    font-size: 14px;
    color: #334155;
    min-width: 80px;
    text-align: right;
  }

  /* ── Loading / Error ── */
  .adm-centerMsg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #64748b;
    font-size: 16px;
    gap: 14px;
    text-align: center;
  }

  .adm-retryBtn {
    padding: 8px 24px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    font-weight: 700;
    color: #334155;
  }

  .adm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 199;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .adm-statGrid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 820px) {
    .adm-hamburger { display: flex; }
    .adm-sidebar {
      position: fixed;
      left: 0; top: 0;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform 0.2s ease;
      height: 100vh;
      width: 260px;
    }
    .adm-sidebar.open { transform: translateX(0); }
    .adm-root { position: relative; }
    .adm-user { display: none; }
    .adm-statGrid { grid-template-columns: 1fr; }
  }
`;

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",     icon: FiClipboard         },
    { label: "Courses", icon: FaGraduationCap     },
    { label: "Grades",       icon: FaChalkboardTeacher  },
    { label: "Payment",      icon: FiBookOpen           },
];

const ROUTE_MAP = {
    "/HomeDoctor": "Overview",
    "/":           "Overview",
};

const NAV_ROUTES = {
    Overview:       "/HomeDoctor",
    Courses:        "/Coursesa",
    Grades:         "/DoctorGrades",
    Payment:        "/DoctorPayment",
};

// ─── Grade display config ─────────────────────────────────────────────────────
const GRADE_CONFIG = [
    { key: "a", label: "A", color: "#10b981", bg: "#ecfdf5" },
    { key: "b", label: "B", color: "#3b82f6", bg: "#eff6ff" },
    { key: "c", label: "C", color: "#f59e0b", bg: "#fffbeb" },
];

// ─── Build stat cards from API response ───────────────────────────────────────
function buildStatCards(d) {
    return [
        {
            title: "Course Count",
            value: d.courseCount      ?? d.coursesCount    ?? d.totalCourses   ?? "N/A",
            icon:  <FaGraduationCap />,
            color: "#8b5cf6",
            bg:    "rgba(139,92,246,0.10)",
        },
        {
            title: "Student Count",
            value: d.studentCount     ?? d.studentsCount   ?? d.totalStudents  ?? "N/A",
            icon:  <FiUsers />,
            color: "#0ea5e9",
            bg:    "rgba(14,165,233,0.10)",
        },
        {
            title: "Avg. Attendance",
            value: `${d.averageAttendance ?? d.avgAttendance ?? d.attendanceAverage ?? 0}%`,
            icon:  <FaChartBar />,
            color: "#f59e0b",
            bg:    "rgba(245,158,11,0.10)",
        },
        {
            title: "Avg. Grade",
            value: d.averageGrade     ?? d.avgGrade        ?? d.gradeAverage   ?? "N/A",
            icon:  <FaChalkboardTeacher />,
            color: "#10b981",
            bg:    "rgba(16,185,129,0.10)",
        },
    ];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeDoctor() {

    const navigate = useNavigate();
    const location = useLocation();

    const [active,      setActive]      = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctorName]                  = useState(localStorage.getItem("userName")  || "Doctor");
    const [doctorEmail]                 = useState(localStorage.getItem("userEmail") || "doctor@met.com");

    const [statCards,   setStatCards]   = useState([]);
    const [grades,      setGrades]      = useState({ a: 0, b: 0, c: 0 });
    const [loading,     setLoading]     = useState(true);
    const [loadError,   setLoadError]   = useState("");

    // ─── Inject styles once ───────────────────────────────────────────────────
    useEffect(() => {
        const styleTag       = document.createElement("style");
        styleTag.id          = "homeDoctor-styles";
        styleTag.textContent = STYLES;
        if (!document.getElementById("homeDoctor-styles")) {
            document.head.appendChild(styleTag);
        }
        return () => {
            const el = document.getElementById("homeDoctor-styles");
            if (el) el.remove();
        };
    }, []);

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/DoctorLogin");
    }, [navigate]);

    // ─── Sync active tab with URL ─────────────────────────────────────────────
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
                navigate("/DoctorLogin");
                return;
            }

            try {

                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/dashboard/doctor",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("✅ Doctor Dashboard:", res.data);

                // unwrap common API envelope shapes
                const d = res.data?.data ?? res.data?.result ?? res.data;

                setStatCards(buildStatCards(d));

                setGrades({
                    a: d.aCount ?? d.gradeA ?? d.countA ?? d.a ?? 0,
                    b: d.bCount ?? d.gradeB ?? d.countB ?? d.b ?? 0,
                    c: d.cCount ?? d.gradeC ?? d.countC ?? d.c ?? 0,
                });

            } catch (err) {

                console.error("❌ Doctor Dashboard Error:", err);
                const status = err.response?.status;

                if (status === 401) {
                    setLoadError("Session expired. Redirecting to login…");
                    setTimeout(handleLogout, 1500);
                } else if (status === 403) {
                    setLoadError("Access denied.");
                    setTimeout(handleLogout, 2000);
                } else if (!err.response) {
                    setLoadError("Network error — please check your connection.");
                } else {
                    setLoadError(`Failed to load dashboard (${status ?? "unknown error"}).`);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, [navigate, handleLogout]);

    // ─── Sidebar nav ─────────────────────────────────────────────────────────
    const handleNav = (label) => {
        setSidebarOpen(false);
        setActive(label);
        if (NAV_ROUTES[label]) navigate(NAV_ROUTES[label]);
    };

    // used to scale bars relative to the highest grade count
    const maxGrade = Math.max(grades.a, grades.b, grades.c, 1);

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
                            <div className="adm-userAvatar">👨‍⚕️</div>
                            <div className="adm-userMeta">
                                <div className="adm-userName">{doctorName}</div>
                                <div className="adm-userEmail">{doctorEmail}</div>
                            </div>
                        </div>
                        <button className="adm-logoutPill" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="adm-content">

                    {/* ── Loading ── */}
                    {loading && (
                        <div className="adm-centerMsg">
                            Loading dashboard…
                        </div>
                    )}

                    {/* ── Error ── */}
                    {!loading && loadError && (
                        <div className="adm-centerMsg" style={{ color: "#ef4444" }}>
                            <p style={{ margin: 0 }}>{loadError}</p>
                            {!loadError.includes("expired") && !loadError.includes("denied") && (
                                <button
                                    className="adm-retryBtn"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Dashboard content ── */}
                    {!loading && !loadError && (
                        <>
                            {/* Stat Cards */}
                            <div className="adm-statGrid">
                                {statCards.map((card) => (
                                    <div
                                        key={card.title}
                                        className="adm-statCard"
                                        style={{ borderColor: card.color }}
                                    >
                                        <div
                                            className="adm-statIcon"
                                            style={{ color: card.color, background: card.bg }}
                                        >
                                            {card.icon}
                                        </div>
                                        <div>
                                            <div className="adm-statTitle">{card.title}</div>
                                            <div
                                                className="adm-statValue"
                                                style={{ color: card.color }}
                                            >
                                                {card.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Grade Distribution Card */}
                            <div className="adm-gradeCard">
                                <div className="adm-gradeCardHeader">
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12,
                                        background: "rgba(139,92,246,0.10)",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center",
                                        color: "#8b5cf6", fontSize: 20,
                                    }}>
                                        <FaChartBar />
                                    </div>
                                    <div>
                                        <div className="adm-gradeCardTitle">Grade Distribution</div>
                                        <div className="adm-gradeCardSubtitle">
                                            Number of students achieving each grade
                                        </div>
                                    </div>
                                </div>

                                {GRADE_CONFIG.map(({ key, label, color, bg }) => (
                                    <div key={key} className="adm-gradeRow">
                                        <div
                                            className="adm-gradeLabel"
                                            style={{ background: bg, color }}
                                        >
                                            {label}
                                        </div>
                                        <div className="adm-gradeBarWrap">
                                            <div
                                                className="adm-gradeBar"
                                                style={{
                                                    width:      `${(grades[key] / maxGrade) * 100}%`,
                                                    background: color,
                                                }}
                                            />
                                        </div>
                                        <div className="adm-gradeCount">
                                            {grades[key]} student{grades[key] !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                ))}
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