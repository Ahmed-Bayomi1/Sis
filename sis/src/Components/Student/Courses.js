import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiMenu, FiLogOut, FiClipboard, FiBell,
} from "react-icons/fi";
import {
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";
import { FiUsers, FiBookOpen, FiPlusCircle, FiMinusCircle, FiSearch, FiLoader, FiList, FiPrinter, FiX } from "react-icons/fi";

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",               icon: FiClipboard },
    { label: "Add Courses",            icon: FaGraduationCap },
    { label: "Grades",                 icon: FaChalkboardTeacher },
    { label: "Payment",                icon: FiBookOpen },
    // { label: "Courses",                icon: FiUsers },
];

const NAV_ROUTES = {
    Overview:              "/HomeStudent",
    "Add Courses": "/Add Courses",
    Grades:                "/Grades",
    Payment:               "/Payment",
    // Courses:               "/HomeStudent",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
    return (
        <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 9999,
            display: "flex", flexDirection: "column", gap: 10,
        }}>
            {toasts.map(t => (
                <div key={t.id} style={{
                    background: t.type === "success" ? "#ECFDF5" : t.type === "error" ? "#FEF2F2" : "#EFF6FF",
                    border: `1px solid ${t.type === "success" ? "#6EE7B7" : t.type === "error" ? "#FCA5A5" : "#93C5FD"}`,
                    color: t.type === "success" ? "#065F46" : t.type === "error" ? "#991B1B" : "#1E40AF",
                    padding: "12px 18px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                    maxWidth: 320,
                    animation: "slideIn 0.25s ease",
                }}>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

// ─── My Courses Modal ─────────────────────────────────────────────────────────
function MyCoursesModal({ onClose, token }) {

    const [courses,  setCourses]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState("");

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/Enrollments/my-courses",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const d = res.data?.data ?? res.data?.result ?? res.data ?? [];
                setCourses(Array.isArray(d) ? d : []);
            } catch (err) {
                setError(`Failed to load your courses (${err.response?.status ?? "network error"}).`);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [token]);

    // Prevent background scroll while open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const gradeColor = (grade) => {
        if (!grade) return "#94A3B8";
        const g = grade.toString().toUpperCase();
        if (g === "A" || g === "A+") return "#4FBF6F";
        if (g === "B" || g === "B+") return "#4F86F7";
        if (g === "C" || g === "C+") return "#F7A24F";
        return "#EF4444";
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(15,23,42,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
            animation: "fadeOverlay 0.2s ease",
        }}
            onClick={onClose}
        >
            <div style={{
                background: "#fff",
                borderRadius: 18,
                width: "100%",
                maxWidth: 680,
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
                animation: "popUp 0.25s ease",
                overflow: "hidden",
            }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px",
                    borderBottom: "1px solid #F1F5F9",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <FiList style={{ color: "#4F86F7", fontSize: 20 }} />
                        <span style={{ fontWeight: 700, fontSize: 17, color: "#1E293B" }}>
                            My Enrolled Courses
                        </span>
                        {!loading && !error && (
                            <span style={{
                                background: "#4F86F7", color: "#fff",
                                fontSize: 11, fontWeight: 700,
                                borderRadius: 999, padding: "2px 9px",
                            }}>
                                {courses.length}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} style={{
                        background: "#F1F5F9", border: "none", borderRadius: 8,
                        width: 32, height: 32, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#64748B", fontSize: 16,
                        transition: "background 0.15s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "#E2E8F0"}
                        onMouseLeave={e => e.currentTarget.style.background = "#F1F5F9"}
                    >
                        <FiX />
                    </button>
                </div>

                {/* Modal body */}
                <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: 15 }}>
                            Loading your courses...
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: "center", padding: "30px", color: "#EF4444", fontSize: 14 }}>
                            {error}
                        </div>
                    ) : courses.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "50px 20px",
                            color: "#94A3B8", fontSize: 14,
                        }}>
                            <FiBookOpen style={{ fontSize: 40, opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
                            You are not enrolled in any courses yet.
                        </div>
                    ) : (
                        <>
                            {/* Column headers */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 120px 80px",
                                padding: "6px 14px",
                                fontSize: 11, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: "0.05em",
                                marginBottom: 6,
                            }}>
                                <span>Course</span>
                                <span style={{ textAlign: "center" }}>Credits</span>
                                <span style={{ textAlign: "center" }}>Grade</span>
                            </div>

                            {courses.map((c, idx) => {
                                const name    = c.name ?? c.courseName ?? c.title ?? `Course ${idx + 1}`;
                                const code    = c.code ?? c.courseCode ?? "";
                                const credits = c.credits ?? c.creditHours ?? c.hours ?? "—";
                                const grade   = c.grade ?? c.letterGrade ?? null;

                                return (
                                    <div key={c.id ?? idx} style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 120px 80px",
                                        alignItems: "center",
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        background: idx % 2 === 0 ? "#F8FAFC" : "#fff",
                                        border: "1px solid #F1F5F9",
                                        marginBottom: 6,
                                        animation: `fadeUp 0.3s ease ${idx * 0.04}s both`,
                                    }}>
                                        {/* Name + code */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                                background: "linear-gradient(135deg, #4F86F7, #A855F7)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontWeight: 700, fontSize: 15,
                                            }}>
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{name}</div>
                                                {code && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{code}</div>}
                                            </div>
                                        </div>

                                        {/* Credits */}
                                        <div style={{ textAlign: "center", fontSize: 13, color: "#475569", fontWeight: 600 }}>
                                            {credits}
                                        </div>

                                        {/* Grade */}
                                        <div style={{ textAlign: "center" }}>
                                            {grade ? (
                                                <span style={{
                                                    background: gradeColor(grade) + "18",
                                                    color: gradeColor(grade),
                                                    fontWeight: 700, fontSize: 13,
                                                    borderRadius: 6, padding: "3px 10px",
                                                }}>
                                                    {grade}
                                                </span>
                                            ) : (
                                                <span style={{ color: "#CBD5E1", fontSize: 12 }}>—</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddDropCourses() {

    const navigate = useNavigate();

    const [active,        setActive]        = useState("Add || drop Courses");
    const [sidebarOpen,   setSidebarOpen]   = useState(false);
    const [studentName]                     = useState(localStorage.getItem("userName")  || "Student");
    const [studentEmail]                    = useState(localStorage.getItem("userEmail") || "student@met.com");

    const [courses,       setCourses]       = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [loadError,     setLoadError]     = useState("");
    const [search,        setSearch]        = useState("");
    const [actionLoading, setActionLoading] = useState({});
    const [toasts,        setToasts]        = useState([]);

    const [showModal,     setShowModal]     = useState(false);
    const [printing,      setPrinting]      = useState(false);

    const token = localStorage.getItem("token");

    // ─── Toast helper ─────────────────────────────────────────────────────────
    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/StudentLogin");
    }, [navigate]);

    // ─── Fetch available courses ──────────────────────────────────────────────
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setLoadError("");
            if (!token) { navigate("/StudentLogin"); return; }
            try {
                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/Courses/avilable-for-me",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const d = res.data?.data ?? res.data?.result ?? res.data ?? [];
                setCourses(Array.isArray(d) ? d : []);
            } catch (err) {
                const status = err.response?.status;
                if (status === 401) { handleLogout(); return; }
                setLoadError(`Failed to load courses (${status ?? "network error"}).`);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [navigate, handleLogout, token]);

    // ─── Add course ───────────────────────────────────────────────────────────
    const handleAdd = async (course) => {
        setActionLoading(prev => ({ ...prev, [course.id]: "add" }));
        try {
            await axios.post(
                `https://ssis.runasp.net/api/v1/Courses/self-enroll/${course.id}`,
                { courseId: course.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            addToast(`✅ "${course.name ?? course.courseName}" added successfully!`, "success");
        } catch (err) {
            const msg = err.response?.data?.message ?? err.response?.data?.title ?? "Failed to add course.";
            addToast(`❌ ${msg}`, "error");
        } finally {
            setActionLoading(prev => ({ ...prev, [course.id]: null }));
        }
    };

    // ─── Drop course ──────────────────────────────────────────────────────────
    const handleDrop = async (course) => {
        setActionLoading(prev => ({ ...prev, [course.id]: "drop" }));
        try {
            await axios.post(
                "https://ssis.runasp.net/api/v1/enrollments/drop",
                { courseId: course.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            addToast(`🗑️ "${course.name ?? course.courseName}" dropped.`, "info");
        } catch (err) {
            const msg = err.response?.data?.message ?? err.response?.data?.title ?? "Failed to drop course.";
            addToast(`❌ ${msg}`, "error");
        } finally {
            setActionLoading(prev => ({ ...prev, [course.id]: null }));
        }
    };

    // ─── Print registration form ──────────────────────────────────────────────
    const handlePrint = async () => {
        setPrinting(true);
        try {
            const res = await axios.get(
                "https://ssis.runasp.net/api/v1/Enrollments/my-courses/print",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                }
            );

            // Determine file type from response headers
            const contentType = res.headers["content-type"] || "application/pdf";
            const blob        = new Blob([res.data], { type: contentType });
            const url         = window.URL.createObjectURL(blob);

            // If PDF → open in new tab so browser shows its print dialog;
            // otherwise trigger a direct download.
            if (contentType.includes("pdf")) {
                const tab = window.open(url, "_blank");
                if (!tab) {
                    // Fallback: download if popup blocked
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "registration-form.pdf";
                    a.click();
                }
            } else {
                const ext = contentType.includes("excel") || contentType.includes("spreadsheet")
                    ? "xlsx"
                    : contentType.includes("word") ? "docx" : "file";
                const a = document.createElement("a");
                a.href = url;
                a.download = `registration-form.${ext}`;
                a.click();
            }

            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
            addToast("📄 Registration form ready!", "success");
        } catch (err) {
            const status = err.response?.status;
            addToast(`❌ Could not fetch registration form (${status ?? "network error"}).`, "error");
        } finally {
            setPrinting(false);
        }
    };

    // ─── Sidebar nav ──────────────────────────────────────────────────────────
    const handleNav = (label) => {
        setSidebarOpen(false);
        setActive(label);
        if (NAV_ROUTES[label]) navigate(NAV_ROUTES[label]);
    };

    // ─── Filtered courses ─────────────────────────────────────────────────────
    const filtered = courses.filter(c => {
        const name = (c.name ?? c.courseName ?? c.title ?? "").toLowerCase();
        return name.includes(search.toLowerCase());
    });

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="adm-root">

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOverlay {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes popUp {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .course-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 20px;
                    border-radius: 10px;
                    background: #fff;
                    border: 1px solid #E2E8F0;
                    margin-bottom: 10px;
                    animation: fadeUp 0.3s ease both;
                    transition: box-shadow 0.2s, border-color 0.2s;
                }
                .course-row:hover {
                    box-shadow: 0 4px 18px rgba(79,134,247,0.10);
                    border-color: #BFD3FD;
                }
                .btn-add {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 18px; border-radius: 8px; border: none;
                    background: #4FBF6F; color: #fff;
                    font-size: 13px; font-weight: 600; cursor: pointer;
                    transition: background 0.18s, transform 0.15s;
                }
                .btn-add:hover:not(:disabled) { background: #3aaa5a; transform: scale(1.04); }
                .btn-add:disabled { opacity: 0.55; cursor: not-allowed; }
                .btn-drop {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 18px; border-radius: 8px; border: none;
                    background: #EF4444; color: #fff;
                    font-size: 13px; font-weight: 600; cursor: pointer;
                    transition: background 0.18s, transform 0.15s;
                }
                .btn-drop:hover:not(:disabled) { background: #dc2626; transform: scale(1.04); }
                .btn-drop:disabled { opacity: 0.55; cursor: not-allowed; }
                .btn-show-courses {
                    display: flex; align-items: center; gap: 8px;
                    padding: 11px 22px; border-radius: 10px; border: 2px solid #4F86F7;
                    background: #fff; color: #4F86F7;
                    font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: background 0.18s, color 0.18s, transform 0.15s, box-shadow 0.18s;
                }
                .btn-show-courses:hover {
                    background: #4F86F7; color: #fff;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(79,134,247,0.25);
                }
                .btn-print {
                    display: flex; align-items: center; gap: 8px;
                    padding: 11px 22px; border-radius: 10px; border: none;
                    background: linear-gradient(135deg, #4F86F7, #A855F7); color: #fff;
                    font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
                    box-shadow: 0 4px 14px rgba(79,134,247,0.30);
                }
                .btn-print:hover:not(:disabled) {
                    opacity: 0.88;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(79,134,247,0.35);
                }
                .btn-print:disabled { opacity: 0.55; cursor: not-allowed; }
                .search-box {
                    display: flex; align-items: center; gap: 10px;
                    background: #fff; border: 1.5px solid #E2E8F0;
                    border-radius: 10px; padding: 10px 16px;
                    margin-bottom: 20px;
                    transition: border-color 0.2s;
                }
                .search-box:focus-within { border-color: #4F86F7; }
                .search-box input {
                    border: none; outline: none;
                    flex: 1; font-size: 14px; color: #1E293B;
                    background: transparent;
                }
                .spin {
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <Toast toasts={toasts} />

            {/* ── My Courses Modal ── */}
            {showModal && (
                <MyCoursesModal
                    token={token}
                    onClose={() => setShowModal(false)}
                />
            )}

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
                        <div className="adm-topbarTitle">Add / Drop Courses</div>
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

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: "18px" }}>
                            Loading courses...
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
                        <div style={{
                            background: "#F8FAFC",
                            borderRadius: 16,
                            padding: "24px",
                            minHeight: "60vh",
                        }}>
                            {/* Header row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <FiBookOpen style={{ color: "#4F86F7", fontSize: 22 }} />
                                <span style={{ fontWeight: 700, fontSize: 18, color: "#1E293B" }}>
                                    Available Courses
                                </span>
                                <span style={{
                                    background: "#4F86F7", color: "#fff",
                                    fontSize: 12, fontWeight: 700,
                                    borderRadius: 999, padding: "2px 10px",
                                    marginLeft: 4,
                                }}>
                                    {filtered.length}
                                </span>
                            </div>

                            {/* Search */}
                            <div className="search-box">
                                <FiSearch style={{ color: "#94A3B8", fontSize: 16, flexShrink: 0 }} />
                                <input
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Table header */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 20px",
                                marginBottom: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}>
                                <span>Course Name</span>
                                <span>Actions</span>
                            </div>

                            {/* Rows */}
                            {filtered.length === 0 ? (
                                <div style={{
                                    textAlign: "center", padding: "50px 20px",
                                    color: "#94A3B8", fontSize: 15,
                                }}>
                                    <FiBookOpen style={{ fontSize: 40, opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
                                    No courses found.
                                </div>
                            ) : (
                                filtered.map((course, idx) => {
                                    const name       = course.name ?? course.courseName ?? course.title ?? `Course ${idx + 1}`;
                                    const code       = course.code ?? course.courseCode ?? "";
                                    const isAdding   = actionLoading[course.id] === "add";
                                    const isDropping = actionLoading[course.id] === "drop";
                                    const busy       = isAdding || isDropping;

                                    return (
                                        <div
                                            key={course.id ?? idx}
                                            className="course-row"
                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                        >
                                            {/* Course info */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 10,
                                                    background: "linear-gradient(135deg, #4F86F7, #A855F7)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
                                                }}>
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>
                                                        {name}
                                                    </div>
                                                    {code && (
                                                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                                                            {code}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div style={{ display: "flex", gap: 10 }}>
                                                <button
                                                    className="btn-add"
                                                    onClick={() => handleAdd(course)}
                                                    disabled={busy}
                                                >
                                                    {isAdding
                                                        ? <span className="spin"><FiLoader /></span>
                                                        : <FiPlusCircle />
                                                    }
                                                    {isAdding ? "Adding..." : "Add"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* ── Bottom Action Buttons ── */}
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 14,
                                marginTop: 30,
                                paddingTop: 20,
                                borderTop: "1px solid #E2E8F0",
                            }}>
                                {/* Show My Courses */}
                                <button
                                    className="btn-show-courses"
                                    onClick={() => setShowModal(true)}
                                >
                                    <FiList style={{ fontSize: 16 }} />
                                    My Courses
                                </button>

                                {/* Print Registration Form */}
                                <button
                                    className="btn-print"
                                    onClick={handlePrint}
                                    disabled={printing}
                                >
                                    {printing
                                        ? <span className="spin"><FiLoader style={{ fontSize: 16 }} /></span>
                                        : <FiPrinter style={{ fontSize: 16 }} />
                                    }
                                    {printing ? "Preparing..." : "Print Registration Form"}
                                </button>
                            </div>

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