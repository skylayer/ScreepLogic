import {gotoSources} from "../../utils/sourceFinder";
import {Role} from "../Role";

function roleBuilder(creep: Creep) {
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.building = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
    creep.memory.building = true;
    creep.say("🚧 build");
  }

  if (creep.memory.building) {
    // First try to build any construction sites
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
      algorithm: "dijkstra"
    });
    if (target) {
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        const pathBuilding = creep.pos.findPathTo(target, {range: 3});
        creep.moveByPath(pathBuilding);
      }
      return;  // Exit early if we found a construction site to work on
    }

    // // If no construction sites, try to repair damaged structures
    // const repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL,
    //   algorithm: "dijkstra"
    // });
    // if (repairTarget) {
    //   if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
    //     const pathRepair = creep.pos.findPathTo(repairTarget, {range: 3});
    //     creep.moveByPath(pathRepair);
    //   }
    //   return;  // Exit early if we found a damaged structure to repair
    // }

    // If nothing to build or repair, move to idle flag
    const path = creep.pos.findPathTo(Game.flags.idleCreep, {range: 3});
    creep.moveByPath(path);
  } else {
    gotoSources(creep);
  }
}

export const builder = new Role('builder', roleBuilder, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
  (room: Room) => {
    return 4;
  }
);
