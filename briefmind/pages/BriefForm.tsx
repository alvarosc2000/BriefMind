import React, { useState, useEffect } from "react";

interface BriefFormData {
  clientName: string;
  projectName: string;
  startDate: string;
  deliveryDate: string;
  website: string;
  mainGoal: string;
  secondaryGoals: string;
  currentSituation: string;
  challenges: string;
  targetAudience: string;
  audienceNeeds: string;
  mainMessage: string;
  differentiation: string;
  tone: string;
  channels: string[];
  deliverableFormats: string[];
  expectedDeliverables: string;
  limitations: string;
  competitors: string;
  references: string;
  budget: string;
  resources: string;
  milestones: string;
  deadlines: string;
  restrictions: string;
  notes: string;
  brandingLinks: string;
  finalFormat: string;
}

const tonesOptions = ["Formal", "Cercano", "Inspirador", "Técnico", "Divertido"];
const channelsOptions = ["Instagram", "Facebook", "Email", "Google Ads", "LinkedIn", "Web"];
const deliverablesOptions = ["Posts", "Videos", "Newsletters", "Infografías"];

const initialData: BriefFormData = {
  clientName: "",
  projectName: "",
  startDate: "",
  deliveryDate: "",
  website: "",
  mainGoal: "",
  secondaryGoals: "",
  currentSituation: "",
  challenges: "",
  targetAudience: "",
  audienceNeeds: "",
  mainMessage: "",
  differentiation: "",
  tone: "",
  channels: [],
  deliverableFormats: [],
  expectedDeliverables: "",
  limitations: "",
  competitors: "",
  references: "",
  budget: "",
  resources: "",
  milestones: "",
  deadlines: "",
  restrictions: "",
  notes: "",
  brandingLinks: "",
  finalFormat: "",
};

export default function ProjectBriefForm() {
  const [form, setForm] = useState<BriefFormData>(initialData);
  const [userName, setUserName] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("briefmind_draft");
    if (saved) setForm(JSON.parse(saved));
    const loggedUserName = localStorage.getItem("user_name");
    if (loggedUserName) setUserName(loggedUserName);
  }, []);

  useEffect(() => {
    localStorage.setItem("briefmind_draft", JSON.stringify(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    if (type === "checkbox") {
      const arr = form[name as keyof BriefFormData] as string[];
      if (checked) {
        setForm({ ...form, [name]: [...arr, value] });
      } else {
        setForm({ ...form, [name]: arr.filter((v) => v !== value) });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("briefmind_draft", JSON.stringify(form));
    alert("Borrador guardado localmente.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    alert("Brief enviado (simulación).");
    localStorage.removeItem("briefmind_draft");
  };

  const steps = [
    {
      title: "Información Básica",
      content: (
        <>
          <Input
            label="Nombre del cliente o empresa *"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            placeholder="Ej: ACME Corp"
            required
          />
          <Input
            label="Nombre del proyecto *"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="Ej: Campaña verano 2025"
            required
          />
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="date"
              label="Fecha de inicio *"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              label="Fecha de entrega prevista *"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            type="url"
            label="Sitio web o redes sociales relevantes"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://"
          />
        </>
      ),
    },
    {
      title: "Objetivos del Proyecto",
      content: (
        <>
          <Textarea
            label="Objetivo principal del proyecto *"
            name="mainGoal"
            value={form.mainGoal}
            onChange={handleChange}
            placeholder="Ej: aumentar ventas, lanzar producto, mejorar branding."
            required
          />
          <Textarea
            label="Objetivos secundarios o específicos (opcional)"
            name="secondaryGoals"
            value={form.secondaryGoals}
            onChange={handleChange}
          />
        </>
      ),
    },
    {
      title: "Situación Actual / Contexto",
      content: (
        <>
          <Textarea
            label="Describe brevemente la situación actual del negocio o proyecto *"
            name="currentSituation"
            value={form.currentSituation}
            onChange={handleChange}
            placeholder="Ej: Tenemos un ecommerce con bajo tráfico."
            required
          />
          <Textarea
            label="Problemas o retos actuales"
            name="challenges"
            value={form.challenges}
            onChange={handleChange}
          />
        </>
      ),
    },
    {
      title: "Público Objetivo",
      content: (
        <>
          <Textarea
            label="¿Quién es el público objetivo? *"
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            placeholder="Datos demográficos, intereses, hábitos, ubicación."
            required
          />
          <Textarea
            label="¿Qué necesidades o problemas tiene este público? *"
            name="audienceNeeds"
            value={form.audienceNeeds}
            onChange={handleChange}
            required
          />
        </>
      ),
    },
    {
      title: "Mensaje y Propuesta de Valor",
      content: (
        <>
          <Textarea
            label="¿Cuál es el mensaje principal que quieres comunicar? *"
            name="mainMessage"
            value={form.mainMessage}
            onChange={handleChange}
            placeholder="Ej: Innovación, calidad, precio, experiencia."
            required
          />
          <Textarea
            label="¿Cómo se diferencia tu producto o servicio? *"
            name="differentiation"
            value={form.differentiation}
            onChange={handleChange}
            required
          />
          <Select
            label="Tono de comunicación *"
            name="tone"
            value={form.tone}
            onChange={handleChange}
            options={tonesOptions}
            required
          />
        </>
      ),
    },
    {
      title: "Canales y Entregables",
      content: (
        <>
          <CheckboxGroup
            label="Canales de difusión"
            name="channels"
            options={channelsOptions}
            selected={form.channels}
            onChange={handleChange}
          />
          <CheckboxGroup
            label="Formatos de entregables"
            name="deliverableFormats"
            options={deliverablesOptions}
            selected={form.deliverableFormats}
            onChange={handleChange}
          />
          <Textarea
            label="Entregables esperados y formato final"
            name="expectedDeliverables"
            value={form.expectedDeliverables}
            onChange={handleChange}
            placeholder="Describe qué se espera recibir y en qué formato."
          />
        </>
      ),
    },
    {
      title: "Restricciones y Recursos",
      content: (
        <>
          <Textarea
            label="Restricciones o limitaciones del proyecto"
            name="limitations"
            value={form.limitations}
            onChange={handleChange}
          />
          <Textarea
            label="Competidores principales"
            name="competitors"
            value={form.competitors}
            onChange={handleChange}
          />
          <Textarea
            label="Referencias o ejemplos que te gusten"
            name="references"
            value={form.references}
            onChange={handleChange}
          />
          <Input
            label="Presupuesto aproximado"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Ej: 1000 USD"
          />
          <Textarea
            label="Recursos disponibles o equipo"
            name="resources"
            value={form.resources}
            onChange={handleChange}
          />
        </>
      ),
    },
    {
      title: "Cronograma y Notas",
      content: (
        <>
          <Textarea
            label="Hitos o fechas clave"
            name="milestones"
            value={form.milestones}
            onChange={handleChange}
          />
          <Textarea
            label="Plazos definitivos"
            name="deadlines"
            value={form.deadlines}
            onChange={handleChange}
          />
          <Textarea
            label="Restricciones adicionales"
            name="restrictions"
            value={form.restrictions}
            onChange={handleChange}
          />
          <Textarea
            label="Notas adicionales"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
          <Input
            label="Enlaces de branding o identidad visual"
            name="brandingLinks"
            value={form.brandingLinks}
            onChange={handleChange}
            placeholder="URLs, Dropbox, Google Drive, etc."
          />
          <Input
            label="Formato final requerido"
            name="finalFormat"
            value={form.finalFormat}
            onChange={handleChange}
            placeholder="Ej: PDF, PPT, Video, etc."
          />
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen #132d81">
      <header className="max-w-4xl mx-auto mt-12 mb-8 text-center text-white-900">
        <h1 className="text-4xl font-extrabold mb-2">
          {userName ? `¡Hola, ${userName}!` : "¡Hola! Crea tu brief aquí"}
        </h1>
        <p className="text-lg">
          Completa el formulario para generar un brief de proyecto claro y profesional.
        </p>
      </header>
      <main className="flex-1 max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-2xl transition-all duration-300">
        <h2 className="text-gray-800 text-2xl font-bold mb-6">
          Paso {step + 1} de {steps.length}: {steps[step].title}
        </h2>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-6 ${animating ? "opacity-50 pointer-events-none" : ""}`}
        >
          {steps[step].content}
          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
              >
                Anterior
              </button>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded transition"
              >
                Guardar borrador
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
                >
                  Enviar brief
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-blue-900 font-semibold">
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70 transition shadow-md"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-gray-900 font-semibold">
      {label}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="mt-2 w-full rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70 transition shadow-md resize-y"
      />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block text-gray-900 font-semibold">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70 transition shadow-md"
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({
  label,
  name,
  options,
  selected,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  selected: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <fieldset className="text-gray-900 font-semibold">
      <legend>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={selected.includes(opt)}
              onChange={onChange}
              className="h-5 w-5 rounded border-gray-400 text-gray-600 focus:ring-gray-400"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
