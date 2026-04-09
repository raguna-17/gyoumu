import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../auth/authApi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            alert("ログイン成功！");
            navigate("/tasks");
        } catch (err) {
            alert("ログインに失敗しました");
        }
    };

    return (
        <div>
            <h2>ログイン</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">ログイン</button>
            </form>
            <p>
                新規登録は <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>こちら</span>
            </p>
        </div>
    );
}