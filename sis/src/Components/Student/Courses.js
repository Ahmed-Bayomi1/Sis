import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiMenu, FiLogOut, FiClipboard, FiBell, FiCalendar,
} from "react-icons/fi";
import {
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";
import {
    FiUsers, FiBookOpen, FiPlusCircle, FiMinusCircle,
    FiSearch, FiLoader, FiList, FiPrinter, FiX, FiAlertCircle,
} from "react-icons/fi";

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",    icon: FiClipboard },
    { label: "Courses", icon: FaGraduationCap },
    { label: "Grades",      icon: FaChalkboardTeacher },
    { label: "Payment",     icon: FiBookOpen },
    { label: "Schedule",    icon: FiCalendar },   // ← fixed: was missing icon
];

const NAV_ROUTES = {
    Overview:      "/HomeStudent",
    "Courses": "/Courses",
    Grades:        "/Grades",
    Payment:       "/Payment",
    Schedule:      "/Sch",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCourseName  = (c, idx) =>
    c.courseName ?? c.name ?? c.title ?? c.courseTitle ?? `Course ${idx + 1}`;

const getCourseCode  = (c) =>
    c.courseCode ?? c.code ?? c.courseId ?? "";

const getCourseCredits = (c) =>
    c.creditHours ?? c.credits ?? c.hours ?? c.units ?? "—";

const getCourseGrade = (c) =>
    c.grade ?? c.letterGrade ?? c.gradeValue ?? c.finalGrade ?? null;

const getCourseStatus = (c) =>
    c.enrollmentStatus ?? c.status ?? c.enrollStatus ?? null;

const AVATARS = [
    "linear-gradient(135deg,#4F86F7,#A855F7)",
    "linear-gradient(135deg,#10b981,#0ea5e9)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#8b5cf6,#ec4899)",
    "linear-gradient(135deg,#06b6d4,#6366f1)",
    "linear-gradient(135deg,#f97316,#eab308)",
];

function gradeColor(grade) {
    if (!grade) return "#94A3B8";
    const g = grade.toString().toUpperCase();
    if (g.startsWith("A")) return "#16a34a";
    if (g.startsWith("B")) return "#2563eb";
    if (g.startsWith("C")) return "#d97706";
    return "#dc2626";
}

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
                    padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)", maxWidth: 320,
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
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");
    const [search,  setSearch]  = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/Enrollments/my-courses",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const raw = res.data;
                const list =
                    Array.isArray(raw)           ? raw          :
                    Array.isArray(raw?.data)     ? raw.data     :
                    Array.isArray(raw?.result)   ? raw.result   :
                    Array.isArray(raw?.items)    ? raw.items    :
                    Array.isArray(raw?.courses)  ? raw.courses  :
                    [];
                setCourses(list);
            } catch (err) {
                setError(`Failed to load your courses (${err.response?.status ?? "network error"}).`);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const filtered = courses.filter(c =>
        getCourseName(c, 0).toLowerCase().includes(search.toLowerCase()) ||
        getCourseCode(c).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 10000,
                background: "rgba(15,23,42,0.50)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 20,
                animation: "fadeOverlay 0.2s ease",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 20,
                    width: "100%", maxWidth: 720, maxHeight: "85vh",
                    display: "flex", flexDirection: "column",
                    boxShadow: "0 28px 70px rgba(0,0,0,0.22)",
                    animation: "popUp 0.25s ease",
                    overflow: "hidden",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Modal Header ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px", borderBottom: "1px solid #F1F5F9",
                    background: "linear-gradient(135deg,#4F86F7 0%,#A855F7 100%)",
                    borderRadius: "20px 20px 0 0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <FiList style={{ color: "#fff", fontSize: 18 }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                                My Enrolled Courses
                            </div>
                            {!loading && !error && (
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>
                                    {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,0.2)", border: "none",
                            borderRadius: 10, width: 34, height: 34, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 16, transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.35)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                    >
                        <FiX />
                    </button>
                </div>

                {/* ── Search ── */}
                {!loading && !error && courses.length > 0 && (
                    <div style={{ padding: "14px 24px 0" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: "#F8FAFC", border: "1.5px solid #E2E8F0",
                            borderRadius: 10, padding: "9px 14px",
                            transition: "border-color 0.2s",
                        }}
                            onFocus={e => e.currentTarget.style.borderColor = "#4F86F7"}
                            onBlur={e  => e.currentTarget.style.borderColor = "#E2E8F0"}
                        >
                            <FiSearch style={{ color: "#94A3B8", fontSize: 15, flexShrink: 0 }} />
                            <input
                                placeholder="Search enrolled courses…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    border: "none", outline: "none", flex: 1,
                                    fontSize: 13, color: "#1E293B", background: "transparent",
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Modal Body ── */}
                <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>

                    {loading && (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            justifyContent: "center", gap: 14, padding: "60px 20px",
                        }}>
                            <FiLoader style={{
                                fontSize: 32, color: "#4F86F7",
                                animation: "spin 0.9s linear infinite",
                            }} />
                            <span style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>
                                Loading your courses…
                            </span>
                        </div>
                    )}

                    {!loading && error && (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            gap: 12, padding: "50px 20px", textAlign: "center",
                        }}>
                            <FiAlertCircle style={{ fontSize: 36, color: "#ef4444" }} />
                            <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 14 }}>
                                Could not load courses
                            </span>
                            <span style={{ color: "#64748b", fontSize: 13, maxWidth: 300 }}>{error}</span>
                        </div>
                    )}

                    {!loading && !error && courses.length === 0 && (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            gap: 12, padding: "60px 20px", textAlign: "center",
                        }}>
                            <FiBookOpen style={{ fontSize: 42, color: "#d1d5db" }} />
                            <span style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>
                                No enrolled courses
                            </span>
                            <span style={{ fontSize: 13, color: "#94A3B8" }}>
                                You are not enrolled in any courses yet.
                            </span>
                        </div>
                    )}

                    {!loading && !error && courses.length > 0 && filtered.length === 0 && (
                        <div style={{
                            textAlign: "center", padding: "40px 20px",
                            color: "#94A3B8", fontSize: 13, fontWeight: 600,
                        }}>
                            No courses match "{search}"
                        </div>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 90px 90px 90px",
                                padding: "4px 14px 8px",
                                fontSize: 11, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                                <span>Course</span>
                                <span style={{ textAlign: "center" }}>Credits</span>
                                <span style={{ textAlign: "center" }}>Status</span>
                                <span style={{ textAlign: "center" }}>Grade</span>
                            </div>

                            {filtered.map((c, idx) => {
                                const name    = getCourseName(c, idx);
                                const code    = getCourseCode(c);
                                const credits = getCourseCredits(c);
                                const grade   = getCourseGrade(c);
                                const status  = getCourseStatus(c);

                                return (
                                    <div
                                        key={c.id ?? c.courseId ?? c.enrollmentId ?? idx}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 90px 90px 90px",
                                            alignItems: "center",
                                            padding: "12px 14px",
                                            borderRadius: 12,
                                            background: idx % 2 === 0 ? "#F8FAFC" : "#fff",
                                            border: "1px solid #F1F5F9",
                                            marginBottom: 7,
                                            animation: `fadeUp 0.3s ease ${idx * 0.04}s both`,
                                            transition: "box-shadow 0.2s, border-color 0.2s",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,134,247,0.10)";
                                            e.currentTarget.style.borderColor = "#BFD3FD";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.boxShadow = "none";
                                            e.currentTarget.style.borderColor = "#F1F5F9";
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                                background: AVATARS[idx % AVATARS.length],
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontWeight: 800, fontSize: 15,
                                            }}>
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>
                                                    {name}
                                                </div>
                                                {code && (
                                                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                                                        {code}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{
                                            textAlign: "center", fontSize: 13,
                                            color: "#475569", fontWeight: 600,
                                        }}>
                                            {credits}
                                        </div>

                                        <div style={{ textAlign: "center" }}>
                                            {status ? (
                                                <span style={{
                                                    background: "#EFF6FF", color: "#2563EB",
                                                    fontSize: 11, fontWeight: 700,
                                                    padding: "3px 9px", borderRadius: 20,
                                                    border: "1px solid #BFDBFE",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    {status}
                                                </span>
                                            ) : (
                                                <span style={{
                                                    background: "#F0FDF4", color: "#16a34a",
                                                    fontSize: 11, fontWeight: 700,
                                                    padding: "3px 9px", borderRadius: 20,
                                                    border: "1px solid #BBF7D0",
                                                }}>
                                                    Enrolled
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ textAlign: "center" }}>
                                            {grade ? (
                                                <span style={{
                                                    background: gradeColor(grade) + "18",
                                                    color: gradeColor(grade),
                                                    fontWeight: 800, fontSize: 13,
                                                    borderRadius: 8, padding: "3px 11px",
                                                    border: `1px solid ${gradeColor(grade)}33`,
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

                {/* ── Modal Footer ── */}
                {!loading && !error && courses.length > 0 && (
                    <div style={{
                        padding: "14px 24px",
                        borderTop: "1px solid #F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#FAFBFC",
                    }}>
                        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>
                            Showing {filtered.length} of {courses.length} courses
                        </span>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "8px 20px", borderRadius: 10,
                                border: "1.5px solid #E2E8F0", background: "#fff",
                                color: "#374151", fontWeight: 700, fontSize: 13,
                                cursor: "pointer", transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Courses() {

    const navigate = useNavigate();

    const [active,        setActive]        = useState("Add Courses");
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
                const raw = res.data;
                const list =
                    Array.isArray(raw)          ? raw         :
                    Array.isArray(raw?.data)    ? raw.data    :
                    Array.isArray(raw?.result)  ? raw.result  :
                    Array.isArray(raw?.items)   ? raw.items   :
                    [];
                setCourses(list);
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
                { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
            );
            const contentType = res.headers["content-type"] || "application/pdf";
            const blob = new Blob([res.data], { type: contentType });
            const url  = window.URL.createObjectURL(blob);
            if (contentType.includes("pdf")) {
                const tab = window.open(url, "_blank");
                if (!tab) {
                    const a = document.createElement("a");
                    a.href = url; a.download = "registration-form.pdf"; a.click();
                }
            } else {
                const ext = contentType.includes("excel") || contentType.includes("spreadsheet") ? "xlsx"
                    : contentType.includes("word") ? "docx" : "file";
                const a = document.createElement("a");
                a.href = url; a.download = `registration-form.${ext}`; a.click();
            }
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
            addToast("📄 Registration form ready!", "success");
        } catch (err) {
            addToast(`❌ Could not fetch registration form (${err.response?.status ?? "network error"}).`, "error");
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

    const filtered = courses.filter(c => {
        const name = getCourseName(c, 0).toLowerCase();
        const code = getCourseCode(c).toLowerCase();
        const q    = search.toLowerCase();
        return name.includes(q) || code.includes(q);
    });

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="adm-root">

            <style>{`
                @keyframes slideIn  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
                @keyframes popUp    { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes spin     { to{transform:rotate(360deg)} }

                .course-row {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:14px 20px; border-radius:10px; background:#fff;
                    border:1px solid #E2E8F0; margin-bottom:10px;
                    animation:fadeUp 0.3s ease both;
                    transition:box-shadow 0.2s,border-color 0.2s;
                }
                .course-row:hover { box-shadow:0 4px 18px rgba(79,134,247,0.10); border-color:#BFD3FD; }
                .btn-add {
                    display:flex;align-items:center;gap:6px;
                    padding:8px 18px;border-radius:8px;border:none;
                    background:#4FBF6F;color:#fff;
                    font-size:13px;font-weight:600;cursor:pointer;
                    transition:background 0.18s,transform 0.15s;
                }
                .btn-add:hover:not(:disabled){background:#3aaa5a;transform:scale(1.04);}
                .btn-add:disabled{opacity:0.55;cursor:not-allowed;}
                .btn-show-courses {
                    display:flex;align-items:center;gap:8px;
                    padding:11px 22px;border-radius:10px;border:2px solid #4F86F7;
                    background:#fff;color:#4F86F7;
                    font-size:14px;font-weight:700;cursor:pointer;
                    transition:background 0.18s,color 0.18s,transform 0.15s,box-shadow 0.18s;
                }
                .btn-show-courses:hover{background:#4F86F7;color:#fff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,134,247,0.25);}
                .btn-print {
                    display:flex;align-items:center;gap:8px;
                    padding:11px 22px;border-radius:10px;border:none;
                    background:linear-gradient(135deg,#4F86F7,#A855F7);color:#fff;
                    font-size:14px;font-weight:700;cursor:pointer;
                    transition:opacity 0.18s,transform 0.15s,box-shadow 0.18s;
                    box-shadow:0 4px 14px rgba(79,134,247,0.30);
                }
                .btn-print:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);box-shadow:0 8px 24px rgba(79,134,247,0.35);}
                .btn-print:disabled{opacity:0.55;cursor:not-allowed;}
                .search-box {
                    display:flex;align-items:center;gap:10px;
                    background:#fff;border:1.5px solid #E2E8F0;
                    border-radius:10px;padding:10px 16px;margin-bottom:20px;
                    transition:border-color 0.2s;
                }
                .search-box:focus-within{border-color:#4F86F7;}
                .search-box input{border:none;outline:none;flex:1;font-size:14px;color:#1E293B;background:transparent;}
                .spin{animation:spin 0.8s linear infinite;display:inline-block;}
            `}</style>

            <Toast toasts={toasts} />

            {/* ── My Courses Modal ── */}
            {showModal && (
                <MyCoursesModal token={token} onClose={() => setShowModal(false)} />
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
                                <span className="adm-navIcon">{Icon && <Icon />}</span>
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
                        <button className="adm-logoutPill" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <main className="adm-content">

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: 18 }}>
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
                        <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 24, minHeight: "60vh" }}>

                            {/* Header row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <FiBookOpen style={{ color: "#4F86F7", fontSize: 22 }} />
                                <span style={{ fontWeight: 700, fontSize: 18, color: "#1E293B" }}>
                                    Available Courses
                                </span>
                                <span style={{
                                    background: "#4F86F7", color: "#fff",
                                    fontSize: 12, fontWeight: 700,
                                    borderRadius: 999, padding: "2px 10px", marginLeft: 4,
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
                                display: "flex", justifyContent: "space-between",
                                padding: "8px 20px", marginBottom: 6,
                                fontSize: 12, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                                <span>Course Name</span>
                                <span>Actions</span>
                            </div>

                            {/* Rows */}
                            {filtered.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8", fontSize: 15 }}>
                                    <FiBookOpen style={{ fontSize: 40, opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
                                    No courses found.
                                </div>
                            ) : (
                                filtered.map((course, idx) => {
                                    const name     = getCourseName(course, idx);
                                    const code     = getCourseCode(course);
                                    const isAdding = actionLoading[course.id] === "add";
                                    const busy     = isAdding;

                                    return (
                                        <div
                                            key={course.id ?? idx}
                                            className="course-row"
                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 10,
                                                    background: AVATARS[idx % AVATARS.length],
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
                                                }}>
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>{name}</div>
                                                    {code && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{code}</div>}
                                                </div>
                                            </div>

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

                            {/* Bottom actions */}
                            <div style={{
                                display: "flex", justifyContent: "flex-end",
                                gap: 14, marginTop: 30, paddingTop: 20,
                                borderTop: "1px solid #E2E8F0",
                            }}>
                                <button className="btn-show-courses" onClick={() => setShowModal(true)}>
                                    <FiList style={{ fontSize: 16 }} />
                                    My Courses
                                </button>
                                <button className="btn-print" onClick={handlePrint} disabled={printing}>
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

            {sidebarOpen && (
                <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}