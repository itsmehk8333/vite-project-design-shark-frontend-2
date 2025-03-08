

function AdminPage() {
  return (
    <div
      style={{
        backgroundColor: '#000', // Dark background matching your theme
        minHeight: '100vh', // Full viewport height
        color: '#fff', // White text for contrast
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif', // Basic font
        padding: '20px', // Some padding for breathing room
      }}
    >
      <div
        style={{
          backgroundColor: '#2c2c2c', // Slightly lighter dark gray for the content box
          padding: '40px',
          borderRadius: '10px', // Rounded corners
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Subtle shadow
          textAlign: 'center',
          width: '80%',
          maxWidth: '600px', // Maximum width for readability
        }}
      >
        <h1 style={{ fontSize: '2.5em', marginBottom: '20px', color: '#ff5722' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '1.2em', color: '#bbb' }}>
          Welcome to the admin panel. Manage your content and settings here.
        </p>
      </div>
    </div>
  );
}

export default AdminPage;