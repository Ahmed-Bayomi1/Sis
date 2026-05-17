import './HomeStudent.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
    FiMenu, FiLogOut, FiUsers, FiClipboard, FiChevronDown, FiChevronUp, FiBookOpen,
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
    FaBookOpen,
} from "react-icons/fa";

const SidebarItems = [
    { label: "Overview",    icon: FiClipboard },
    { label: "Add Courses", icon: FaGraduationCap },
    { label: "Grades",      icon: FaChalkboardTeacher },
    { label: "Payment",     icon: FiBookOpen },
];

const ROUTE_MAP = {
    "/HomeStudent": "Overview",
    "/":            "Overview",
};

const NAV_ROUTES = {
    Overview:      "/HomeStudent",
    "Add Courses": "/Courses",
    Grades:        "/Grades",
    Payment:       "/Payment",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function gradeColor(grade) {
    if (!grade) return "#94A3B8";
    const g = grade.toString().toUpperCase();
    if (g === "A+" || g === "A")  return "#4FBF6F";
    if (g === "B+" || g === "B")  return "#4F86F7";
    if (g === "C+" || g === "C")  return "#F7A24F";
    if (g === "D+" || g === "D")  return "#F97316";
    return "#EF4444";
}

function gpaColor(gpa) {
    const n = parseFloat(gpa) || 0;
    if (n >= 3.5) return "#4FBF6F";
    if (n >= 2.5) return "#4F86F7";
    if (n >= 1.5) return "#F7A24F";
    return "#EF4444";
}

function gpaLabel(gpa) {
    const n = parseFloat(gpa) || 0;
    if (n >= 3.5) return "Excellent";
    if (n >= 2.5) return "Good";
    if (n >= 1.5) return "Fair";
    return "Poor";
}

// ─── Semester Card ────────────────────────────────────────────────────────────
function SemesterCard({ semester, index }) {

    const [open, setOpen] = useState(true);

    const semGpa   = semester.semesterGpa ?? semester.gpa         ?? semester.GPA         ?? null;
    const year     = semester.year        ?? semester.academicYear ?? semester.Year        ?? null;
    const semLabel = semester.semester    ?? semester.semesterName ?? semester.term        ?? `Semester ${index + 1}`;
    const courses  = semester.courses     ?? semester.subjects     ?? semester.grades      ?? [];

    const color = semGpa !== null ? gpaColor(semGpa) : "#4F86F7";

    return (
        <div style={{
            background:   "#fff",
            borderRadius: 14,
            border:       "1px solid #E2E8F0",
            overflow:     "hidden",
            marginBottom: 18,
            boxShadow:    "0 2px 10px rgba(0,0,0,0.05)",
            animation:    `fadeUp 0.35s ease ${index * 0.07}s both`,
        }}>
            {/* ── Card header ── */}
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    padding:        "16px 20px",
                    cursor:         "pointer",
                    background:     "#F8FAFC",
                    borderBottom:   open ? "1px solid #E2E8F0" : "none",
                    userSelect:     "none",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width:          42,
                        height:         42,
                        borderRadius:   10,
                        background:     `linear-gradient(135deg, ${color}22, ${color}44)`,
                        border:         `2px solid ${color}55`,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flexShrink:     0,
                    }}>
                        <FaBookOpen style={{ color, fontSize: 18 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>
                            {semLabel}
                            {year && (
                                <span style={{
                                    marginLeft:   8,
                                    background:   "#EFF6FF",
                                    color:        "#4F86F7",
                                    fontSize:     11,
                                    fontWeight:   700,
                                    borderRadius: 6,
                                    padding:      "2px 8px",
                                }}>
                                    {year}
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                            {courses.length} course{courses.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {semGpa !== null && (
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>
                                {parseFloat(semGpa).toFixed(2)}
                            </div>
                            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                                {gpaLabel(semGpa)}
                            </div>
                        </div>
                    )}
                    <div style={{ color: "#94A3B8", fontSize: 18 }}>
                        {open ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                </div>
            </div>

            {/* ── Courses table ── */}
            {open && (
                <div style={{ padding: "12px 20px 16px" }}>

                    <div style={{
                        display:             "grid",
                        gridTemplateColumns: "1fr 90px 90px 80px",
                        padding:             "6px 10px",
                        fontSize:            11,
                        fontWeight:          700,
                        color:               "#94A3B8",
                        textTransform:       "uppercase",
                        letterSpacing:       "0.05em",
                        marginBottom:        4,
                    }}>
                        <span>Course</span>
                        <span style={{ textAlign: "center" }}>Credits</span>
                        <span style={{ textAlign: "center" }}>Score</span>
                        <span style={{ textAlign: "center" }}>Grade</span>
                    </div>

                    {courses.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "#94A3B8", fontSize: 13 }}>
                            No courses recorded for this semester.
                        </div>
                    ) : (
                        courses.map((c, i) => {
                            const cName    = c.courseName  ?? c.name        ?? c.subject    ?? `Course ${i + 1}`;
                            const cCode    = c.courseCode  ?? c.code        ?? "";
                            const cCredits = c.credits     ?? c.creditHours ?? c.hours      ?? "—";
                            const cScore   = c.score       ?? c.mark        ?? c.percentage ?? null;
                            const cGrade   = c.letterGrade ?? c.grade       ?? c.letter     ?? null;
                            const clr      = gradeColor(cGrade ?? cScore);

                            return (
                                <div key={c.courseId ?? c.id ?? i} style={{
                                    display:             "grid",
                                    gridTemplateColumns: "1fr 90px 90px 80px",
                                    alignItems:          "center",
                                    padding:             "10px 10px",
                                    borderRadius:        8,
                                    background:          i % 2 === 0 ? "#F8FAFC" : "#fff",
                                    marginBottom:        4,
                                    transition:          "background 0.15s",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width:          32,
                                            height:         32,
                                            borderRadius:   8,
                                            background:     "linear-gradient(135deg, #4F86F7, #A855F7)",
                                            display:        "flex",
                                            alignItems:     "center",
                                            justifyContent: "center",
                                            color:          "#fff",
                                            fontWeight:     700,
                                            fontSize:       13,
                                            flexShrink:     0,
                                        }}>
                                            {cName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{cName}</div>
                                            {cCode && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{cCode}</div>}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: 13, color: "#475569", fontWeight: 600 }}>
                                        {cCredits}
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: 13, color: "#475569" }}>
                                        {cScore !== null ? cScore : "—"}
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                        {cGrade ? (
                                            <span style={{
                                                background:   clr + "18",
                                                color:        clr,
                                                fontWeight:   700,
                                                fontSize:     13,
                                                borderRadius: 6,
                                                padding:      "3px 10px",
                                            }}>
                                                {cGrade}
                                            </span>
                                        ) : (
                                            <span style={{ color: "#CBD5E1", fontSize: 12 }}>—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Grades() {

    const navigate = useNavigate();
    const location = useLocation();

    const [active,      setActive]      = useState("Grades");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studentName]                 = useState(localStorage.getItem("userName")  || "Student");
    const [studentEmail]                = useState(localStorage.getItem("userEmail") || "student@met.com");

    const [semesters,   setSemesters]   = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [loadError,   setLoadError]   = useState("");

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/StudentLogin");
    }, [navigate]);

    // ─── Sync active tab ──────────────────────────────────────────────────────
    useEffect(() => {
        setActive(ROUTE_MAP[location.pathname] ?? "Grades");
    }, [location.pathname]);

    // ─── Fetch grades ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchGrades = async () => {
            setLoading(true);
            setLoadError("");
            const token = localStorage.getItem("token");
            if (!token) { navigate("/StudentLogin"); return; }

            try {
                const res = await axios.get(
                    "https://ssis.runasp.net/api/Grades/semester-results",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const d = res.data?.data ?? res.data?.result ?? res.data ?? [];
                setSemesters(Array.isArray(d) ? d : [d]);
            } catch (err) {
                const status = err.response?.status;
                if (status === 401) { handleLogout(); return; }
                setLoadError(`Failed to load grades (${status ?? "network error"}).`);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [navigate, handleLogout]);

    // ─── Sidebar nav ──────────────────────────────────────────────────────────
    const handleNav = (label) => {
        setSidebarOpen(false);
        setActive(label);
        if (NAV_ROUTES[label]) navigate(NAV_ROUTES[label]);
    };

    // ─── Overall GPA ──────────────────────────────────────────────────────────
    const validGpas = semesters
        .map(s => parseFloat(s.semesterGpa ?? s.gpa ?? s.GPA))
        .filter(n => !isNaN(n));
    const overallGpa = validGpas.length
        ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
        : null;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="adm-root">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

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
                        <div className="adm-topbarTitle">Grades</div>
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
                        <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: 18 }}>
                            Loading grades...
                        </div>

                    ) : loadError ? (
                        <div style={{ padding: 40, color: "red", textAlign: "center" }}>
                            <p>{loadError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{ marginTop: 12, padding: "8px 24px", cursor: "pointer", borderRadius: 6, border: "1px solid #ccc" }}
                            >
                                Retry
                            </button>
                        </div>

                    ) : (
                        <div style={{ maxWidth: 860, margin: "0 auto" }}>

                            {/* ── Page heading + overall GPA ── */}
                            <div style={{
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "space-between",
                                marginBottom:   24,
                                flexWrap:       "wrap",
                                gap:            12,
                            }}>
                                <div>
                                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#1E293B" }}>
                                        Academic Results
                                    </h2>
                                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94A3B8" }}>
                                        {semesters.length} semester{semesters.length !== 1 ? "s" : ""} on record
                                    </p>
                                </div>

                                {overallGpa && (
                                    <div style={{
                                        background:   "#fff",
                                        border:       `2px solid ${gpaColor(overallGpa)}`,
                                        borderRadius: 12,
                                        padding:      "10px 20px",
                                        textAlign:    "center",
                                        boxShadow:    "0 2px 10px rgba(0,0,0,0.06)",
                                    }}>
                                        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                            Cumulative GPA
                                        </div>
                                        <div style={{ fontSize: 26, fontWeight: 800, color: gpaColor(overallGpa), lineHeight: 1.1, marginTop: 2 }}>
                                            {overallGpa}
                                        </div>
                                        <div style={{ fontSize: 11, color: gpaColor(overallGpa), fontWeight: 600, marginTop: 2 }}>
                                            {gpaLabel(overallGpa)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Semester cards ── */}
                            {semesters.length === 0 ? (
                                <div style={{
                                    textAlign:    "center",
                                    padding:      "60px 20px",
                                    color:        "#94A3B8",
                                    fontSize:     15,
                                    background:   "#fff",
                                    borderRadius: 14,
                                    border:       "1px solid #E2E8F0",
                                }}>
                                    <FaGraduationCap style={{ fontSize: 44, opacity: 0.25, display: "block", margin: "0 auto 14px" }} />
                                    No grade records found.
                                </div>
                            ) : (
                                semesters.map((sem, i) => (
                                    <SemesterCard key={i} semester={sem} index={i} />
                                ))
                            )}
                        </div>
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