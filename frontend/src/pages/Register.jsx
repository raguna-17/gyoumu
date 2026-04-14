import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../features/auth/authApi";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(email, password);

            alert("登録成功。ログインしてください");

            navigate("/login");

        } catch (err) {
            const data = err?.data;

            // 新API形式（統一後）
            if (data?.error === "validation_error") {
                const fields = data.fields;

                if (fields?.email) {
                    alert(fields.email[0]);
                    return;
                }

                if (fields?.password) {
                    alert(fields.password[0]);
                    return;
                }
            }

            // DRF直返し互換（保険）
            if (data?.email) {
                const msg = Array.isArray(data.email)
                    ? data.email[0]
                    : data.email;

                alert(msg);
                return;
            }

            alert("登録失敗");
            console.error("Register error:", err);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>ユーザー登録</h2>

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
                    placeholder="パスワード（4文字以上）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "登録中..." : "登録"}
                </button>
            </form>

            <p>
                もうアカウントある？{" "}
                <Link to="/login">ログインへ</Link>
            </p>
        </div>
    );
};

export default Register;