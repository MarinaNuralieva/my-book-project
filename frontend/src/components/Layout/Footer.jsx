export default function Footer() {
  return (
    <footer style={{
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column', // вертикальный стек
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontFamily: 'sans-serif',
      padding: '10px 0'
    }}>
      <p>Адрес: г. Бишкек, Чуй 178</p>
      <p>
        Instagram:{" "}
        <a
          href="https://www.instagram.com/ваш_аккаунт"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', textDecoration: 'underline' }}
        >
          @vavilon_bookskg
        </a>
      </p>
      <p>
        WhatsApp:{" "}
        <a
          href="https://wa.me/996509299509"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', textDecoration: 'underline' }}
        >
          +996509299509
        </a>
      </p>
    </footer>
  );
}
