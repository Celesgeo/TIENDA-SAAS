import { Link, useParams, useSearchParams } from 'react-router-dom';

export function CheckoutReturn() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const status = params.get('status');

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Gracias</h1>
      <p className="mt-4 text-slate-600">
        {status === 'success' && 'Tu pago fue procesado. Te contactaremos si hace falta.'}
        {status === 'pending' && 'Tu pago está pendiente de confirmación.'}
        {status === 'failure' && 'El pago no se completó. Podés intentar de nuevo.'}
        {!['success', 'pending', 'failure'].includes(status) && 'Volviste del checkout.'}
      </p>
      <Link
        to={`/shop/${slug}`}
        className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
