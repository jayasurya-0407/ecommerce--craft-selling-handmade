export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="container footer-content">
        <div className="brand">
          <h2>Haan Handmade</h2>
          <p>From Hands to Heart</p>
        </div>
        <div className="socials">
          <a href="#">Instagram</a>
          <a href="#">WhatsApp</a>
          <a href="#">Email</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} Haan Handmade. All rights reserved.</p>
      </div>
    </footer>
  );
}
