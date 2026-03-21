import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register({ name, storeName, email, password });
      toast.success('Cuenta creada');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.message || 'No se pudo registrar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
        <p className="mt-1 text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input label="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Nombre de la tienda"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Ej. Luna Beauty"
          />
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full !py-3" disabled={busy}>
            {busy ? 'Creando…' : 'Registrarme'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
