import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/auth/authApi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login(email, password);

            // JWT取得（統一済み想定）
            const access = res.access;

            localStorage.setItem("access", access);

            alert("ログイン成功");

            navigate("/home");

        } catch (err) {
            const data = err?.data;

            // DRF / SimpleJWT対応
            if (data?.detail) {
                alert(data.detail);
            } else if (data?.non_field_errors) {
                alert(data.non_field_errors[0]);
            } else {
                alert("ログイン失敗");
            }

            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>ログイン</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="メール"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />

                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
            </form>

            <p>
                アカウントない？{" "}
                <Link to="/register">登録はこちら</Link>
            </p>
        </div>
    );
};

export default Login;