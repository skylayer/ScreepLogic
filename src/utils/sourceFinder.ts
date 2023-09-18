type ActionFunction<T> = (target: T) => number;

declare global {
  interface SourceFindMemory {
    targetId: Id<Resource | Source | Tombstone | Ruin>
  }
}

export function gotoSources(creep: Creep) {

  function extractEnergyFrom<T extends Resource | Source | Tombstone | Ruin>(
    target: T,
    range: number = 1
  ) {
    function getActionForTarget(): ActionFunction<any> {
      if ('store' in target) {
        return (obj: Tombstone | Ruin) => creep.withdraw(obj, RESOURCE_ENERGY);
      }
      if ('resourceType' in target) {
        return (res: Resource) => creep.pickup(res);
      }
      if ('ticksToRegeneration' in target) {
        return (src: Source) => creep.harvest(src);
      }
      throw new Error(`Unrecognized target type.`);
    }


    const action = getActionForTarget();

    if (action(target) === ERR_NOT_IN_RANGE) {
      const moveResult = creep.moveTo(target, {
        range,
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#fff',
          lineStyle: 'dashed',
          strokeWidth: .15,
          opacity: .1
        },
        reusePath: 3
      })

      if (moveResult === ERR_NO_PATH) {
        console.log(`Creep ${creep.name} failed to find a path to target.`);
        return ERR_NO_PATH
      }
    }
    return OK
  }

  function findNewTarget() {
    const goals: (Resource | Source | Tombstone | Ruin)[] = [].concat(
      // For sources
      creep.room.find(FIND_SOURCES_ACTIVE),
      // For dropped resources
      creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: res => res.resourceType === RESOURCE_ENERGY
      }),
      // For tombstones
      creep.room.find(FIND_TOMBSTONES, {
        filter: res => res.store[RESOURCE_ENERGY] > 0
      }),
      // For ruins
      creep.room.find(FIND_RUINS, {
        filter: res => res.store[RESOURCE_ENERGY] > 0
      })
    );

    const goal = creep.pos.findClosestByPath(goals, {algorithm: 'dijkstra'})

    if (goal) return goal.id;  // 返回ID，而不是对象本身
    else return goals[0].id  // 返回ID，而不是对象本身
  }

  if (!creep.memory.sourceFinder) {
    creep.memory.sourceFinder = {
      targetId: findNewTarget()
    };
  }

  const source = Game.getObjectById(creep.memory.sourceFinder.targetId);  // 通过ID来获取目标

  if (source) {
    if (extractEnergyFrom(source) === ERR_NO_PATH) {
      creep.memory.sourceFinder.targetId = findNewTarget()
    }
  }
}
