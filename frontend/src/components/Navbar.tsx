import { Flower2, House, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../authContext";

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <nav>
      <div className="logo">
        <Flower2 />
        <p>Assign Me</p>
      </div>
      <div className="nav-links">
        <Link href="/" className="nav-btn">
          <House />
          <p>Home</p>
        </Link>
        <Link href="/user" className="nav-btn">
          <User />
          <p>Profile</p>
        </Link>
        <button id="log-btn" onClick={() => logout()}>
          Log Out
        </button>
      </div>
    </nav>
  );
}
