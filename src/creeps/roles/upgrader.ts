import {gotoSources} from "../../utils/sourceFinder";
import {Role} from "../Role";

function roleUpgrader(creep: Creep) {
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.upgrading = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
    creep.memory.upgrading = true;
    creep.say("⚡ upgrade");
  }

  if (creep.memory.upgrading) {
    if (creep.room.controller) {
      if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        const path = creep.pos.findPathTo(creep.room.controller, {range: 3});
        creep.moveByPath(path);
      }
    }
  } else {
    gotoSources(creep);
  }
}

export const upgrader = new Role('upgrader', roleUpgrader, [WORK, CARRY, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
  () => {
    return 4;
  }
);
