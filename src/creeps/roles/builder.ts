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
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
      algorithm: "dijkstra"
    });
    if (target) {
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        const path = creep.pos.findPathTo(target, {range: 3});
        creep.moveByPath(path);
      }
    } else {
      const path = creep.pos.findPathTo(Game.flags.idleCreep, {range: 3});
      creep.moveByPath(path);
    }
  } else {
    gotoSources(creep);
  }
}

export const builder = new Role('builder', roleBuilder, [WORK, CARRY, CARRY, MOVE, MOVE],
  (room: Room) => {
    return 1 + Math.ceil(room.find(FIND_CONSTRUCTION_SITES).length);
  }
);
