import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "./role/builder";
import { roleHarvester } from "role/harvester";
import { roleUpgrader } from "role/upgrader";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */

  interface CreepMemory {
    role: string;
    upgrading: boolean;
    building: boolean;
    transferring: boolean;
  }

  interface RoomMemory {
    popularity: { [name: string]: number };
  }

  interface roleListTypeDef {
    [name: string]: {
      step: (creep: Creep) => void;
      active: number;
      body: BodyPartConstant[];
      expected: number;
    };
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const roleList: roleListTypeDef = {
    harvester: {
      step: roleHarvester,
      active: 0,
      body: [WORK, CARRY, MOVE, MOVE],
      expected: 10
    },
    builder: {
      step: roleBuilder,
      active: 0,
      body: [WORK, CARRY, MOVE, MOVE],
      expected: 7
    },
    upgrader: {
      step: roleUpgrader,
      active: 0,
      body: [WORK, CARRY, MOVE, MOVE],
      expected: 10
    }
  };

  // Automatically assign work to creeps and analysis the num of each role
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    for (const role in roleList) {
      if (creep.memory.role === role) {
        roleList[role].step(creep);
        roleList[role].active += 1;
        break;
      }
    }
  }

  // Trying to generate creep
  for (const name in roleList) {
    const role = roleList[name];
    // Game.spawns.Spawn1.room.memory.popularity[name] = role.active;
    if (role.active < role.expected) {
      const newCreepName = `${Game.time}${name}`;
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
      delete Memory.creeps[name];
    }
  }

  // Automatically generate pixel
  if (Game.cpu.bucket >= 10000) {
    Game.cpu.generatePixel();
  }
});
