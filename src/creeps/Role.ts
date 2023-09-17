import {upgraderConstruct} from "./roles/upgrader";
import {requestRole} from "../main";

export const RoleList: { [name: string]: Role } = {};
type ExpectedCalculator = (room: Room) => number;

declare global {
  interface RolesMemory {
    active: number,
    entities: { [name: string]: Creep }
  }

  interface Memory {
    roles: { [name: string]: RolesMemory; }
  }
}

export class Role {
  public constructor(
    public name: string,
    public step: (creep: Creep) => void,
    public body: BodyPartConstant[],
    private expectedCalculator: ExpectedCalculator
  ) {
    // Add the new instance to the roleList
    RoleList[this.name] = this;
    console.log(`[Role] ${this.name} is created`);
  }

  public get active() {
    this.memory.active = 0
    return this.memory.active
  }

  public get memory() {
    if (!Memory.roles[this.name]) {
      console.log(`Alloc for ${this.name}`)
      Memory.roles[this.name] = {active: 0, entities: {}};
    }
    return Memory.roles[this.name];
  }

  public get expected() {
    return this.expectedCalculator(Game.spawns.Spawn1.room)
  }
}

export function RoleConstructor(roleName: string, roleFunction: (creep: Creep) => void, bodyParts: BodyPartConstant[], logicFunction: (room: Room) => number): () => Role {
  return () => {
    return new Role(roleName, roleFunction, bodyParts, logicFunction);
  };
}

// Ensure roleMemory exists in global Memory
if (!Memory.roles) {
  Memory.roles = {};
}

// Initialize the RoleList
requestRole();


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
