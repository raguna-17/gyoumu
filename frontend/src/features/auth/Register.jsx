import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../auth/authApi";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, password);
            alert("ユーザー登録成功！ログイン画面に移動します");
            navigate("/login");
        } catch (err) {
            // 既に登録済みかどうかをサーバーのレスポンスで判定
            if (err.response && err.response.status === 400 && err.response.data.email) {
                alert("すでにこのユーザーは登録済みです");
            } else {
                alert("登録に失敗しました");
            }
        }
    };

    return (
        <div>
            <h2>ユーザー登録</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">登録</button>
            </form>
            <p>
                ログインは <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>こちら</span>
            </p>
        </div>
    );
}