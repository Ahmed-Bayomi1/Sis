import './HomeAffaris.css';
import './Teacher.css';
import './AffairsCourses.css';

import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";

import {
    FiMenu,
    FiLogOut,
    FiUsers,
    FiClipboard,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";

const SidebarItems = [
    { label: "Overview", icon: FiClipboard, path: "/HomeAffaris" },
    { label: "Students", icon: FaGraduationCap, path: "/StudentReview" },
    { label: "Teachers", icon: FaChalkboardTeacher, path: "/Teacher" },
    { label: "Courses", icon: FiUsers, path: "/AffairsCourses" },
    { label: "Tables", icon: FiUsers, path: "/Tables" },
];

export default function LayoutOnly() {

    const navigate = useNavigate();

    const [active, setActive] = useState("Courses");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [adminName] = useState(localStorage.getItem("userName") || "Admin");
    const [adminEmail] = useState(localStorage.getItem("userEmail") || "admin@met.com");

    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [credits, setCredits] = useState("");
    const [academicYear, setAcademicYear] = useState("");

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");

    const [prerequisites, setPrerequisites] = useState([]);
    const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);

    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingPrerequisites, setLoadingPrerequisites] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AffairsLogin");
    };

    // ✅ Fetch Doctors
    const fetchDoctors = async () => {
        try {
            setLoadingDoctors(true);

            const res = await axios.get(
                "https://ssis.runasp.net/api/v1/admin/doctors",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            let data = res.data;
            if (data.data) data = data.data;

            setDoctors(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    // ✅ Fetch Prerequisites
    const fetchPrerequisites = async () => {
        try {
            setLoadingPrerequisites(true);

            const res = await axios.get(
                "https://ssis.runasp.net/api/v1/Courses",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            let data = res.data;
            if (data.data) data = data.data;

            setPrerequisites(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPrerequisites(false);
        }
    };

    // ✅ Checkbox handler
    const handleCheckboxChange = (id) => {

        setSelectedPrerequisites(prev => {

            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }

        });
    };

    // ✅ Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!courseName || !courseCode || !credits || !academicYear) {
            setSubmitError("Please fill all required fields");
            return;
        }

        try {

            setSubmitLoading(true);
            setSubmitError("");
            setSuccessMsg("");

            const courseData = {
                name: courseName,
                code: courseCode,
                credits: Number(credits),
                academicYear,
                doctorId: selectedDoctor || null,
                prerequisiteIds: selectedPrerequisites
            };

            const res = await axios.post(
                "https://ssis.runasp.net/api/v1/Courses/with-pre",
                courseData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(res.data);

            setSuccessMsg("✅ Course added successfully!");

            setCourseName("");
            setCourseCode("");
            setCredits("");
            setAcademicYear("");
            setSelectedDoctor("");
            setSelectedPrerequisites([]);

        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Failed to add course";

            setSubmitError(message);

        } finally {
            setSubmitLoading(false);
        }
    };

    return (

        <div className="adm-root">

            <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>

                <div className="adm-brand">
                    <div className="adm-brandMark">FCI</div>
                    <div className="adm-brandText">Luxor</div>
                </div>

                <nav className="adm-nav">
                    {SidebarItems.map((it) => {
                        const Icon = it.icon;
                        const isActive = active === it.label;

                        return (
                            <button
                                key={it.label}
                                className={`adm-navItem ${isActive ? "active" : ""}`}
                                onClick={() => {
                                    setActive(it.label);
                                    navigate(it.path);
                                }}
                            >
                                <Icon /> {it.label}
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

            <div className="adm-main">

                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button className="adm-hamburger" onClick={() => setSidebarOpen(s => !s)}>
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">Add Course</div>
                    </div>

                    <div className="adm-topbarRight">
                        <div>{adminName} ({adminEmail})</div>
                        <button className="adm-logoutPill" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <main className="adm-content">

                    <div className="adm-panelCard">

                        <div className="adm-panelTitle">Add New Course</div>

                        <form onSubmit={handleSubmit} className="course-form">

                            <input className="course-input" placeholder="Course Name"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />

                            <input className="course-input" placeholder="Course Code"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                            />

                            <input type="number" className="course-input" placeholder="Credits"
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                            />

                            <input className="course-input" placeholder="Academic Year"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                            />

                            {/* Doctors */}
                            <div className="course-group">
                                <button type="button" onClick={fetchDoctors} className="course-load-btn">
                                    Load Doctors
                                </button>

                                <select className="course-select"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.fullName || d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ✅ CHECKBOX Prerequisites */}
                            <div className="course-group">

                                <button type="button" onClick={fetchPrerequisites} className="course-load-btn">
                                    Load Prerequisites
                                </button>

                                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                                    {prerequisites.map(c => (
                                        <label key={c.id} style={{ display: "block", marginBottom: "6px" }}>
                                            <input
                                                type="checkbox"
                                                value={c.id}
                                                checked={selectedPrerequisites.includes(c.id)}
                                                onChange={() => handleCheckboxChange(c.id)}
                                            />
                                            {" "}{c.name}
                                        </label>
                                    ))}
                                </div>

                            </div>

                            {submitError && <p style={{ color: "red" }}>{submitError}</p>}
                            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

                            <button type="submit" className="course-submit">
                                {submitLoading ? "Saving..." : "Save Course"}
                            </button>

                        </form>

                    </div>

                </main>

            </div>

        </div>
    );
}