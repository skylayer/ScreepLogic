import {ErrorMapper} from "utils/ErrorMapper";
import {RoleList} from "./creeps/RoleList";

declare global {
  interface CreepMemory {
    role: string;
    upgrading: boolean;
    building: boolean;
    transferring: boolean;
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  // Automatically assign work to creeps and analysis the num of each role
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const role = creep.memory.role
    // Insert creep to roleList
    RoleList[role].memory.entities[name] = creep
    // Step the creep
    RoleList[role].step(creep)
  }

  // Trying to generate creep
  for (const name in RoleList) {
    const role = RoleList[name];
    if (role.active < role.expected) {
      const newCreepName = `${name}${Game.time}`;
      Game.spawns.Spawn1.spawnCreep(role.body, newCreepName, {
        memory: {
          role: name,
          upgrading: false,
          building: false,
          transferring: false
        }
      });
      break;
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      const role = Memory.creeps[name].role
      delete RoleList[role].memory.entities[name]
      delete Memory.creeps[name];
    }
  }

  // Automatically generate pixel
  if (Game.cpu.bucket >= 10000) {
    Game.cpu.generatePixel();
  }


});
