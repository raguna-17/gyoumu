import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = () => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Header />

                <main style={{ padding: "20px" }}>
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;