import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import LearnMorePage from "./pages/learnmorepage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import AnalyzePage from "./pages/analyzepage";

import Layout from "./components/Layout";
import "./style/component.css";
import "./style/styles.css";

function App() {
    return (
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
                    path="/learn-more"
                    element={
                        <Layout>
                            <LearnMorePage />
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

                {/* Halaman auth, tanpa Header/Navbar/Footer */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;