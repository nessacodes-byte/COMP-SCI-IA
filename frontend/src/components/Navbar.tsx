import { Flower2, House } from "lucide-react";

export default function Navbar() {
  return (
    <nav>
      <div className="logo">
        <Flower2 />
        <p>Assign Me</p>
      </div>
      <div className="nav-links">
        <button id="home-btn">
          <House />
          <p>Home</p>
        </button>
        <button id="reg-btn">Register</button>
        <button id="log-btn">Log In</button>
      </div>
    </nav>
  );
}
