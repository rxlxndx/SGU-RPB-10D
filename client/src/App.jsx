import React, { useState, useEffect } from 'react';
import './App.css';

//  Construir URL desde variables de entorno
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'https';
const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '8081';
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const API_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}${API_BASE}`;

console.log('API_URL configurada:', API_URL);
function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingUser 
        ? `${API_URL}/users/${editingUser.id}`
        : `${API_URL}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar usuario');
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      await fetchUsers();
      setError('');
    } catch (err) {
      setError('Error al eliminar usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', correo: '', telefono: '' });
    setEditingUser(null);
    setShowForm(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Gestión de Usuarios</h1>
        <p className="subtitle">CRUD con Spring Boot y React</p>
      </header>

      <main className="main-content">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        <div className="actions-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={15}
                  placeholder="1234567890"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="users-container">
          <h2>Lista de Usuarios ({users.length})</h2>
          
          {loading && <div className="loading">Cargando...</div>}

          {!loading && users.length === 0 ? (
            <div className="empty-state">
              <p>No hay usuarios registrados</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Agregar el primero
              </button>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h3>{user.nombre}</h3>
                    <p><strong>📧</strong> {user.correo}</p>
                    <p><strong>📱</strong> {user.telefono}</p>
                    <p className="user-date">
                      Registrado: {new Date(user.fechaCreacion).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div className="user-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión de Usuarios - SGU Deployment</p>
      </footer>
    </div>
  );
}

export default App;