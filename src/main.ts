import {ErrorMapper} from "utils/ErrorMapper";
import {roleBuilder} from "./role/builder";
import {roleHarvester} from "role/harvester";
import {roleUpgrader} from "role/upgrader";
import * as lodash from 'lodash';

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definition alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */

  interface RolesMemory {
    active: number;
  }

  interface Memory {
    roles: { [name: string]: RolesMemory; }
  }

  interface CreepMemory {
    role: string;
    upgrading: boolean;
    building: boolean;
    transferring: boolean;
  }

  interface SpawnMemory {
    popularity: { [name: string]: number };
  }
}

interface roleListTypeDef {
  [name: string]: Role;
}

const roleList: roleListTypeDef = {};

class Role {
  public constructor(public name: string, public step: (creep: Creep) => void, public body: BodyPartConstant[], public expected: number = 8) {
    // Add the new instance to the roleList
    roleList[this.name] = this;
    console.log(`[Role] ${this.name} is created`);
  }

  public get memory() {
    if (!Memory.roles[this.name]) {
      Memory.roles[this.name] = {active: 0};
    }
    return Memory.roles[this.name];
  }
}

// Ensure roleMemory exists in global Memory
if (!Memory.roles) {
  Memory.roles = {};
}

new Role('harvester', roleHarvester, [WORK, CARRY, MOVE, MOVE], 10);
new Role('builder', roleBuilder, [WORK, CARRY, MOVE, MOVE], 7);
new Role('upgrader', roleUpgrader, [WORK, CARRY, MOVE, MOVE], 10);

// Calibrate the num of each role
for (const roleName in roleList) {
  roleList[roleName].memory.active = lodash.filter(Game.creeps, creep => creep.memory.role === roleName).length;
}


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  // Automatically assign work to creeps and analysis the num of each role
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    for (const role in roleList) {
      if (creep.memory.role === role) {
        roleList[role].step(creep);
        break;
      }
    }
  }

  // Trying to generate creep
  for (const name in roleList) {
    const role = roleList[name];
    if (role.memory.active < role.expected) {
      console.log(`active=${role.memory.active}, expected=${role.expected}`);
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
      delete Memory.creeps[name];
    }
  }

  // Automatically generate pixel
  if (Game.cpu.bucket >= 10000) {
    Game.cpu.generatePixel();
  }
});
