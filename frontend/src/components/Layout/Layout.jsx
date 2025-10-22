import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      {/* Хедер */}
      <header>
        <Header />
      </header>

      {/* Основной контент с Sidebar и main */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: '20px',
        padding: '20px'
      }}>
        <aside style={{
          width: '220px',
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          overflowY: 'auto'  // включаем прокрутку, если список жанров большой
        }}>
          <Sidebar />
        </aside>

        <main style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          minHeight: '60vh'
        }}>
          {children}
        </main>
      </div>

      {/* Футер */}
      <footer style={{ marginTop: '20px' }}>
        <Footer />
      </footer>
    </div>
  );
}
