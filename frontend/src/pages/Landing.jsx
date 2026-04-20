import { useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Compass,
  LandPlot,
  Leaf,
  Mail,
  MapPinned,
  Mountain,
  Phone,
  Sparkles,
  Trees,
  UserRound,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button.jsx';

const projectImage = '/termas-del-cerro.png';

const progressItems = [
  {
    icon: Mountain,
    title: 'Estudios geológicos realizados',
    text: 'Se relevaron las condiciones naturales y el comportamiento del entorno para proyectar un desarrollo sólido.',
  },
  {
    icon: LandPlot,
    title: 'Evaluación del terreno',
    text: 'El análisis del predio confirma el potencial para un destino termal de alto valor paisajístico y turístico.',
  },
  {
    icon: Compass,
    title: 'Avances en planificación',
    text: 'La visión integral ya ordena etapas, experiencia del visitante y crecimiento sostenible a largo plazo.',
  },
];

const reasons = [
  {
    icon: Sparkles,
    title: 'Crecimiento del turismo termal',
    text: 'El bienestar y las escapadas de naturaleza impulsan una demanda sostenida por destinos auténticos y memorables.',
  },
  {
    icon: Trees,
    title: 'Alta demanda de experiencias naturales',
    text: 'Viajeros y capital buscan proyectos que unan paisaje, desconexión y propuestas premium con identidad.',
  },
  {
    icon: MapPinned,
    title: 'Ubicación estratégica',
    text: 'El emplazamiento combina vistas, acceso y atractivo regional para consolidar una marca diferencial.',
  },
  {
    icon: BarChart3,
    title: 'Potencial de rentabilidad',
    text: 'La integración entre turismo, hospitalidad y valorización del activo abre una oportunidad de largo recorrido.',
  },
];

const galleryItems = [
  'Vista panorámica del desarrollo',
  'Circuito termal inmerso en la naturaleza',
  'Experiencia premium de descanso y contemplación',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Landing() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 110]);

  const stats = useMemo(
    () => [
      { value: 'Proyecto con visión', label: 'Desarrollo pensado para crecer por etapas' },
      { value: 'Bienestar + turismo', label: 'Una propuesta alineada con tendencias globales' },
      { value: 'Escala premium', label: 'Concepto exclusivo con fuerte valor emocional' },
    ],
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.nombre || !form.email || !form.telefono) {
      toast.error('Completá tus datos para recibir información.');
      return;
    }

    toast.success('Gracias. Te contactaremos con más información sobre Termas del Cerro.');
    setForm({ nombre: '', email: '', telefono: '' });
  };

  return (
    <div className="bg-[#f8f3ec] text-[#1f3d2b]">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-white/20 bg-[#1f3d2b]/65 px-4 py-3 shadow-soft backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a96a]/40 bg-white/10">
              <Leaf className="h-5 w-5 text-[#f5e9da]" />
            </div>
            <div>
              <p className="font-playfair text-lg text-white">Termas del Cerro</p>
              <p className="text-xs uppercase tracking-[0.35em] text-[#f5e9da]/70">
                Inversión privada
              </p>
            </div>
          </div>
          <a href="#contacto">
            <Button className="rounded-full border border-[#c8a96a] bg-[#c8a96a] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#1f3d2b] hover:bg-[#d5b57a]">
              Quiero ser parte
            </Button>
          </a>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-screen items-end overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${projectImage})`, y: heroY }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,18,0.35)_0%,rgba(10,25,18,0.52)_35%,rgba(10,25,18,0.85)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.24),transparent_30%)]" />

          <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <span className="inline-flex rounded-full border border-[#c8a96a]/60 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#f5e9da] backdrop-blur-sm">
                Oportunidad de inversión exclusiva
              </span>
              <h1 className="mt-6 font-playfair text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
                Termas del Cerro
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-[#f5e9da] sm:text-xl">
                Dónde la naturaleza se transforma en oportunidad.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Un desarrollo termal concebido para unir paisaje, bienestar y visión de
                futuro en una propuesta de alto valor emocional y proyección sostenible.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#contacto">
                  <Button className="rounded-full border border-[#c8a96a] bg-[#c8a96a] px-8 py-4 text-sm uppercase tracking-[0.22em] text-[#1f3d2b] hover:bg-[#d5b57a]">
                    Quiero ser parte
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-14 grid gap-4 lg:grid-cols-3"
            >
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md"
                >
                  <p className="font-playfair text-2xl text-white">{stat.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#f5e9da]/85">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[#8d7448]">Visión del proyecto</p>
            <h2 className="mt-4 font-playfair text-4xl leading-tight text-[#1f3d2b] sm:text-5xl">
              Un refugio termal pensado para perdurar.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#385644]">
              Termas del Cerro nace como un destino que integra hospitalidad, bienestar y
              naturaleza en una experiencia distintiva. Su esencia está en ofrecer descanso,
              contemplación y conexión con el entorno, elevando el valor del paisaje mediante
              un desarrollo sensible y sofisticado.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4b6855]">
              La propuesta se proyecta con una mirada de largo plazo: consolidar un polo de
              turismo termal con identidad propia, capaz de atraer visitantes, generar marca y
              construir una oportunidad de inversión con sentido de pertenencia.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="rounded-[32px] border border-[#d8c4a1] bg-white p-8 shadow-soft"
          >
            <div className="grid gap-6">
              {[
                {
                  title: 'Naturaleza como diferencial',
                  text: 'La geografía, las vistas y la experiencia termal convierten al lugar en un activo memorable.',
                },
                {
                  title: 'Bienestar con proyección',
                  text: 'El turismo orientado al descanso y la salud gana relevancia y sostiene nuevas oportunidades.',
                },
                {
                  title: 'Visión de largo plazo',
                  text: 'Cada decisión busca equilibrio entre exclusividad, crecimiento y valorización futura.',
                },
              ].map((item) => (
                <div key={item.title} className="border-b border-[#f0e3d1] pb-6 last:border-b-0 last:pb-0">
                  <h3 className="font-playfair text-2xl text-[#1f3d2b]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#53725f]">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-[#1f3d2b]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-[#c8a96a]">Avance del proyecto</p>
              <h2 className="mt-4 font-playfair text-4xl text-[#f5e9da] sm:text-5xl">
                Bases concretas para una visión ambiciosa.
              </h2>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {progressItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.65, delay: index * 0.1 }}
                  className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8a96a]/15 text-[#c8a96a]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-playfair text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#f5e9da]/80">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[#8d7448]">Por qué este proyecto</p>
            <h2 className="mt-4 font-playfair text-4xl text-[#1f3d2b] sm:text-5xl">
              Una oportunidad alineada con las nuevas preferencias del mercado.
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                className="group rounded-[30px] border border-[#eadbc8] bg-white p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f3d2b] text-[#c8a96a]">
                  <reason.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-playfair text-2xl text-[#1f3d2b]">{reason.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#53725f]">{reason.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-[#efe3d4]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            >
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.35em] text-[#8d7448]">Galería</p>
                <h2 className="mt-4 font-playfair text-4xl text-[#1f3d2b] sm:text-5xl">
                  Una imagen de lo que este destino puede inspirar.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#53725f]">
                La identidad visual del proyecto transmite calma, exclusividad y una fuerte
                conexión con el paisaje.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="group relative overflow-hidden rounded-[34px]"
              >
                <img
                  src={projectImage}
                  alt={galleryItems[0]}
                  className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102117]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="font-playfair text-3xl text-white">{galleryItems[0]}</p>
                </div>
              </motion.div>

              <div className="grid gap-6">
                {galleryItems.slice(1).map((item, index) => (
                  <motion.div
                    key={item}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-[30px]"
                  >
                    <img
                      src={projectImage}
                      alt={item}
                      className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                        index === 0 ? 'h-[247px] object-center' : 'h-[247px] object-bottom'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102117]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="font-playfair text-2xl text-white">{item}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="rounded-[36px] bg-[#1f3d2b] px-6 py-12 text-center shadow-soft sm:px-10 lg:px-16 lg:py-16"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[#c8a96a]">Invitación</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-playfair text-4xl text-white sm:text-5xl">
              Sé parte de un proyecto con visión.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#f5e9da]/85">
              Invertí en un desarrollo con futuro, identidad y potencial para convertirse en un
              nuevo referente de bienestar y turismo premium.
            </p>
            <a href="#contacto" className="mt-8 inline-flex">
              <Button className="rounded-full border border-[#c8a96a] bg-[#c8a96a] px-8 py-4 text-sm uppercase tracking-[0.22em] text-[#1f3d2b] hover:bg-[#d5b57a]">
                Quiero recibir información
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </section>

        <section id="contacto" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm uppercase tracking-[0.35em] text-[#8d7448]">Contacto</p>
              <h2 className="mt-4 font-playfair text-4xl text-[#1f3d2b] sm:text-5xl">
                Conversemos sobre esta oportunidad.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#53725f]">
                Dejános tus datos para recibir información sobre el proyecto, su visión y las
                posibilidades de participacion.
              </p>
              <div className="mt-8 space-y-4 text-sm text-[#53725f]">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#c8a96a]" />
                  <span>Contacto directo para inversores interesados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#c8a96a]" />
                  <span>Respuesta personalizada y cercana</span>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="rounded-[34px] border border-[#eadbc8] bg-[#f8f3ec] p-8 shadow-soft sm:p-10"
            >
              <div className="grid gap-6">
                <label className="block">
                  <span className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#4b6855]">
                    <UserRound className="h-4 w-4 text-[#c8a96a]" />
                    Nombre
                  </span>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full rounded-2xl border border-[#d9c5a2] bg-white px-5 py-4 text-[#1f3d2b] outline-none transition focus:border-[#c8a96a] focus:ring-2 focus:ring-[#c8a96a]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#4b6855]">
                    <Mail className="h-4 w-4 text-[#c8a96a]" />
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full rounded-2xl border border-[#d9c5a2] bg-white px-5 py-4 text-[#1f3d2b] outline-none transition focus:border-[#c8a96a] focus:ring-2 focus:ring-[#c8a96a]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#4b6855]">
                    <Phone className="h-4 w-4 text-[#c8a96a]" />
                    Teléfono
                  </span>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+54 9 ..."
                    className="w-full rounded-2xl border border-[#d9c5a2] bg-white px-5 py-4 text-[#1f3d2b] outline-none transition focus:border-[#c8a96a] focus:ring-2 focus:ring-[#c8a96a]/20"
                  />
                </label>

                <Button
                  type="submit"
                  className="mt-2 rounded-full border border-[#c8a96a] bg-[#c8a96a] px-8 py-4 text-sm uppercase tracking-[0.22em] text-[#1f3d2b] hover:bg-[#d5b57a]"
                >
                  Quiero ser parte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e8dccb] bg-[#f8f3ec]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#53725f] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-playfair text-xl text-[#1f3d2b]">Termas del Cerro</p>
          <p>Proyecto de inversión con visión, naturaleza y proyección de largo plazo.</p>
        </div>
      </footer>
    </div>
  );
}
