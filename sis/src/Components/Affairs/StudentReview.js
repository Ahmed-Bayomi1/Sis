import './HomeAffaris.css';
import './StudentReview.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FiMenu, FiLogOut, FiUsers, FiClipboard,
} from "react-icons/fi";

import { FaGraduationCap, FaChalkboardTeacher, FaTrophy } from "react-icons/fa";

const BASE_URL = "https://ssis.runasp.net/";

const SidebarItems = [
    { label: "Overview",         icon: FiClipboard },
    { label: "Students",         icon: FaGraduationCap },
    { label: "Teachers",         icon: FaChalkboardTeacher },
    { label: "Courses",      icon: FiUsers },
];

export default function StudentReview() {
    const navigate = useNavigate();

    const [active, setActive] = useState("Students");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [adminName, setAdminName] = useState(localStorage.getItem("userName") || "Admin");
    const [adminEmail, setAdminEmail] = useState(localStorage.getItem("userEmail") || "admin@met.com");

    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        navigate("/AffairsLogin");
    };
    const handleTeachersClick = () => {
    navigate("/Teacher");
};

    // Fetch Pending Students
    useEffect(() => {
        const fetchPendingStudents = async () => {
            try {
                setLoading(true);
                setLoadError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    setLoadError("No token found. Please login again.");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(
                    "https://ssis.runasp.net/api/v1/admin/pending-students",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                let data = res.data;
                if (data.data) data = data.data;
                if (data.result) data = data.result;
                if (data.payload) data = data.payload;
                if (data.students) data = data.students;

                setPendingStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoadError("Failed to load pending students.");
                setLoading(false);
            }
        };

        fetchPendingStudents();
    }, []);

    // Open file in new tab (No alerts)
    const openFileInNewTab = (filePath, fileType) => {
        if (!filePath) {
            console.warn(`No ${fileType} file available for this student.`);
            return;
        }

        const fullUrl = BASE_URL + filePath;
        console.log(`Opening ${fileType}: ${fullUrl}`);

        window.open(fullUrl, '_blank');
    };

    const handleAccept = async (studentId) => {
        if (!window.confirm("Accept this student?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `https://ssis.runasp.net/api/v1/admin/approve-student/${studentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Student accepted successfully!");   // Kept this one as it's useful feedback
            setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        } catch (err) {
            alert("Failed to accept student.");
        }
    };

    const handleReject = async (studentId) => {
        if (!window.confirm("Reject this student?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `https://ssis.runasp.net/api/v1/admin/reject-student/${studentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Student rejected successfully!");   // Kept this one as it's useful feedback
            setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        } catch (err) {
            alert("Failed to reject student.");
        }
    };

    return (
        <div className="adm-root">
            {/* Sidebar */}
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
                    setSidebarOpen(false);

                    if (it.label === "Overview") {
                        navigate("/HomeAffaris");
                    } else if (it.label === "Students") {
                        navigate("/StudentReview");
                    } else if (it.label === "Teachers") {
                        navigate("/Teacher");
                    } else {
                        setActive(it.label);
                    }
                }}
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

            {/* Main Content */}
            <div className="adm-main">
                <header className="adm-topbar">
                    <div className="adm-topbarLeft">
                        <button className="adm-hamburger" onClick={() => setSidebarOpen(s => !s)}>
                            <FiMenu />
                        </button>
                        <div className="adm-topbarTitle">Pending Student Approvals</div>
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
                            Review and approve new student registrations
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: "18px" }}>
                            Loading pending students...
                        </div>
                    ) : loadError ? (
                        <div style={{ padding: 40, color: "red", textAlign: "center" }}>{loadError}</div>
                    ) : (
                        <div className="adm-panelCard">
                            <div className="adm-panelTitle">
                                <FaTrophy style={{ marginRight: "8px" }} /> Pending Students ({pendingStudents.length})
                            </div>

                            <div className="adm-tableWrap">
                                <table className="adm-table">
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>National ID</th>
                                            <th>Secondary Certificate</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingStudents.length > 0 ? (
                                            pendingStudents.map((student) => (
                                                <tr key={student.id || student._id}>
                                                    <td><strong>{student.fullName}</strong></td>
                                                    <td>{student.email}</td>
                                                    <td>{student.fullNumber || student.phoneNumber}</td>
                                                    <td>
                                                        <button 
                                                            className="view-btn"
                                                            onClick={() => openFileInNewTab(student.nationalIdImagePath, "National ID")}
                                                        >
                                                            View National ID
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="view-btn"
                                                            onClick={() => openFileInNewTab(student.secondarySchoolCertificatePath, "Secondary Certificate")}
                                                        >
                                                            View Certificate
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="accept-btn" onClick={() => handleAccept(student.id || student._id)}>
                                                            Accept
                                                        </button>
                                                        <button className="reject-btn" onClick={() => handleReject(student.id || student._id)}>
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                                                    No pending students at the moment.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}