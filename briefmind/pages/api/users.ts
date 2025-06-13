export async function loginUser(username: string, password: string) {
  const res = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}
