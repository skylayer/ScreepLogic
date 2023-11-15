declare global {
  interface CreepMemory {
    Manager?: CreepInterface;
  }
}

enum CreepState {
  NeedRefill,
  ReadyToWork,
  Working
}

interface CreepInterface {
  state: CreepState
}

export class CreepManager {
  constructor(private creep: Creep) {
    if (!creep.memory.Manager) {
      creep.memory.Manager = {
        state: CreepState.NeedRefill
      }
    }
  }

  public manage() {
    this.creep
  }
}