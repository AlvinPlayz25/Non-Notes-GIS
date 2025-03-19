import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
// Dashboard page removed
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import NotesPage from "./components/pages/notes";
import NoteViewer from "./components/notes/NoteViewer";
import CreateNotePage from "./components/pages/create-note";
import ProfilePage from "./components/pages/profile";
// Settings page temporarily disabled
// import SettingsPage from "./components/pages/settings";
import AboutPage from "./components/pages/about";
import DebugPage from "./components/pages/debug";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen, LoadingSpinner } from "./components/ui/loading-spinner";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        {/* Dashboard page removed */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/create" element={<CreateNotePage />} />
        <Route path="/notes/:id" element={<NoteViewer />} />
        <Route path="/success" element={<Success />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        {/* Settings page temporarily disabled
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        /> */}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen text="Loading application..." />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
