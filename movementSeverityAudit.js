export function applyMovementAndAudit({
  agent,
  matrixHealth,
  controlEvents,
  applyMovementStabilizer,
  calculateSeverity,
  changed
}) {
  const before = {
    mode: agent.mode,
    energy: agent.energy,
    K: agent.K,
    L1: agent.L1,
    L2: agent.L2,
    maxSpeed: agent.maxSpeed,
    drag: agent.drag
  };

  // apply matrix control first
  applyMovementStabilizer(agent, matrixHealth, {
    dominantFactor: "movement"
  });

  const after = {
    mode: agent.mode,
    energy: agent.energy,
    K: agent.K,
    L1: agent.L1,
    L2: agent.L2,
    maxSpeed: agent.maxSpeed,
    drag: agent.drag
  };

  // calculate severity after control effects are applied
  const severity = calculateSeverity(before, after);

  if (changed(before, after)) {
    controlEvents.push({
      agentId: agent.id,
      state: matrixHealth.state,
      severityScore: severity.score,
      dominantFactor: severity.dominantFactor,
      severityFactors: severity.factors,
      before,
      after,
      timestamp: Date.now()
    });
  }

  return { before, after, severity };
}
