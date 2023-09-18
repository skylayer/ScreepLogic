import {add} from "lodash";
import {Role} from "./Role";
import {builder} from "./roles/builder";
import {harvester} from "./roles/harvester";
import {upgrader} from "./roles/upgrader";

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

function addRole(roles: Role[]) {
  // Add the new instance to the roleList
  for (const id in roles) {
    const role = roles[id]
    // Add the new instance to the roleList
    RoleList[role.name] = role
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

// Initialize the RoleList
addRole([harvester, upgrader, builder])

// Calibrate the num of each role
for (const name in Game.creeps) {
  const creep = Game.creeps[name]
  console.log(`Creep name: ${creep.memory.role}`)
  RoleList[creep.memory.role].memory.entities[name] = creep
}

// Calibration result
for (const name in RoleList) {
  const role = RoleList[name]
  console.log(`[Role] ${role.name} has ${role.active} active creeps, ${role.expected} expected.`)
}
