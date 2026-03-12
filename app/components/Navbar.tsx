import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link href="#motion" className="nav-link">Motion</Link>
          <Link href="#developer" className="nav-link active">Developer</Link>
          <Link href="#writer" className="nav-link">Writer</Link>
        </div>
      </div>
    </nav>
  );
}
