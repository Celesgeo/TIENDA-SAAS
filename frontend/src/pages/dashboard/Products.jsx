import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api, uploadFile } from '../../api/client.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'clothing',
  stock: '0',
  images: [],
};

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api('/api/products');
      setProducts(data);
    } catch {
      toast.error('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setModal('create');
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      images: p.images || [],
      _id: p._id,
    });
    setModal('edit');
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadFile(file);
      setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
      toast.success('Imagen subida');
    } catch (err) {
      toast.error(err.message || 'Error al subir');
    }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: form.images,
      };
      if (modal === 'create') {
        await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Producto creado');
      } else {
        await api(`/api/products/${form._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast.success('Producto actualizado');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Eliminado');
      load();
    } catch {
      toast.error('No se pudo eliminar');
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-600">Ropa y cosmética con stock e imágenes.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : products.length === 0 ? (
        <Card>
          <p className="text-slate-600">Aún no hay productos. Crea el primero.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <Card key={p._id} className="overflow-hidden !p-0">
              <div className="aspect-[4/3] bg-slate-100">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <p className="text-xs uppercase text-slate-500">{p.category}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    ${p.price.toLocaleString('es-AR')}
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                <p className="mt-2 text-xs text-slate-500">Stock: {p.stock}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="!py-2" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="ghost" className="!py-2 text-rose-600" onClick={() => remove(p._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900">
              {modal === 'create' ? 'Nuevo producto' : 'Editar producto'}
            </h2>
            <form onSubmit={save} className="mt-4 space-y-3">
              <Input
                label="Nombre"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Descripción</span>
                <textarea
                  className="min-h-[88px] w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Precio"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <Input
                  label="Stock"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Categoría</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="clothing">Ropa</option>
                  <option value="cosmetics">Cosmética</option>
                </select>
              </label>
              <div>
                <p className="text-sm font-medium text-slate-700">Imágenes</p>
                <input type="file" accept="image/*" className="mt-1 text-sm" onChange={onUpload} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images?.map((u) => (
                    <img key={u} src={u} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setModal(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
