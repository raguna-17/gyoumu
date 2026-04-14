import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../features/auth/authApi";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            alert("登録成功。ログインしてください");
            navigate("/login");
        } catch (err) {
            console.log(err.response);

            // Django REST Framework想定
            if (err.response && err.response.data) {
                const data = err.response.data;

                if (data.email) {
                    alert("このメールアドレスは既に登録されています");
                    return;
                }
            }

            alert("登録失敗");
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
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                <button type="submit">登録</button>
            </form>

            <p>
                もうアカウントある？ <Link to="/login">ログインへ</Link>
            </p>
        </div>
    );
};

export default Register;