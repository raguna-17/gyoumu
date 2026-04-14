import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/auth/authApi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);

            // 👇 ここが核心
            const token = res.token || res.access;
            localStorage.setItem("token", token);

            alert("ログイン成功");

            navigate("/home");
        } catch (err) {
            alert("ログイン失敗");
            console.error(err);
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

                <button type="submit">ログイン</button>
            </form>

            <p>
                アカウントない？ <Link to="/register">登録はこちら</Link>
            </p>
        </div>
    );
};

export default Login;