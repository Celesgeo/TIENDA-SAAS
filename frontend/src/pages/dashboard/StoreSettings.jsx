import { useState } from 'react';
import toast from 'react-hot-toast';
import { Globe, Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { ShareBar } from '../../components/ShareBar.jsx';

const fonts = ['Inter', 'DM Sans', 'Playfair Display', 'Space Grotesk'];
const layouts = [
  { id: 'grid', label: 'Cuadrícula' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'magazine', label: 'Revista' },
];

export function StoreSettings() {
  const { store, refresh, setStore } = useAuth();
  const [name, setName] = useState(store.name);
  const [slug, setSlug] = useState(store.slug);
  const [customDomain, setCustomDomain] = useState(store.customDomain || '');
  const [logoUrl, setLogoUrl] = useState(store.logoUrl || '');
  const [theme, setTheme] = useState(store.theme || {});
  const [busy, setBusy] = useState(false);

  const publicUrl = `${window.location.origin}/shop/${store.slug}`;

  async function saveStore(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api('/api/store', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          slug,
          customDomain,
          logoUrl,
          theme,
        }),
      });
      setStore(data);
      await refresh();
      toast.success('Tienda guardada');
    } catch (err) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    try {
      const data = await api('/api/store/publish', { method: 'POST' });
      setStore(data);
      await refresh();
      toast.success('Tienda publicada');
    } catch {
      toast.error('No se pudo publicar');
    } finally {
      setBusy(false);
    }
  }

  async function unpublish() {
    setBusy(true);
    try {
      const data = await api('/api/store/unpublish', { method: 'POST' });
      setStore(data);
      await refresh();
      toast.success('Tienda despublicada');
    } catch {
      toast.error('Error');
    } finally {
      setBusy(false);
    }
  }

  function patchTheme(partial) {
    setTheme((t) => ({ ...t, ...partial }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Diseño y publicación</h1>
        <p className="text-slate-600">
          Personaliza colores y tipografía. Publica para activar la tienda pública.
        </p>
      </div>

      <Card className="border-emerald-100 bg-emerald-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Estado</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {store.published ? 'Publicada' : 'Borrador'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              URL: <span className="font-mono text-xs">{publicUrl}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {store.published ? (
              <Button variant="secondary" onClick={unpublish} disabled={busy}>
                Despublicar
              </Button>
            ) : (
              <Button onClick={publish} disabled={busy}>
                <Rocket className="h-4 w-4" />
                Publicar tienda
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          En producción puedes mapear <code className="rounded bg-white px-1">*.tudominio.com</code> a esta
          ruta y guardar tu dominio personalizado abajo.
        </p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Compartir</h2>
        <div className="mt-4">
          <ShareBar url={publicUrl} title={store.name} />
        </div>
      </Card>

      <form onSubmit={saveStore} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Identidad</h2>
          <div className="mt-4 space-y-4">
            <Input label="Nombre de la tienda" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              label="URL (slug)"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              required
            />
            <Input
              label="Logo (URL)"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
            />
            <Input
              label={
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Dominio personalizado (opcional)
                </span>
              }
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="tienda.tumarca.com"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Tema</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Color principal</span>
              <input
                type="color"
                value={theme.primaryColor || '#6366f1'}
                onChange={(e) => patchTheme({ primaryColor: e.target.value })}
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Acento</span>
              <input
                type="color"
                value={theme.accentColor || '#0ea5e9'}
                onChange={(e) => patchTheme({ accentColor: e.target.value })}
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Fondo</span>
              <input
                type="color"
                value={theme.backgroundColor || '#fafafa'}
                onChange={(e) => patchTheme({ backgroundColor: e.target.value })}
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Tipografía</span>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                value={theme.fontFamily || 'Inter'}
                onChange={(e) => patchTheme({ fontFamily: e.target.value })}
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">Layout de catálogo</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => patchTheme({ layout: l.id })}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                    (theme.layout || 'grid') === l.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={!!theme.darkMode}
              onChange={(e) => patchTheme({ darkMode: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            <span className="text-sm font-medium text-slate-800">Modo oscuro en la tienda pública</span>
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="!px-8" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
