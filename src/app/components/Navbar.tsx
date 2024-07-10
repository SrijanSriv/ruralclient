import Link from "next/link";

export function Navbar() {
    const cssProps = "hover:text-white border-2 border-black w-full text-center py-4 text-xl";
    return(
        <nav className="max-h-16 bg-slate-400">
            <div className="w-screen min-h-16 flex justify-around">
                <Link className={`${cssProps} bg-pink-300 hover:bg-pink-400`} href="/">Home</Link>
                <Link className={`${cssProps} bg-red-300 hover:bg-red-400`} href="/myreservation">My Reservations</Link>
                <Link className={`${cssProps} bg-amber-300 hover:bg-amber-400`} href="/cart">Cart</Link>
                <Link className={`${cssProps} bg-green-300 hover:bg-green-400`} href="/login">Login</Link>
            </div>
        </nav>
    )
}