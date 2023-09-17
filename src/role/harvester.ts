import { gotoSources } from "../utils/sourceFinder";

export function roleHarvester(creep: Creep) {
  if (creep.memory.transferring && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.transferring = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.transferring && creep.store.getFreeCapacity() === 0) {
    creep.memory.transferring = true;
    creep.say("⚡ transfer");
  }

  if (creep.memory.transferring) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
      algorithm: "astar",
      range: 1
    });
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        const path = creep.pos.findPathTo(target, { range: 1 });
        creep.moveByPath(path);
      }
    } else {
      const path = creep.pos.findPathTo(Game.flags.idleCreep, { range: 3 });
      creep.moveByPath(path);
    }
  } else {
    gotoSources(creep);
  }
}
