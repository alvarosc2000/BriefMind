'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

async function loginUser(name: string, password: string) {
  const res = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error en login');
  }
  return res.json();
}

async function registerUser(name: string, email: string, password: string) {
  const res = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error en registro');
  }
  return res.json();
}

export default function LoginRegister() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      if (isLogin) {
        const data = await loginUser(name, password);
        setMessage(`Bienvenido ${data.user.name}`);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.id.toString());
        localStorage.setItem('user_name', data.user.name);
        localStorage.setItem('user_brief', data.user.briefs_available.toString());
        localStorage.setItem('subscription_plan', data.user.subscription_plan);

        // Redirigir según condición needsPayment
        if (data.user.needsPayment) {
          router.push('/Checkout');
        } else {
          router.push('/BriefForm');
        }
      } else {
        const data = await registerUser(name, email, password);
        setMessage('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0F172A] text-white font-sans flex items-center justify-center px-4">
      <AnimatedBackground />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#1e2a47] w-full max-w-lg p-10 rounded-2xl shadow-xl backdrop-blur-md"
      >
        <h2 className="text-4xl font-bold text-center mb-8 select-none">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Usuario"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full text-lg px-5 py-4 bg-[#0F172A] text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {!isLogin && (
            <>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full text-lg px-5 py-4 bg-[#0F172A] text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full text-lg px-5 py-4 bg-[#0F172A] text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full text-lg px-5 py-4 bg-[#0F172A] text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {message && <p className="text-green-400 mt-4 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-gray-900 text-lg font-semibold py-4 rounded-xl transition duration-300"
        >
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </button>

        <p className="text-center mt-6 text-gray-400 text-sm">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setError('');
              setMessage('');
              setConfirmPassword('');
              setIsLogin(!isLogin);
            }}
            className="text-cyan-400 hover:underline font-medium"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </form>
    </main>
  );
}

function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 bg-gradient-to-tr from-cyan-900 via-blue-900 to-indigo-900 animate-gradient-x"
      style={{
        backgroundSize: '400% 400%',
      }}
    />
  );
}
