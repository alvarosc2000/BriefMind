const pool = require('../db');

// Crear proyecto
exports.createProject = async (req, res) => {
  const data = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (
        user_id, client_name, project_name, start_date, delivery_date, website,
        main_goal, secondary_goals, current_situation, challenges, target_audience,
        audience_needs, main_message, differentiation, tone, channels,
        deliverable_formats, expected_deliverables, limitations, competitors, reference_links,
        budget, resources, milestones, deadlines, restrictions, notes,
        branding_links, final_format
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26,
        $27, $28, $29
      ) RETURNING *`,
      [
        data.user_id,
        data.client_name, data.project_name, data.start_date, data.delivery_date, data.website,
        data.main_goal, data.secondary_goals, data.current_situation, data.challenges, data.target_audience,
        data.audience_needs, data.main_message, data.differentiation, data.tone, data.channels,
        data.deliverable_formats, data.expected_deliverables, data.limitations, data.competitors, data.reference_links,
        data.budget, data.resources, data.milestones, data.deadlines, data.restrictions, data.notes,
        data.branding_links, data.final_format
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el proyecto' });
  }
};

// Obtener todos los proyectos
exports.getAllProjects = async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
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
    res.status(500).json({ error: 'Error al obtener proyectos del usuario' });
  }
};
