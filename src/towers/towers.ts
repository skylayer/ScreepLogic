export function controlTowers(room: Room) {
  // Find all towers in the room
  const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_TOWER}
  });

  // For each tower, decide what action to take
  for (const tower of towers) {
    // 3. Heal: Find the closest hurt creep
    const closestHurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax
    });
    if (closestHurtCreep) {
      tower.heal(closestHurtCreep);
      continue;  // Move to next tower
    }

    // 4. Attack: Find the closest enemy
    const closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestEnemy) {
      tower.attack(closestEnemy);
      continue;  // Move to next tower
    }

    // 1. Prioritize repair for decaying structures that are about to break
    const criticalDecayingStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_ROAD || structure.structureType === STRUCTURE_RAMPART || structure.structureType === STRUCTURE_CONTAINER) &&
          structure.hits < structure.hitsMax &&
          structure.hits < 3000;  // or whatever threshold you deem "critical"
      }
    });
    if (criticalDecayingStructure) {
      tower.repair(criticalDecayingStructure);
      continue;  // Move to next tower
    }

    // 2. Repair: Find the closest damaged structure
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
      continue;  // Move to next tower
    }
  }
}
