import './header.css';

const Header = () => {
  return (
    <footer className="header">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="header-content">
        <ul className="header-links">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Header;
