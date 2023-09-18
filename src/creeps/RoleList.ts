import {Role} from "./Role";
import {builder} from "./roles/builder";
import {harvester} from "./roles/harvester";
import {upgrader} from "./roles/upgrader";

export const RoleList: { [name: string]: Role } = {};

declare global {
  interface RolesMemory {
    active: number,
    entities: { [name: string]: Id<Creep> }
  }

  interface Memory {
    roles: { [name: string]: RolesMemory; }
  }
}
// Ensure roleMemory exists in global Memory
if (!Memory.roles) {
  Memory.roles = {};
}

function addRole(roles: Role[]) {
  // Add the new instance to the roleList
  for (const id in roles) {
    const role = roles[id]
    // Add the new instance to the roleList
    RoleList[role.name] = role
  }
}

// Initialize the RoleList
addRole([harvester, upgrader, builder])

// Calibrate the num of each role
for (const name in Game.creeps) {
  const creep = Game.creeps[name]
  if (!creep.memory.role)
    creep.memory = harvester.initMemory
  RoleList[creep.memory.role].memory.entities[name] = creep.id
}

// Calibration result
for (const name in RoleList) {
  const role = RoleList[name]
  console.log(`[Role] ${role.name} has ${role.active} active creeps, ${role.expected} expected.`)
}
