import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute    from './PublicRoute';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Public / Intro
const IntroPage           = lazy(() => import('../Components/IntroPage/IntroPage'));

// Authentication — Student
const StudentRegister     = lazy(() => import('../Components/Authentication/StudentsRsgister'));
const StudentLogin        = lazy(() => import('../Components/Authentication/StudentLogin'));

// Authentication — Doctor
const DoctorRegister      = lazy(() => import('../Components/Authentication/DoctorRegister'));
const DoctorLogin         = lazy(() => import('../Components/Authentication/DoctorLogin'));

// Authentication — Affairs
const AffairsRegister     = lazy(() => import('../Components/Authentication/AffairsRegister'));
const AffairsLogin        = lazy(() => import('../Components/Authentication/AffairsLogin'));

// Protected — Student dashboard
const HomeStudent         = lazy(() => import('../Components/Student/HomeStudent'));
const Courses             = lazy(() => import('../Components/Student/Courses'));
const Grades              = lazy(() => import('../Components/Student/Grades'));
const Payment             = lazy(() => import('../Components/Student/Payment'));
const Sch                 = lazy(() => import('../Components/Student/Sch'));

// Protected — Doctor dashboard
const HomeDoctor          = lazy(() => import('../Components/Doctor/HomeDoctor'));
const Coursesa            = lazy(() => import('../Components/Doctor/Coursesa'));

// Protected — Affairs dashboard
const HomeAffaris         = lazy(() => import('../Components/Affairs/HomeAffaris'));
const StudentReview       = lazy(() => import('../Components/Affairs/StudentReview'));
const Teacher             = lazy(() => import('../Components/Affairs/Teacher'));
const AffairsCourses      = lazy(() => import('../Components/Affairs/AffairsCourses'));
const Tables              = lazy(() => import('../Components/Affairs/Tables'));

// 404
const NotFound            = lazy(() => import('../pages/NotFound'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#0a3f8e',
      }}
    >
      Loading…
    </div>
  );
}

// ─── Route tree ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
  {/* Intro page — fully public, no guard at all */}
  <Route path="/" element={<IntroPage />} />

  {/* Auth pages — redirect away if already logged in */}
  <Route element={<PublicRoute />}>
    <Route path="/StudentsRegister"  element={<StudentRegister />} />
    <Route path="/StudentsRsgister"  element={<Navigate to="/StudentsRegister" replace />} />
    <Route path="/StudentLogin"      element={<StudentLogin />} />
    <Route path="/DoctorRegister"    element={<DoctorRegister />} />
    <Route path="/DoctorLogin"       element={<DoctorLogin />} />
    <Route path="/AffairsRegister"   element={<AffairsRegister />} />
    <Route path="/AffairsLogin"      element={<AffairsLogin />} />
  </Route>

  {/* Protected — Student */}
  <Route element={<ProtectedRoute redirectTo="/StudentLogin" />}>
    <Route path="/HomeStudent" element={<HomeStudent />} />
    <Route path="/Courses"     element={<Courses />} />
    <Route path="/Grades"      element={<Grades />} />
    <Route path="/Payment"     element={<Payment />} />
    <Route path="/Sch"          element={<Sch />} />
  </Route>

  {/* Protected — Doctor */}
  <Route element={<ProtectedRoute redirectTo="/DoctorLogin" />}>
    <Route path="/HomeDoctor" element={<HomeDoctor />} />
    <Route path="/Coursesa"   element={<Coursesa />} />
  </Route>

  {/* Protected — Affairs */}
  <Route element={<ProtectedRoute redirectTo="/AffairsLogin" />}>
    <Route path="/HomeAffaris"    element={<HomeAffaris />} />
    <Route path="/StudentReview"  element={<StudentReview />} />
    <Route path="/Teacher"        element={<Teacher />} />
    <Route path="/AffairsCourses" element={<AffairsCourses />} />
    <Route path="/Tables"         element={<Tables />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
    </Suspense>
  );
}