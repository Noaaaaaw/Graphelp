import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import StudentProgressView from "../components/StudentProgressView";
import { SpaceHero } from "./ClassListPage";

export default function ParentChildProgressPage() {
    const { t } = useTranslation();
    const { studentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [user] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error(t("parentChildProgress.loginRequired"));
            navigate("/login");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch(`/parent/children/${studentId}/progress`);
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setProgressData(data);
                } else {
                    toast.error(
                        extractErrorMessage(
                            data,
                            t("parentChildProgress.errLoad", { status: res.status })
                        )
                    );
                    if (res.status === 403 || res.status === 404) {
                        navigate("/my-children");
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching parent child progress:", error);
                    toast.error(t("parentChildProgress.errConnect"));
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        initLoad();
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, studentId, navigate]);

    const student = progressData?.student;
    const classInfo = progressData?.class_info;

    const heroTitle = student
        ? t("parentChildProgress.heroTitleNamed", { name: student.name })
        : t("parentChildProgress.heroTitle");

    const heroSubtitle = classInfo
        ? t("parentChildProgress.heroDescClass", {
              className: classInfo.name,
              year: classInfo.academic_year,
              school: classInfo.school_name,
          })
        : t("parentChildProgress.heroDesc");

    return (
        <main className="student-page">
            <SpaceHero title={heroTitle} subtitle={heroSubtitle} />

            <section className="student-cardz">
                <section className="student-container">

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>{t("parentChildProgress.loading")}</p>
                        </div>
                    ) : !progressData ? (
                        <div className="gc-state-box">
                            <h3>{t("parentChildProgress.notFound")}</h3>
                        </div>
                    ) : (
                        <StudentProgressView
                            progressData={progressData}
                            isTeacher={false}
                        />
                    )}
                </section>
            </section>
        </main>
    );
}