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
    FiX,
    FiClock,
    FiHome,
    FiCalendar,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaBookOpen,
} from "react-icons/fa";

const SidebarItems = [
    { label: "Overview", icon: FiClipboard,        path: "/HomeAffaris"    },
    { label: "Students", icon: FaGraduationCap,    path: "/StudentReview"  },
    { label: "Courses",  icon: FiUsers,             path: "/AffairsCourses" },
    { label: "Tables",   icon: FaChalkboardTeacher, path: "/Teacher"        },
];

const DAYS_OF_WEEK = [
    { value: 1, label: "Sunday"    },
    { value: 2, label: "Monday"    },
    { value: 3, label: "Tuesday"   },
    { value: 4, label: "Wednesday" },
    { value: 5, label: "Thursday"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCourseId(course) {
    const id =
        course.id        ??
        course.Id        ??
        course.courseId  ??
        course.CourseId  ??
        course._id       ??
        null;
    console.log("Resolved courseId:", id, "from course:", course);
    return id;
}

function getCourseName(course) {
    return (
        course.name       ||
        course.Name       ||
        course.courseName ||
        course.CourseName ||
        course.title      ||
        course.Title      ||
        "Unnamed Course"
    );
}

// "HH:mm" → "HH:mm:ss"
function toTimeSpan(t) {
    if (!t) return null;
    return t.length === 5 ? `${t}:00` : t;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tables() {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName]  = useState(localStorage.getItem("userName")  || "Admin");
    const [adminEmail] = useState(localStorage.getItem("userEmail") || "admin@met.com");

    const [courses,        setCourses]        = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [coursesError,   setCoursesError]   = useState("");

    const [popupOpen,      setPopupOpen]      = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [formData, setFormData] = useState({
        startTime: "",
        endTime:   "",
        room:      "",
        dayOfWeek: ""
    });
    const [formError,   setFormError]   = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [submitting,  setSubmitting]  = useState(false);

    // ── Logout ────────────────────────────────────────────────────────────────
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        navigate("/AffairsLogin");
    };

    // ── Fetch Courses ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                setCoursesError("");

                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/Courses",
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );

                console.log("=== RAW COURSES RESPONSE ===", JSON.stringify(res.data, null, 2));

                let data = res.data;
                if (data?.data)    data = data.data;
                if (data?.result)  data = data.result;
                if (data?.payload) data = data.payload;
                if (data?.courses) data = data.courses;

                console.log("=== FIRST COURSE OBJECT ===", JSON.stringify(data?.[0], null, 2));

                setCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Courses fetch error:", err);
                setCoursesError("Failed to load courses. Please try again.");
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    // ── Popup helpers ─────────────────────────────────────────────────────────
    const openPopup = (course) => {
        setSelectedCourse(course);
        setFormData({ startTime: "", endTime: "", room: "", dayOfWeek: "" });
        setFormError("");
        setFormSuccess("");
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
        setSelectedCourse(null);
        setFormError("");
        setFormSuccess("");
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ── Submit — tries flat body first, then dto-wrapped ─────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!formData.startTime || !formData.endTime || !formData.room || !formData.dayOfWeek) {
            setFormError("All fields are required.");
            return;
        }
        if (formData.startTime >= formData.endTime) {
            setFormError("End time must be after start time.");
            return;
        }

        const courseId = getCourseId(selectedCourse);
        if (courseId === null || courseId === undefined) {
            setFormError("Could not resolve course ID — see browser console.");
            return;
        }

        const token = localStorage.getItem("token");
        const headers = {
            Authorization:  `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const startTime = toTimeSpan(formData.startTime);
        const endTime   = toTimeSpan(formData.endTime);
        const room      = formData.room.trim();
        const dayOfWeek = parseInt(formData.dayOfWeek, 10);

        // We try three payload shapes in order until one succeeds
        const attempts = [
            // 1. Flat — camelCase
            { courseId, startTime, endTime, room, dayOfWeek },
            // 2. Flat — PascalCase
            { CourseId: courseId, StartTime: startTime, EndTime: endTime, Room: room, DayOfWeek: dayOfWeek },
            // 3. Nested under "dto" — camelCase
            { dto: { courseId, startTime, endTime, room, dayOfWeek } },
        ];

        try {
            setSubmitting(true);

            let lastError = null;

            for (let i = 0; i < attempts.length; i++) {
                const payload = attempts[i];
                console.log(`=== ATTEMPT ${i + 1} PAYLOAD ===`, JSON.stringify(payload, null, 2));

                try {
                    const response = await axios.post(
                        "https://ssis.runasp.net/api/v1/Schedules",
                        payload,
                        { headers }
                    );
                    console.log(`=== ATTEMPT ${i + 1} SUCCESS ===`, response.data);
                    setFormSuccess("Schedule created successfully!");
                    setTimeout(() => closePopup(), 1500);
                    return; // ← success, stop trying
                } catch (err) {
                    console.warn(`Attempt ${i + 1} failed:`, err?.response?.data);
                    lastError = err;
                }
            }

            // All attempts failed — show the most descriptive error
            const errData = lastError?.response?.data;
            let message = "Failed to create schedule. Please try again.";

            if (errData) {
                if (typeof errData === "string") {
                    message = errData;
                } else if (errData.message) {
                    message = errData.message;
                } else if (errData.title) {
                    const errors = errData.errors;
                    if (errors && typeof errors === "object") {
                        const allErrors = Object.values(errors).flat();
                        message = allErrors.length > 0 ? allErrors.join(" | ") : errData.title;
                    } else {
                        message = errData.title;
                    }
                }
            }

            setFormError(message);

        } finally {
            setSubmitting(false);
        }
    };

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

                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button className="adm-hamburger" onClick={() => setSidebarOpen(s => !s)}>
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">Tables</div>
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
                    {loadingCourses ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: "18px" }}>
                            Loading courses...
                        </div>
                    ) : coursesError ? (
                        <div style={{ padding: 40, color: "red", textAlign: "center" }}>
                            {coursesError}
                        </div>
                    ) : (
                        <div className="adm-panelCard">
                            <div className="adm-panelTitle">
                                <FaBookOpen style={{ marginRight: "8px" }} />
                                Courses ({courses.length})
                            </div>
                            {courses.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                                    No courses found.
                                </div>
                            ) : (
                                <ul className="tbl-courseList">
                                    {courses.map((course, index) => {
                                        const id   = getCourseId(course);
                                        const name = getCourseName(course);
                                        return (
                                            <li key={id ?? index} className="tbl-courseItem">
                                                <div className="tbl-courseInfo">
                                                    <span className="tbl-courseName">{name}</span>
                                                    {(course.code || course.Code) && (
                                                        <span className="tbl-courseCode">
                                                            {course.code || course.Code}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    className="tbl-scheduleBtn"
                                                    onClick={() => openPopup(course)}
                                                >
                                                    + Add Schedule
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </main>

            </div>

            {/* ── Modal ─────────────────────────────────────────────────────── */}
            {popupOpen && (
                <div className="tbl-overlay" onClick={closePopup}>
                    <div className="tbl-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="tbl-modalHeader">
                            <div className="tbl-modalTitle">Add Schedule</div>
                            <button className="tbl-closeBtn" onClick={closePopup}>
                                <FiX />
                            </button>
                        </div>

                        <div className="tbl-modalCourseBadge">
                            <FaBookOpen style={{ marginRight: 6 }} />
                            {getCourseName(selectedCourse)}
                            <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.6 }}>
                                ID: {getCourseId(selectedCourse)}
                            </span>
                        </div>

                        <form className="tbl-form" onSubmit={handleSubmit}>

                            <div className="tbl-formGroup">
                                <label className="tbl-label">
                                    <FiCalendar style={{ marginRight: 6 }} /> Day of Week
                                </label>
                                <select
                                    className="tbl-input tbl-select"
                                    name="dayOfWeek"
                                    value={formData.dayOfWeek}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Select a day --</option>
                                    {DAYS_OF_WEEK.map(d => (
                                        <option key={d.value} value={d.value}>
                                            {d.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="tbl-formGroup">
                                <label className="tbl-label">
                                    <FiClock style={{ marginRight: 6 }} /> Start Time
                                </label>
                                <input
                                    className="tbl-input"
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="tbl-formGroup">
                                <label className="tbl-label">
                                    <FiClock style={{ marginRight: 6 }} /> End Time
                                </label>
                                <input
                                    className="tbl-input"
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="tbl-formGroup">
                                <label className="tbl-label">
                                    <FiHome style={{ marginRight: 6 }} /> Room
                                </label>
                                <input
                                    className="tbl-input"
                                    type="text"
                                    name="room"
                                    placeholder="e.g. Room 101"
                                    value={formData.room}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {formError && (
                                <div className="tbl-formError">{formError}</div>
                            )}
                            {formSuccess && (
                                <div className="tbl-formSuccess">{formSuccess}</div>
                            )}

                            <button
                                className="tbl-submitBtn"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? "Trying..." : "Save Schedule"}
                            </button>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}