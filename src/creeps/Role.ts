import {RoleList} from "./RoleList";

type ExpectedCalculator = (room: Room) => number;


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
    this.memory.active = Object.keys(this.memory.entities).length
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

