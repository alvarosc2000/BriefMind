import { useState } from 'react';
import axios from 'axios';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setForm({ username: '', email: '', password: '' });
    setError('');
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const url = mode === 'register' ? '/api/users/register' : '/api/users/login';
      const payload = mode === 'register' ? form : { email: form.email, password: form.password };
      const res = await axios.post(url, payload);

      if (mode === 'login') {
        setMessage(`Bienvenido, ${res.data.user.username}`);
        // Guardar token si deseas: localStorage.setItem("token", res.data.token);
      } else {
        setMessage('Usuario registrado correctamente');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar datos');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-md rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>
      {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
      {message && <div className="text-green-500 text-sm mb-2 text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
        >
          {mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>
      </form>
      <p className="text-sm mt-4 text-center text-gray-600">
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          onClick={toggleMode}
          className="text-indigo-600 font-semibold hover:underline"
        >
          {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
}
