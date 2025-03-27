import React, { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [products, setProducts] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  useEffect(() => {
    if ((toastMessage === 'Producto eliminado exitosamente' || toastMessage === 'Producto agregado exitosamente') && showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, showToast]);

  const handleDelete = async (productId) => {
    setPendingDelete(productId);
    setToastMessage('¿Estás seguro de que deseas eliminar este producto?');
    setShowToast(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/${pendingDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      await response.json();
      setProducts(products.filter(product => product._id !== pendingDelete));
      setToastMessage('Producto eliminado exitosamente');
      setShowToast(true);
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error al eliminar el producto');
      setShowToast(true);
    } finally {
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => {
    setPendingDelete(null);
    setToastMessage('');
    setShowToast(false);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '34px' }}>Lista de Productos</h1>

      { /* form of products */ }
      <form onSubmit={async (e) => {
        e.preventDefault();

        const name = e.target[0].value;
        const price = e.target[1].value;
        const description = e.target[2].value;

        const res = await fetch(`${BACKEND_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, price, description })
        });

        const data = await res.json();
        setProducts([...products, data]);
        e.target.reset();
        setToastMessage('Producto agregado exitosamente');
        setShowToast(true);
      }} style={{ margin: '10px', padding: '10px', borderRadius: '5px', justifyContent: 'center', display: 'flex' }}>
        <input required type="text" placeholder="Nombre" style={{ 
          color: '#fff',
          backgroundColor: '#292929',
          margin: '10px',
          padding: '12px',
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px'
        }} />
        <input required type="number" placeholder="Precio" step="0.01" style={{ 
          color: '#fff',
          backgroundColor: '#292929',
          margin: '10px',
          padding: '12px',
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px'
        }} />
        <input  type="text" placeholder="Descripcion" style={{ 
          color: '#fff',
          backgroundColor: '#292929',
          margin: '10px',
          padding: '12px',
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px'
        }} />
        <button type="submit" style={{ 
          margin: '10px',
          padding: '12px 24px',
          background: '#000000',
          color: 'white',
          fontWeight: '600',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }} >Agregar Producto</button>
      </form>

      { /* Products list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {products.map(product => {
          return (
            <div key={product._id} style={{
              background: '#292929',
              border: '1px solid #333',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              position: 'relative',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <h2 style={{
                fontSize: '28px',
                color: '#fff',
                marginBottom: '10px',
                fontWeight: '600'
              }}>{product.name}</h2>
              <p style={{
                fontSize: '18px',
                color: '#A4A4A4',
                marginTop: '15px',
                marginBottom: '15px'
              }}>B/.{product.price}</p>
              <p style={{
                fontSize: '14px',
                color: '#858585',
                lineHeight: '1.5'
              }}>{product.description}</p>
              <button 
                onClick={() => handleDelete(product._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  border: '1px solid #444',
                  width: '24px',
                  height: '24px',
                  borderRadius: '20%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: '#ff4444',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <span style={{
                  width: '12px',
                  height: '2px',
                  background: '#fff',
                  position: 'absolute',
                  transform: 'rotate(45deg)'
                }}></span>
                <span style={{
                  width: '12px',
                  height: '2px',
                  background: '#fff',
                  position: 'absolute',
                  transform: 'rotate(-45deg)'
                }}></span>
              </button>
            </div>
          )
        })}
      </div>

      { /* Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#292929',
          color: '#fff',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px'
          }}>{toastMessage}</p>
          {pendingDelete !== null && (
            <div style={{
              display: 'flex',
              gap: '10px',
              marginLeft: 'auto'
            }}>
              <button
                onClick={confirmDelete}
                style={{
                  background: '#ff4444',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Sí
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App