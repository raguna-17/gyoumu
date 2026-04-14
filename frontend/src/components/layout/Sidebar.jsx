import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div style={{ width: "200px", background: "#eee", padding: "20px" }}>
            <h3>Menu</h3>

            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/projects">Projects</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;