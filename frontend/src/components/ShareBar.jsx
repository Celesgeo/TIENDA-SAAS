import { Copy, Instagram, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from './ui/Button.jsx';

export function ShareBar({ url, title = 'Mi tienda' }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const ig = `https://www.instagram.com/`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600">Compartir</span>
      <a href={wa} target="_blank" rel="noreferrer">
        <Button variant="secondary" className="!py-2 !px-3">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </a>
      <a href={ig} target="_blank" rel="noreferrer" title="Abrir Instagram">
        <Button variant="secondary" className="!py-2 !px-3">
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </a>
      <Button
        variant="ghost"
        className="!py-2"
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success('Enlace copiado');
        }}
      >
        <Copy className="h-4 w-4" />
        Copiar enlace
      </Button>
    </div>
  );
}
