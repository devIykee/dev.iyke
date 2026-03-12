export default function Footer() {
  return (
    <footer className="footer-section container">
      <div className="footer-top">
        <div className="footer-col">
          <h3 className="footer-heading">Header</h3>
          <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare cursus sed nunc eget dictum. Sed ornare cursus sed nunc eget dictumd nunc eget dictum. Sed ornare cursus sed nunc eget dictum.
          </p>
          <div className="footer-socials">
             <span className="social-icon">O</span>
             <span className="social-icon">O</span>
             <span className="social-icon">O</span>
             <span className="social-icon">O</span>
          </div>
        </div>
        <div className="footer-col" style={{gridColumn: "2 / span 1"}}>
          <h3 className="footer-heading">Header Text</h3>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
        </div>
        <div className="footer-col" style={{gridColumn: "3 / span 1"}}>
          <h3 className="footer-heading">Header Text</h3>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
        </div>
        <div className="footer-col" style={{gridColumn: "4 / span 1"}}>
          <h3 className="footer-heading">Header Text</h3>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
          <a href="#" className="footer-link">Button</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2026 © All Right Reserved</p>
        <p>Developed By : Iyke</p>
      </div>
    </footer>
  );
}
