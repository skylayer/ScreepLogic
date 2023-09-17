import {Role} from "./Role";
import {builderConstruct} from "./roles/builder";
import {harvesterConstruct} from "./roles/harvester";
import {upgraderConstruct} from "./roles/upgrader";

export const RoleList: { [name: string]: Role } = {};

declare global {
  interface RolesMemory {
    active: number,
    entities: { [name: string]: Creep }
  }

  interface Memory {
    roles: { [name: string]: RolesMemory; }
  }
}
// Ensure roleMemory exists in global Memory
if (!Memory.roles) {
  Memory.roles = {};
}

// Initialize the RoleList
harvesterConstruct()
builderConstruct()
upgraderConstruct()

// Calibrate the num of each role
for (const name in Game.creeps) {
  const creep = Game.creeps[name]
  RoleList[creep.memory.role].memory.entities[name] = creep
}

// Calibration result
for (const name in RoleList) {
  const role = RoleList[name]
  console.log(`[Role] ${role.name} has ${role.active} active creeps, ${role.expected} expected.`)
}
