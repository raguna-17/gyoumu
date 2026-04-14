import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h2>ホーム</h2>

            <ul>
                <li>
                    <Link to="/projects">プロジェクトへ</Link>
                </li>
               
            </ul>
        </div>
    );
};

export default Home;