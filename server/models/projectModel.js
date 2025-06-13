const db = require('../db');

const createProject = async (projectData) => {
  const {
    user_id, client_name, project_name, start_date, delivery_date,
    website, main_goal, secondary_goals, current_situation, challenges,
    target_audience, audience_needs, main_message, differentiation,
    tone, channels, deliverable_formats, expected_deliverables,
    limitations, competitors, reference_links, budget, resources,
    milestones, deadlines, restrictions, notes, branding_links, final_format
  } = projectData;

  const result = await db.query(
    `INSERT INTO projects (
      user_id, client_name, project_name, start_date, delivery_date,
      website, main_goal, secondary_goals, current_situation, challenges,
      target_audience, audience_needs, main_message, differentiation,
      tone, channels, deliverable_formats, expected_deliverables,
      limitations, competitors, reference_links, budget, resources,
      milestones, deadlines, restrictions, notes, branding_links, final_format
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18,
      $19, $20, $21, $22,
      $23, $24, $25, $26,
      $27, $28, $29
    ) RETURNING *`,
    [
      user_id, client_name, project_name, start_date, delivery_date,
      website, main_goal, secondary_goals, current_situation, challenges,
      target_audience, audience_needs, main_message, differentiation,
      tone, channels, deliverable_formats, expected_deliverables,
      limitations, competitors, reference_links, budget, resources,
      milestones, deadlines, restrictions, notes, branding_links, final_format
    ]
  );

  return result.rows[0];
};

module.exports = { createProject };
