import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // Cambia por tu clave pública

type Plan = {
  name: string;
  price: string;
  briefsIncluded: number;
  pricePerExtraBrief: string;
  description: string;
  priceId: string; // ID de Stripe para cada plan
};

const plans: Plan[] = [
  {
    name: "Básico",
    price: "$10 - $15 USD / mes",
    briefsIncluded: 3,
    pricePerExtraBrief: "$7 USD",
    description:
      "Generación de briefs en formato solicitado (PDF/Word), acceso al formulario guiado, branding básico. Ideal para freelancers principiantes.",
    priceId: "price_1BasicXXXXXXXXXX",
  },
  {
    name: "Pro",
    price: "$30 - $45 USD / mes",
    briefsIncluded: 10,
    pricePerExtraBrief: "$5 USD",
    description:
      "Más briefs, personalización avanzada (logos, colores), exportación en múltiples formatos, historial de briefs guardados. Para freelancers y consultores activos.",
    priceId: "price_1ProXXXXXXXXXXXX",
  },
  {
    name: "Equipo",
    price: "$80 - $100 USD / mes",
    briefsIncluded: 30,
    pricePerExtraBrief: "$3 USD",
    description:
      "Para microagencias o equipos pequeños, mayor volumen, prioridad en soporte, posibilidad de compartir briefs internamente.",
    priceId: "price_1EquipoXXXXXXXXX",
  },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: selectedPlan.priceId }),
      });

      const data = await res.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe no cargó correctamente");
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert("Error al crear la sesión de pago");
      }
    } catch (error: any) {
      alert("Error en el pago: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
      {/* Fondo animado */}
      <AnimatedBackground />

      {/* Encabezado */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-20 lg:px-40">
        <h1
          className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight select-none animate-fadeIn"
          style={{
            background:
              "linear-gradient(90deg, #06b6d4, #0ea5e9, #3b82f6, #06b6d4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          aria-label="BriefMind nombre con icono de cerebro"
        >
          BriefMind{" "}
          <span
            className="inline-block animate-bounce"
            style={{
              fontFamily:
                '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif',
            }}
            aria-label="emoji cerebro"
            role="img"
          >
            🧠
          </span>
        </h1>

        <p className="max-w-3xl text-lg md:text-xl text-gray-300 mb-10 leading-relaxed select-none">
          Genera briefs profesionales y detallados con inteligencia artificial. <br />
          Simplifica la comunicación con tus clientes y optimiza tu flujo de trabajo para obtener resultados claros y efectivos en segundos.
        </p>

        <a
          href="LoginRegister"
          className="inline-block bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold rounded-full px-10 py-4 shadow-lg transition-all duration-300 ease-in-out select-none animate-pulse hover:animate-none"
          aria-label="Comenzar a generar briefs"
        >
          Registrate o inicia sesión
        </a>
      </section>

      {/* Sección de planes y pagos */}
      <section
        id="planes"
        className="relative z-10 bg-[#1e2a47] py-16 px-6 md:px-20 lg:px-40 text-center rounded-t-lg shadow-lg mt-10"
      >
        <h2 className="text-3xl font-bold mb-6 select-none">Planes y Precios</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-12 leading-relaxed select-none">
          Elige el plan que mejor se adapte a tus necesidades y empieza a crear briefs profesionales hoy.
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <article
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer bg-[#0E1A38] rounded-lg p-8 shadow-md flex flex-col items-center select-none transition-shadow duration-300
              ${
                selectedPlan?.name === plan.name
                  ? "border-4 border-cyan-500 shadow-cyan-400"
                  : "hover:shadow-cyan-400"
              }`}
              aria-selected={selectedPlan?.name === plan.name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedPlan(plan);
              }}
            >
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-cyan-400 text-3xl font-bold mb-2">{plan.price}</p>
              <p className="text-gray-400 text-sm mb-4">
                {plan.briefsIncluded} briefs incluidos / mes
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Precio por brief extra: {plan.pricePerExtraBrief}
              </p>
              <p className="text-gray-300 text-sm">{plan.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Opiniones de clientes */}
        <section
          className="relative z-10 bg-[#16223B] py-20 px-6 md:px-20 lg:px-40 text-center"
          id="opiniones"
        >
          <h2 className="text-3xl font-bold mb-6 select-none text-white">
            Lo que opinan nuestros usuarios
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed select-none">
            Profesionales independientes, consultores y equipos pequeños ya están transformando su forma de trabajar con BriefMind.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {[
              {
                name: "Ana Martínez",
                role: "Brand Strategist",
                text: "BriefMind me ha ahorrado horas de trabajo cada semana. Los briefs son claros, organizados y listos para presentar al cliente. Una herramienta imprescindible.",
              },
              {
                name: "Carlos Gómez",
                role: "Consultor de Marketing",
                text: "Con el plan Pro puedo mantener todos mis briefs ordenados y bien estructurados. Mis clientes han notado la diferencia desde el primer documento.",
              },
              {
                name: "Laura Ríos",
                role: "Fundadora de Agencia Boutique",
                text: "La opción de colaborar en equipo con BriefMind ha cambiado nuestra dinámica interna. Todo el equipo puede generar y compartir briefs fácilmente.",
              },
            ].map(({ name, role, text }) => (
              <blockquote
                key={name}
                className="bg-[#0E1A38] p-6 rounded-lg shadow-md text-gray-300"
              >
                <p className="text-md italic mb-4">“{text}”</p>
                <div className="font-semibold text-white">{name}</div>
                <div className="text-sm text-gray-400">{role}</div>
              </blockquote>
            ))}
          </div>
        </section>



      {/* CTA final */}
      <section
        id="generar"
        className="relative z-10 py-20 px-6 md:px-20 lg:px-40 text-center bg-[#0F172A]"
      >
        <h2 className="text-4xl font-bold mb-6 select-none">¿Listo para optimizar tu trabajo?</h2>
        <p className="max-w-xl mx-auto text-gray-300 mb-8 leading-relaxed select-none">
          Empieza a crear briefs inteligentes y profesionales hoy mismo con BriefMind. <br />
          Sin complicaciones, sin pérdidas de tiempo.
        </p>
        <a
          href="/"
          className="inline-block bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold rounded-full px-10 py-4 shadow-lg transition-all duration-300 ease-in-out select-none animate-pulse hover:animate-none"
          aria-label="Comenzar a generar briefs"
        >
          Generar mi primer brief
        </a>
      </section>

      {/* Footer simple */}
      <footer className="relative z-10 text-center py-6 text-gray-500 text-sm select-none">
        &copy; 2025 BriefMind. Todos los derechos reservados.
      </footer>
    </main>
  );
}

function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 bg-gradient-to-tr from-cyan-900 via-blue-900 to-indigo-900 animate-gradient-x"
      style={{
        backgroundSize: "400% 400%",
      }}
    />
  );
}
