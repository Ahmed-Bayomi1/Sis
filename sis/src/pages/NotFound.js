import { useNavigate } from 'react-router-dom';

/**
 * NotFound (404)
 * Shown for any route that doesn't match.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#0a3f8e', margin: 0 }}>
        404
      </h1>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#666', maxWidth: '400px', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="border-0 text-bg-primary p-2 px-4 rounded"
        style={{ cursor: 'pointer', fontSize: '1rem' }}
      >
        Back to Home
      </button>
    </div>
  );
}