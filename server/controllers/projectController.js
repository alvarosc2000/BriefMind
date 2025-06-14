const pool = require('../db');
const OpenAI = require('openai');

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Crear proyecto con generación de brief y verificación de créditos
exports.createProject = async (req, res) => {
  const data = req.body;
  const userId = data.user_id;

  try {
    // 1. Verificar si el usuario existe y tiene briefs disponibles
    const userResult = await pool.query('SELECT briefs_available FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const briefs = userResult.rows[0].briefs_available;

    if (briefs <= 0) {
      return res.status(403).json({ message: 'No tienes briefs disponibles' });
    }

    // 2. Generar el brief con OpenAI
    const prompt = `
Eres un asistente experto en marketing digital. Genera un brief profesional, claro y bien estructurado para un proyecto con esta información:

- Nombre del proyecto: ${data.project_name}
- Cliente: ${data.client_name}
- Fecha de inicio: ${data.start_date}
- Fecha de entrega: ${data.delivery_date}
- Sitio web o redes sociales: ${data.website}
- Objetivo principal: ${data.main_goal}
- Objetivos secundarios: ${data.secondary_goals}
- Situación actual: ${data.current_situation}
- Retos y desafíos: ${data.challenges}
- Público objetivo: ${data.target_audience}
- Necesidades del público: ${data.audience_needs}
- Mensaje principal a comunicar: ${data.main_message}
- Diferenciación del producto o servicio: ${data.differentiation}
- Tono de comunicación: ${data.tone}
- Canales de difusión: ${Array.isArray(data.channels) ? data.channels.join(", ") : data.channels}
- Formatos de entregables: ${Array.isArray(data.deliverable_formats) ? data.deliverable_formats.join(", ") : data.deliverable_formats}
- Entregables esperados y formato final: ${data.expected_deliverables}
- Restricciones o limitaciones: ${data.limitations}
- Competidores principales: ${data.competitors}
- Referencias: ${data.reference_links}
- Presupuesto: ${data.budget}
- Recursos disponibles: ${data.resources}
- Hitos y fechas clave: ${data.milestones}
- Plazos definitivos: ${data.deadlines}
- Restricciones adicionales: ${data.restrictions}
- Notas adicionales: ${data.notes}
- Enlaces de branding o identidad visual: ${data.branding_links}
- Formato final requerido: ${data.final_format}

El brief debe estar en español, ser claro y fácil de entender. Organiza la información en secciones con títulos claros.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedBrief = completion.choices[0].message?.content ?? '';

    // 3. Iniciar transacción
    await pool.query('BEGIN');

    // 4. Guardar el proyecto con el brief generado
    const projectResult = await pool.query(
      `INSERT INTO projects (
        user_id, client_name, project_name, start_date, delivery_date, website,
        main_goal, secondary_goals, current_situation, challenges, target_audience,
        audience_needs, main_message, differentiation, tone, channels,
        deliverable_formats, expected_deliverables, limitations, competitors, reference_links,
        budget, resources, milestones, deadlines, restrictions, notes,
        branding_links, final_format, generated_brief
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26,
        $27, $28, $29, $30
      ) RETURNING *`,
      [
        userId,
        data.client_name, data.project_name, data.start_date, data.delivery_date, data.website,
        data.main_goal, data.secondary_goals, data.current_situation, data.challenges, data.target_audience,
        data.audience_needs, data.main_message, data.differentiation, data.tone,
        Array.isArray(data.channels) ? data.channels : [data.channels],
        Array.isArray(data.deliverable_formats) ? data.deliverable_formats : [data.deliverable_formats],
        data.expected_deliverables, data.limitations, data.competitors, data.reference_links,
        data.budget, data.resources, data.milestones, data.deadlines, data.restrictions, data.notes,
        data.branding_links, data.final_format, generatedBrief,
      ]
    );

    // 5. Descontar 1 brief al usuario
    await pool.query(
      'UPDATE users SET briefs_available = briefs_available - 1 WHERE id = $1',
      [userId]
    );

    // 6. Confirmar transacción
    await pool.query('COMMIT');

    // 7. Responder con proyecto creado
    res.status(201).json(projectResult.rows[0]);

  } catch (err) {
    console.error('Error al crear proyecto:', err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Error al guardar el proyecto' });
  }
};


// Obtener todos los proyectos
exports.getAllProjects = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener todos los proyectos:', err);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// Obtener proyectos por usuario
exports.getProjectsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener proyectos del usuario:', err);
    res.status(500).json({ error: 'Error al obtener proyectos del usuario' });
  }
};
