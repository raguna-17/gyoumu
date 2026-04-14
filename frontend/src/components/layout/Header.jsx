import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authApi";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ padding: "10px", background: "#ddd" }}>
            <span>My App</span>
            <button onClick={handleLogout} style={{ float: "right" }}>
                ログアウト
            </button>
        </div>
    );
};

export default Header;