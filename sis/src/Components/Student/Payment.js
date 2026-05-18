import './HomeStudent.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";

import {
    FiMenu, FiLogOut, FiClipboard, FiBookOpen,
    FiAlertCircle, FiLoader, FiCreditCard, FiCheckCircle,
    FiClock, FiXCircle, FiDollarSign, FiEdit2,
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaChalkboardTeacher,
    FaCalendarCheck,
} from "react-icons/fa";

// ─── Injected styles ──────────────────────────────────────────────────────────
const PAYMENT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

  .pay-content {
    padding: 28px 24px;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
  }

  .pay-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pay-page-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.4px;
  }

  .pay-badge {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .pay-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .pay-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
    animation: fadeUp 0.4s ease both;
  }

  .pay-card:hover {
    box-shadow: 0 12px 40px rgba(14,165,233,0.13);
    border-color: #bae6fd;
    transform: translateY(-3px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pay-card:nth-child(2) { animation-delay: 0.07s; }
  .pay-card:nth-child(3) { animation-delay: 0.14s; }
  .pay-card:nth-child(4) { animation-delay: 0.21s; }
  .pay-card:nth-child(5) { animation-delay: 0.28s; }
  .pay-card:nth-child(6) { animation-delay: 0.35s; }

  .pay-card-accent { height: 5px; width: 100%; }
  .pay-card-accent.pending  { background: linear-gradient(90deg,#f59e0b,#fbbf24); }
  .pay-card-accent.paid     { background: linear-gradient(90deg,#10b981,#34d399); }
  .pay-card-accent.overdue  { background: linear-gradient(90deg,#ef4444,#f87171); }
  .pay-card-accent.partial  { background: linear-gradient(90deg,#8b5cf6,#a78bfa); }
  .pay-card-accent.default  { background: linear-gradient(90deg,#0ea5e9,#38bdf8); }

  .pay-card-body {
    padding: 20px 20px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pay-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .pay-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    flex: 1;
  }

  .pay-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .pay-status-chip.pending { background:#fef3c7; color:#b45309; }
  .pay-status-chip.paid    { background:#d1fae5; color:#065f46; }
  .pay-status-chip.overdue { background:#fee2e2; color:#991b1b; }
  .pay-status-chip.partial { background:#ede9fe; color:#6d28d9; }
  .pay-status-chip.default { background:#e0f2fe; color:#0369a1; }

  .pay-card-desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.55;
  }

  .pay-amounts-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .pay-amt-box {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .pay-amt-box.total-box  { grid-column: span 2; border-color:#bae6fd; background:#f0f9ff; }
  .pay-amt-box.paid-box   { border-color:#bbf7d0; background:#f0fdf4; }
  .pay-amt-box.remain-box { border-color:#fde68a; background:#fffbeb; }

  .pay-amt-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #94a3b8;
  }
  .pay-amt-box.total-box  .pay-amt-label { color:#0369a1; }
  .pay-amt-box.paid-box   .pay-amt-label { color:#16a34a; }
  .pay-amt-box.remain-box .pay-amt-label { color:#b45309; }

  .pay-amt-value {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
  }
  .pay-amt-box.total-box  .pay-amt-value { color:#0369a1; font-size:14px; }
  .pay-amt-box.paid-box   .pay-amt-value { color:#16a34a; }
  .pay-amt-box.remain-box .pay-amt-value { color:#b45309; }

  .pay-amt-currency {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    margin-left: 2px;
  }

  .pay-progress-wrap { margin-top: 2px; }

  .pay-progress-track {
    height: 6px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }

  .pay-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg,#10b981,#34d399);
    transition: width 0.5s ease;
  }

  .pay-progress-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    margin-top: 5px;
    text-align: right;
  }

  .pay-card-meta { display:flex; flex-direction:column; gap:7px; }

  .pay-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: #64748b;
    font-weight: 500;
  }

  .pay-meta-row svg { color:#94a3b8; font-size:13px; flex-shrink:0; }

  .pay-card-footer {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pay-input-group { display:flex; flex-direction:column; gap:5px; }

  .pay-input-label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pay-input-row {
    display: flex;
    align-items: center;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: #f8fafc;
    transition: border-color 0.15s ease;
  }

  .pay-input-row:focus-within { border-color:#0ea5e9; background:#fff; }
  .pay-input-row.has-error    { border-color:#ef4444; background:#fff5f5; }

  .pay-input-currency {
    padding: 0 10px;
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
    background: transparent;
    border-right: 1.5px solid #e2e8f0;
    height: 40px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .pay-amount-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0 12px;
    height: 40px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    color: #0f172a;
    outline: none;
    width: 0;
  }

  .pay-input-max-btn {
    padding: 0 12px;
    height: 40px;
    border: none;
    border-left: 1.5px solid #e2e8f0;
    background: transparent;
    font-size: 11px;
    font-weight: 800;
    color: #0ea5e9;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease;
    font-family: 'Syne', sans-serif;
  }
  .pay-input-max-btn:hover { background:#e0f2fe; }

  .pay-input-error { font-size:11px; color:#ef4444; font-weight:600; }

  .pay-btn {
    width: 100%;
    padding: 12px;
    border-radius: 14px;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.18s ease;
    letter-spacing: 0.3px;
  }

  .pay-btn.primary {
    background: linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(14,165,233,0.35);
  }

  .pay-btn.primary:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(14,165,233,0.5);
    transform: translateY(-1px);
  }

  .pay-btn.primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .pay-btn.paid-btn {
    background: #f0fdf4;
    color: #16a34a;
    border: 1.5px solid #bbf7d0;
    cursor: default;
  }

  .pay-btn-spinner { animation: spin 0.8s linear infinite; font-size:15px; }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .pay-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 90px 20px;
    text-align: center;
  }

  .pay-state svg { font-size:40px; }

  .pay-state-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
  }

  .pay-state-sub {
    font-size: 13px;
    color: #64748b;
    max-width: 320px;
    line-height: 1.5;
  }

  .pay-retry-btn {
    padding: 10px 24px;
    background: #0ea5e9;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
    margin-top: 4px;
    transition: background 0.15s ease;
  }
  .pay-retry-btn:hover { background:#0284c7; }

  .pay-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    background: #0f172a;
    color: #fff;
    padding: 14px 20px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    animation: slideIn 0.25s ease;
    max-width: 340px;
  }

  .pay-toast.success { border-left:4px solid #10b981; }
  .pay-toast.error   { border-left:4px solid #ef4444; }

  @keyframes slideIn {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .pay-summary { display:flex; gap:14px; margin-bottom:24px; flex-wrap:wrap; }

  .pay-summary-item {
    flex: 1;
    min-width: 120px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pay-summary-label {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .pay-summary-value {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
  }

  .pay-summary-value.green { color:#16a34a; }
  .pay-summary-value.amber { color:#b45309; }
  .pay-summary-value.red   { color:#dc2626; }

  @media (max-width:600px) {
    .pay-grid    { grid-template-columns:1fr; }
    .pay-summary { gap:10px; }
  }
`;

// ─── Sidebar config ───────────────────────────────────────────────────────────
const SidebarItems = [
    { label: "Overview",    icon: FiClipboard },
    { label: "Courses", icon: FaGraduationCap },
    { label: "Grades",      icon: FaChalkboardTeacher },
    { label: "Payment",     icon: FiBookOpen },
    { label: "Schedule",    icon: FaCalendarCheck },   // ← added
];

const NAV_ROUTES = {
    Overview:      "/HomeStudent",
    "Courses": "/Courses",
    Grades:        "/Grades",
    Payment:       "/Payment",
    Schedule:      "/Schedule",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatusInfo(fee) {
    const totalAmt  = Number(fee.amount      ?? fee.totalAmount ?? fee.dueAmount ?? 0);
    const paidAmt   = Number(fee.paidAmount  ?? fee.amountPaid  ?? fee.paid      ?? 0);
    const remaining = Number(fee.remainingAmount ?? fee.remaining ?? (totalAmt - paidAmt));

    const raw = (fee.status ?? fee.paymentStatus ?? fee.feeStatus ?? "").toString().toLowerCase();

    if (raw === "paid" || raw === "1" || remaining <= 0)
        return { label: "Paid",    cls: "paid",    icon: <FiCheckCircle /> };

    if (raw === "partial" || raw === "3" || (paidAmt > 0 && remaining > 0))
        return { label: "Partial", cls: "partial", icon: <FiEdit2 /> };

    if (raw === "overdue" || raw === "2")
        return { label: "Overdue", cls: "overdue", icon: <FiXCircle /> };

    return { label: "Pending", cls: "pending", icon: <FiClock /> };
}

function fmt(val) {
    return Number(val ?? 0).toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(val) {
    if (!val) return null;
    try { return new Date(val).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return val; }
}

// ─── Fee Card ─────────────────────────────────────────────────────────────────
function FeeCard({ fee, onPay }) {
    const [paying,     setPaying]     = useState(false);
    const [inputVal,   setInputVal]   = useState("");
    const [inputError, setInputError] = useState("");

    const status = getStatusInfo(fee);

    const id          = fee.id          ?? fee.feeId       ?? fee.Id;
    const name        = fee.feeName     ?? fee.name        ?? fee.title        ?? fee.description ?? "Fee";
    const description = fee.description ?? fee.details     ?? fee.notes        ?? null;
    const totalAmt    = Number(fee.amount ?? fee.totalAmount ?? fee.dueAmount  ?? 0);
    const paidAmt     = Number(fee.paidAmount ?? fee.amountPaid ?? fee.paid    ?? 0);
    const remaining   = Number(fee.remainingAmount ?? fee.remaining ?? (totalAmt - paidAmt));
    const dueDate     = fee.dueDate     ?? fee.due_date    ?? fee.deadline     ?? null;
    const semester    = fee.semester    ?? fee.term        ?? null;
    const isPaid      = status.cls === "paid";

    const paidPct = totalAmt > 0 ? Math.min(100, Math.round((paidAmt / totalAmt) * 100)) : 0;

    const validate = (val) => {
        const num = Number(val);
        if (!val || isNaN(num) || num <= 0)  return "Please enter a valid amount.";
        if (num > remaining)                  return `Max allowed: ${fmt(remaining)} EGP`;
        return "";
    };

    const handleChange = (e) => {
        setInputVal(e.target.value);
        if (inputError) setInputError("");
    };

    const handleSetMax = () => { setInputVal(String(remaining)); setInputError(""); };

    const handlePay = async () => {
        const err = validate(inputVal);
        if (err) { setInputError(err); return; }
        setPaying(true);
        await onPay(id, Number(inputVal));
        setPaying(false);
    };

    return (
        <div className="pay-card">
            <div className={`pay-card-accent ${status.cls}`} />

            <div className="pay-card-body">
                <div className="pay-card-top">
                    <div className="pay-card-name">{name}</div>
                    <span className={`pay-status-chip ${status.cls}`}>
                        {status.icon} {status.label}
                    </span>
                </div>

                {description && description !== name && (
                    <div className="pay-card-desc">{description}</div>
                )}

                <div className="pay-amounts-block">
                    <div className="pay-amt-box total-box">
                        <span className="pay-amt-label">Total Fee</span>
                        <span className="pay-amt-value">{fmt(totalAmt)}<span className="pay-amt-currency">EGP</span></span>
                    </div>
                    <div className="pay-amt-box paid-box">
                        <span className="pay-amt-label">Paid</span>
                        <span className="pay-amt-value">{fmt(paidAmt)}<span className="pay-amt-currency">EGP</span></span>
                    </div>
                    <div className="pay-amt-box remain-box">
                        <span className="pay-amt-label">Remaining</span>
                        <span className="pay-amt-value">{fmt(remaining)}<span className="pay-amt-currency">EGP</span></span>
                    </div>
                </div>

                {totalAmt > 0 && (
                    <div className="pay-progress-wrap">
                        <div className="pay-progress-track">
                            <div className="pay-progress-fill" style={{ width: `${paidPct}%` }} />
                        </div>
                        <div className="pay-progress-label">{paidPct}% paid</div>
                    </div>
                )}

                <div className="pay-card-meta">
                    {dueDate && (
                        <div className="pay-meta-row"><FiClock /> Due: {formatDate(dueDate)}</div>
                    )}
                    {semester && (
                        <div className="pay-meta-row"><FaGraduationCap /> {semester}</div>
                    )}
                </div>
            </div>

            <div className="pay-card-footer">
                {isPaid ? (
                    <button className="pay-btn paid-btn" disabled>
                        <FiCheckCircle /> Fully Paid
                    </button>
                ) : (
                    <>
                        <div className="pay-input-group">
                            <span className="pay-input-label">Amount to pay</span>
                            <div className={`pay-input-row ${inputError ? "has-error" : ""}`}>
                                <span className="pay-input-currency">EGP</span>
                                <input
                                    className="pay-amount-input"
                                    type="number"
                                    min="1"
                                    max={remaining}
                                    step="0.01"
                                    placeholder={`1 – ${fmt(remaining)}`}
                                    value={inputVal}
                                    onChange={handleChange}
                                />
                                <button
                                    className="pay-input-max-btn"
                                    type="button"
                                    onClick={handleSetMax}
                                    tabIndex={-1}
                                >
                                    Full
                                </button>
                            </div>
                            {inputError && <span className="pay-input-error">{inputError}</span>}
                        </div>

                        <button
                            className="pay-btn primary"
                            onClick={handlePay}
                            disabled={paying}
                        >
                            {paying
                                ? <><FiLoader className="pay-btn-spinner" /> Redirecting…</>
                                : <><FiCreditCard /> Pay {inputVal ? `${fmt(Number(inputVal))} EGP` : "Now"}</>
                            }
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`pay-toast ${type}`}>
            {type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{msg}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Payment() {
    const navigate = useNavigate();

    const [active,       setActive]      = useState("Payment");
    const [sidebarOpen,  setSidebarOpen] = useState(false);
    const [studentName]                  = useState(localStorage.getItem("userName")  || "Student");
    const [studentEmail]                 = useState(localStorage.getItem("userEmail") || "student@met.com");

    const [fees,    setFees]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [toast,   setToast]   = useState(null);

    // ─── Inject styles ────────────────────────────────────────────────────────
    useEffect(() => {
        const id = "payment-extra-styles";
        if (!document.getElementById(id)) {
            const s = document.createElement("style");
            s.id = id;
            s.textContent = PAYMENT_STYLES;
            document.head.appendChild(s);
        }
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // ─── Auth header ─────────────────────────────────────────────────────────
    const authHeader = useCallback(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken") || "";
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    // ─── Fetch fees ───────────────────────────────────────────────────────────
    const fetchFees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://ssis.runasp.net/api/Fees/my-fees", {
                headers: { "Content-Type": "application/json", ...authHeader() },
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error("Session expired — please log in again.");
                throw new Error(`Server error (${res.status})`);
            }
            const data = await res.json();
            const list = Array.isArray(data)
                ? data
                : data.data ?? data.fees ?? data.result ?? data.items ?? [];
            setFees(list);
        } catch (e) {
            setError(e.message || "Failed to load fees.");
        } finally {
            setLoading(false);
        }
    }, [authHeader]);

    useEffect(() => { fetchFees(); }, [fetchFees]);

    // ─── Initiate payment ─────────────────────────────────────────────────────
    const handlePay = useCallback(async (feeId, amount) => {
        try {
            const returnUrl = `${window.location.origin}/Payment?status=success`;
            const res = await fetch("https://ssis.runasp.net/api/Payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ feeId, amount, returnUrl }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Payment failed (${res.status})`);
            }

            const data = await res.json();
            const paymentUrl = data.paymentUrl ?? data.url ?? data.redirectUrl ?? null;

            if (paymentUrl) {
                setToast({ msg: "Redirecting to payment gateway…", type: "success" });
                setTimeout(() => { window.location.href = paymentUrl; }, 900);
            } else {
                throw new Error("No payment URL returned from server.");
            }
        } catch (e) {
            setToast({ msg: e.message || "Payment initiation failed.", type: "error" });
        }
    }, [authHeader]);

    // ─── Summary stats ────────────────────────────────────────────────────────
    const totalFees   = fees.length;
    const paidFees    = fees.filter(f => getStatusInfo(f).cls === "paid").length;
    const pendingFees = fees.filter(f => getStatusInfo(f).cls !== "paid").length;
    const totalDue    = fees
        .filter(f => getStatusInfo(f).cls !== "paid")
        .reduce((s, f) => {
            const total   = Number(f.amount      ?? f.totalAmount ?? f.dueAmount ?? 0);
            const paid    = Number(f.paidAmount  ?? f.amountPaid  ?? f.paid      ?? 0);
            const remain  = Number(f.remainingAmount ?? f.remaining ?? (total - paid));
            return s + remain;
        }, 0);

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/StudentLogin");
    }, [navigate]);

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
                        <div className="adm-topbarTitle">Payment</div>
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

                <main className="pay-content">

                    {loading && (
                        <div className="pay-state">
                            <FiLoader style={{ color: "#0ea5e9", animation: "spin 1s linear infinite" }} />
                            <div className="pay-state-title">Loading your fees…</div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="pay-state">
                            <FiAlertCircle style={{ color: "#ef4444" }} />
                            <div className="pay-state-title">Could not load fees</div>
                            <div className="pay-state-sub">{error}</div>
                            <button className="pay-retry-btn" onClick={fetchFees}>Try Again</button>
                        </div>
                    )}

                    {!loading && !error && fees.length === 0 && (
                        <div className="pay-state">
                            <FiDollarSign style={{ color: "#d1d5db" }} />
                            <div className="pay-state-title">No fees found</div>
                            <div className="pay-state-sub">You have no outstanding or past fees at the moment.</div>
                        </div>
                    )}

                    {!loading && !error && fees.length > 0 && (
                        <>
                            <div className="pay-page-header">
                                <div className="pay-page-title">My Fees</div>
                                <span className="pay-badge">{totalFees} fee{totalFees !== 1 ? "s" : ""}</span>
                            </div>

                            <div className="pay-summary">
                                <div className="pay-summary-item">
                                    <span className="pay-summary-label">Remaining Due</span>
                                    <span className="pay-summary-value red">
                                        {fmt(totalDue)}
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}> EGP</span>
                                    </span>
                                </div>
                                <div className="pay-summary-item">
                                    <span className="pay-summary-label">Pending / Partial</span>
                                    <span className="pay-summary-value amber">{pendingFees}</span>
                                </div>
                                <div className="pay-summary-item">
                                    <span className="pay-summary-label">Fully Paid</span>
                                    <span className="pay-summary-value green">{paidFees}</span>
                                </div>
                            </div>

                            <div className="pay-grid">
                                {fees.map((fee, idx) => (
                                    <FeeCard
                                        key={fee.id ?? fee.feeId ?? fee.Id ?? idx}
                                        fee={fee}
                                        onPay={handlePay}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {sidebarOpen && (
                <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {toast && (
                <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}