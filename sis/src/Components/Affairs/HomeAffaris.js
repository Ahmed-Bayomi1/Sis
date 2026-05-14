    import './HomeAffaris.css';
    import { useNavigate } from 'react-router-dom';
    import { useMemo, useState } from "react";
    import {
    FiMenu,
    FiSearch,
    FiLogOut,
    FiUsers,
    FiBookOpen,
    FiClipboard,
    } from "react-icons/fi";
    import { FaGraduationCap, FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";
    import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Label,
    } from "recharts";


    const SidebarItems = [
    { label: "Overview", icon: FiClipboard },
    { label: "Students", icon: FaGraduationCap },
    { label: "Teachers", icon: FaChalkboardTeacher },
    { label: "Assignments", icon: FiBookOpen },
    { label: "Internal Marks", icon: FiBookOpen },
    { label: "Semester Results", icon: FiBookOpen },
    { label: "Download Notes", icon: FiBookOpen },
    { label: "Dues", icon: FiBookOpen },
    { label: "Dues & Approvals", icon: FiBookOpen },
    { label: "Time Table", icon: FiBookOpen },
    { label: "Circular", icon: FiBookOpen },
    { label: "Events", icon: FiBookOpen },
    ];

    export default function HomeAffaris() {
    const [active, setActive] = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const statCards = useMemo(
        () => [
        {
            title: "Total Students",
            value: "240",
            color: "#0EA5E9",
            icon: <FaGraduationCap />,
        },
        {
            title: "Total Staff",
            value: "15",
            color: "#00A6FF",
            icon: <FiUsers />,
        },
        {
            title: "Pass Percentage",
            value: "90%",
            color: "#00C2FF",
            icon: <FaCheckCircle />,
        },
        ],
        []
    );

    const batchRows = useMemo(
        () => [
        { year: "I", batch: "2022-2026", pass: "95%" },
        { year: "II", batch: "2021-2025", pass: "90%" },
        { year: "III", batch: "2020 - 2024", pass: "90%" },
        { year: "IV", batch: "2019 - 2023", pass: "85%" },
        ],
        []
    );

    const pieData = useMemo(
        () => [
        { name: "I Year", value: 15, color: "#10B981" },   // green
        { name: "II Year", value: 25, color: "#4F7CFF" },  // blue
        { name: "III Year", value: 30, color: "#F59E0B" }, // orange
        { name: "IV Year", value: 30, color: "#7C3AED" },  // purple
        ],
        []
    );

    return (
        <div className="adm-root">
        {/* Sidebar */}
        <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="adm-brand">
            <div className="adm-brandMark">M</div>
            <div className="adm-brandText">MET</div>
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
                    // close on mobile after click
                    setSidebarOpen(false);
                    }}
                    type="button"
                >
                    <span className="adm-navIcon">
                    <Icon />
                    </span>
                    <span className="adm-navLabel">{it.label}</span>
                </button>
                );
            })}
            </nav>

            <div className="adm-sidebarBottom">
            <button className="adm-logoutBtn" type="button" onClick={() => alert("Logout")}>
                <FiLogOut /> Logout
            </button>
            </div>
        </aside>

        {/* Main */}
        <div className="adm-main">
            {/* Top bar */}
            <header className="adm-topbar">
            <div className="adm-topbarLeft">
                <button
                className="adm-hamburger"
                type="button"
                onClick={() => setSidebarOpen((s) => !s)}
                aria-label="Toggle sidebar"
                >
                <FiMenu />
                </button>

                <div className="adm-topbarTitle">{active}</div>
            </div>

            <div className="adm-topbarRight">
                <div className="adm-user">
                <div className="adm-userAvatar">🧑‍💼</div>
                <div className="adm-userMeta">
                    <div className="adm-userName">admin</div>
                    <div className="adm-userEmail">(admin@met.com)</div>
                </div>
                </div>
                <button className="adm-logoutPill" type="button" onClick={() => alert("Logout")}>
                Logout
                </button>
            </div>
            </header>

            {/* Content */}
            <main className="adm-content">
            {/* Welcome */}
            <div className="adm-welcomeCard">
                <div className="adm-welcomeText">
                Welcome Admin <span className="adm-welcomeBold">(admin@met.com)</span>
                </div>
            </div>

            {/* Stat cards */}
            <section className="adm-statGrid">
                {statCards.map((c) => (
                <div key={c.title} className="adm-statCard" style={{ borderColor: c.color }}>
                    <div className="adm-statIcon" style={{ color: c.color, borderColor: c.color }}>
                    {c.icon}
                    </div>
                    <div className="adm-statInfo">
                    <div className="adm-statTitle">{c.title}</div>
                    <div className="adm-statValue">{c.value}</div>
                    </div>
                </div>
                ))}
            </section>

            {/* Bottom panels */}
            <section className="adm-panels">
                {/* Table Card */}
                <div className="adm-panelCard">
                <div className="adm-panelTitle">Batch Overview</div>

                <div className="adm-tableWrap">
                    <table className="adm-table">
                    <thead>
                        <tr>
                        <th>Year</th>
                        <th>Batch</th>
                        <th>Pass Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batchRows.map((r) => (
                        <tr key={r.year}>
                            <td>{r.year}</td>
                            <td>{r.batch}</td>
                            <td>{r.pass}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

                {/* Pie Card */}
                <div className="adm-panelCard">
                <div className="adm-panelTitle">Assignment Submission Status</div>

                <div className="adm-pieWrap">
                    <div className="adm-pieChart">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={3}
                            stroke="none"
                        >
                            {/* Labels around pie */}
                            <Label
                            content={({ x, y, value, index }) => {
                                const d = pieData[index];
                                if (!d) return null;

                                const px = x;
                                const py = y;

                                // place label a bit further out using simple offsets
                                // (recharts supplies x,y in label space; keep it readable)
                                return (
                                <text
                                    x={px}
                                    y={py}
                                    fill={d.color}
                                    fontSize={12}
                                    fontWeight={800}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {d.name} {d.value}%
                                </text>
                                );
                            }}
                            />

                            {pieData.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>

                    <div className="adm-legendRow">
                    {pieData.map((d) => (
                        <div key={d.name} className="adm-legendItem">
                        <span
                            className="adm-legendSwatch"
                            style={{ backgroundColor: d.color }}
                        />
                        {d.name}
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </section>
            </main>
        </div>
        </div>
    );
    }