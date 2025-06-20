'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Plan = {
  name: string;
  price: string;
  briefsIncluded: number;
  pricePerExtraBrief: string;
  description: string;
};

const plans: Plan[] = [
  {
    name: 'Básico',
    price: '$10 - $15 USD / mes',
    briefsIncluded: 3,
    pricePerExtraBrief: '$7 USD',
    description: 'Ideal para freelancers principiantes.',
  },
  {
    name: 'Pro',
    price: '$30 - $45 USD / mes',
    briefsIncluded: 10,
    pricePerExtraBrief: '$5 USD',
    description: 'Para freelancers y consultores activos.',
  },
  {
    name: 'Equipo',
    price: '$80 - $100 USD / mes',
    briefsIncluded: 30,
    pricePerExtraBrief: '$3 USD',
    description: 'Para microagencias o equipos pequeños.',
  },
];

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userBriefs, setUserBriefs] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const storedName = localStorage.getItem('user_name');

    if (storedName) {
      setUserName(storedName);
    }

    if (token && userId) {
      setIsAuthenticated(true);
      fetch(`http://localhost:5000/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          const briefsLeft = data.briefsAvailable - data.briefs_used;
          setUserBriefs(briefsLeft);

          if (briefsLeft > 0) {
            router.push('/BriefForm');
          }
        })
        .catch(() => setIsAuthenticated(false));
    }
  }, [router]);

  const handlePlanSelection = async () => {
    if (!selectedPlan) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      const res = await fetch(`http://localhost:5000/api/users/${userId}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: selectedPlan.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al actualizar plan');
      }

      alert(`Plan actualizado a ${selectedPlan.name}`);
      router.push('/BriefForm');
    } catch (error: any) {
      alert('Error al actualizar el plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyExtraBrief = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      const res = await fetch(`http://localhost:5000/api/users/${userId}/extra-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al comprar brief extra');
      }

      alert('Brief extra comprado correctamente.');
      router.push('/BriefForm');
    } catch (error: any) {
      alert('Error al comprar brief extra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (

      <main className="min-h-screen bg-[#0F172A] text-white font-sans py-16 px-6 md:px-20 lg:px-40">
       {userName && (
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          {userName ? `¡Bienvenido, ${userName}!` : "¡Hola! Comienza a crear tu brief"}
        </h1>
      )}
        <h1 className="text-4xl font-bold text-center mb-10">Elige tu plan</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer bg-[#1e2a47] p-6 rounded-lg shadow-lg border-2 ${
                selectedPlan?.name === plan.name
                  ? 'border-cyan-400'
                  : 'border-transparent hover:border-cyan-300'
              } transition`}
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="mb-1 text-cyan-300">{plan.price}</p>
              <p className="mb-2">Briefs incluidos: {plan.briefsIncluded}</p>
              <p className="mb-3 text-sm">{plan.description}</p>
              <p className="text-sm text-gray-300">Precio por briefs extra: {plan.pricePerExtraBrief}</p>
            </div>
          ))}
        </div>

        <button
          disabled={!selectedPlan || loading}
          onClick={handlePlanSelection}
          className="mt-10 block mx-auto bg-cyan-500 hover:bg-cyan-600 text-gray-900 px-12 py-4 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Actualizando...' : 'Seleccionar Plan'}
        </button>
      </main>
    );
  }
}
