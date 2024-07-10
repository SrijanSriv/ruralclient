import LoginSection from "../components/LoginSection";
import { Navbar } from "../components/Navbar";

export default function Login() {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <LoginSection />
            </div>
        </>
    )
}