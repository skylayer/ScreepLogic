export function controlTowers(room: Room) {
  // Find all towers in the room
  const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_TOWER}
  });

  // For each tower, decide what action to take
  for (const tower of towers) {

    // 4. Attack: Find the closest enemy
    const closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestEnemy) {
      tower.attack(closestEnemy);
      continue;  // Move to next tower
    }

    // 3. Heal: Find the closest hurt creep
    const closestHurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax
    });
    if (closestHurtCreep) {
      tower.heal(closestHurtCreep);
      continue;  // Move to next tower
    }

    // 2. Repair: Find the closest damaged structure
    const damagedStructure = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });
    let lowestHit = Infinity;
    let lowestStructure: AnyStructure = damagedStructure[0];
    for (const index in damagedStructure) {
      const struct = damagedStructure[index]
      if (struct.hits < lowestHit) {
        lowestStructure = struct
        lowestHit = struct.hits
      }
    }

    console

    if (lowestStructure) {
      tower.repair(lowestStructure)
    }
  }
}
