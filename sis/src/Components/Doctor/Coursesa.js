import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";

import {
    FiMenu, FiLogOut, FiClipboard, FiBookOpen,
    FiUsers, FiClock, FiBook, FiAlertCircle, FiLoader,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
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

  .adm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 199;
  }

  /* ── Courses grid ── */
  .courses-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .courses-title {
    font-size: 20px;
    font-weight: 900;
    color: #111827;
  }

  .courses-count {
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 18px;
  }

  .course-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e6e9ef;
    overflow: hidden;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .course-card:hover {
    box-shadow: 0 8px 30px rgba(14, 165, 233, 0.12);
    transform: translateY(-2px);
  }

  .course-card-header {
    padding: 18px 18px 14px;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    position: relative;
  }

  .course-card-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
    margin-bottom: 10px;
  }

  .course-card-name {
    font-size: 15px;
    font-weight: 900;
    color: #fff;
    line-height: 1.3;
  }

  .course-card-code {
    font-size: 11px;
    color: rgba(255,255,255,0.75);
    font-weight: 600;
    margin-top: 4px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .course-card-body {
    padding: 14px 18px 18px;
  }

  .course-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .course-meta-row svg {
    color: #0ea5e9;
    font-size: 14px;
    flex-shrink: 0;
  }

  .course-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0f9ff;
    color: #0284c7;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid #bae6fd;
    margin-top: 6px;
  }

  /* ── States ── */
  .courses-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 14px;
    color: #6b7280;
    font-weight: 700;
  }

  .courses-loading svg {
    font-size: 36px;
    color: #0ea5e9;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .courses-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 12px;
    color: #ef4444;
    font-weight: 700;
    text-align: center;
  }

  .courses-error svg {
    font-size: 36px;
  }

  .courses-error-msg {
    color: #6b7280;
    font-weight: 600;
    font-size: 13px;
    max-width: 360px;
  }

  .courses-retry-btn {
    margin-top: 6px;
    padding: 9px 20px;
    background: #0ea5e9;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
  }

  .courses-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 10px;
    color: #9ca3af;
    font-weight: 700;
    text-align: center;
  }

  .courses-empty svg {
    font-size: 40px;
    color: #d1d5db;
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
  }

  @media (max-width: 600px) {
    .courses-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview", icon: FiClipboard },
    { label: "Courses",  icon: FaGraduationCap },
    { label: "Grades",   icon: FaChalkboardTeacher },
    { label: "Payment",  icon: FiBookOpen },
];

const ROUTE_MAP = {
    "/Coursesa": "Courses",
    "/":         "Overview",
};

const NAV_ROUTES = {
    Overview: "/HomeDoctor",
    Courses:  "/Coursesa",
    Grades:   "/DoctorGrades",
    Payment:  "/DoctorPayment",
};

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course }) {
    // Normalise field names — adjust keys to match the real API response
    const name        = course.courseName  || course.name        || course.title       || "Untitled Course";
    const code        = course.courseCode  || course.code        || course.courseId    || "";
    const students    = course.studentsCount ?? course.enrolledStudents ?? course.students ?? null;
    const creditHours = course.creditHours  ?? course.credits    ?? null;
    const semester    = course.semester     || course.term       || "";
    const level       = course.level        || course.year       || "";

    return (
        <div className="course-card">
            <div className="course-card-header">
                <div className="course-card-icon"><FiBook /></div>
                <div className="course-card-name">{name}</div>
                {code && <div className="course-card-code">{code}</div>}
            </div>
            <div className="course-card-body">
                {students !== null && (
                    <div className="course-meta-row">
                        <FiUsers />
                        <span>{students} student{students !== 1 ? "s" : ""} enrolled</span>
                    </div>
                )}
                {creditHours !== null && (
                    <div className="course-meta-row">
                        <FiClock />
                        <span>{creditHours} credit hour{creditHours !== 1 ? "s" : ""}</span>
                    </div>
                )}
                {(semester || level) && (
                    <div className="course-badge">
                        <FaGraduationCap />
                        {[semester, level].filter(Boolean).join(" · ")}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Coursesa() {
    const navigate = useNavigate();
    const location = useLocation();

    const [active,      setActive]      = useState("Courses");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctorName]                  = useState(localStorage.getItem("userName")  || "Doctor");
    const [doctorEmail]                 = useState(localStorage.getItem("userEmail") || "doctor@met.com");

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    // ─── Inject styles once ───────────────────────────────────────────────────
    useEffect(() => {
        const styleTag       = document.createElement("style");
        styleTag.id          = "coursesa-styles";
        styleTag.textContent = STYLES;
        if (!document.getElementById("coursesa-styles")) {
            document.head.appendChild(styleTag);
        }
        return () => {
            const el = document.getElementById("coursesa-styles");
            if (el) el.remove();
        };
    }, []);

    // ─── Fetch courses ────────────────────────────────────────────────────────
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("authToken") || "";
            const res   = await fetch("https://ssis.runasp.net/api/v1/Courses/my-courses", {
                headers: {
                    "Content-Type":  "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Unauthorized — please log in again.");
                throw new Error(`Server error (${res.status})`);
            }

            const data = await res.json();

            // API may return the array directly or nested inside a property
            const list = Array.isArray(data)
                ? data
                : data.data   ?? data.courses ?? data.result ?? data.items ?? [];

            setCourses(list);
        } catch (err) {
            setError(err.message || "Failed to load courses.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/DoctorLogin");
    }, [navigate]);

    // ─── Sync active tab with URL ─────────────────────────────────────────────
    useEffect(() => {
        setActive(ROUTE_MAP[location.pathname] ?? "Courses");
    }, [location.pathname]);

    // ─── Sidebar nav ─────────────────────────────────────────────────────────
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
                        <div className="adm-topbarTitle">My Courses</div>
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
                        <div className="courses-loading">
                            <FiLoader />
                            <span>Loading your courses…</span>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {!loading && error && (
                        <div className="courses-error">
                            <FiAlertCircle />
                            <span>Could not load courses</span>
                            <span className="courses-error-msg">{error}</span>
                            <button className="courses-retry-btn" onClick={fetchCourses}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!loading && !error && courses.length === 0 && (
                        <div className="courses-empty">
                            <FiBook />
                            <span>No courses found</span>
                        </div>
                    )}

                    {/* ── Courses ── */}
                    {!loading && !error && courses.length > 0 && (
                        <>
                            <div className="courses-header">
                                <span className="courses-title">My Courses</span>
                                <span className="courses-count">{courses.length} course{courses.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="courses-grid">
                                {courses.map((course, idx) => (
                                    <CourseCard key={course.id ?? course.courseId ?? idx} course={course} />
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