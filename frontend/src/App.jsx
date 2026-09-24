import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import VerifyOtpPage from "./Auth/VerifyOtpPage";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage";
import VerifyOtpForgotPage from "./Auth/VerifyOtpForgotPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage";
import AnalyzePage from "./pages/analyzepage";
import StudentPage from "./pages/StudentPage";
import HistoryPage from "./pages/HistoryPage";
import ResultsPage from "./pages/resultspage";
import { ToastProvider } from "./components/Toast";

import Layout from "./components/Layout";
import "./style/component.css";
import "./style/styles.css";

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    {/* Halaman dengan Header, Navbar, Footer */}
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Homepage />
                            </Layout>
                        }
                    />

                    <Route
                        path="/analyze"
                        element={
                            <Layout>
                                <AnalyzePage />
                            </Layout>
                        }
                    />

                    <Route
                        path="/analyze/result"
                        element={
                            <Layout>
                                <ResultsPage />
                            </Layout>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <Layout>
                                <HistoryPage />
                            </Layout>
                        }
                    />

                    <Route
                        path="/student"
                        element={
                            <Layout>
                                <StudentPage />
                            </Layout>
                        }
                    />

                    {/* Halaman auth, tanpa Header/Navbar/Footer */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-otp" element={<VerifyOtpPage />} />

                    {/* Halaman Lupa Password */}
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/forgot-password/verify-otp" element={<VerifyOtpForgotPage />} />
                    <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;