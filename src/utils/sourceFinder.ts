type ActionFunction<T> = (target: T) => number;

function interactWithTarget<T extends AnyCreep | Resource | Source | Tombstone | Ruin>(
    creep: Creep,
    target: T,
    action: ActionFunction<T>,
    range: number = 1
) {
  const result = action(target);
  if (result === ERR_NOT_IN_RANGE) {
    const path = creep.pos.findPathTo(target, {
      range  // keep a distance of $range from the target
    });
    if (path.length > 0) {
      creep.moveByPath(path);
    } else {
      // Handle cases where no path is found or other issues.
      console.log(`Creep ${creep.name} failed to find a path to target.`);
    }
  }
}

export function gotoSources(creep: Creep) {
  const resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: resource_ => resource_.resourceType === RESOURCE_ENERGY
  });
  if (resource) {
    interactWithTarget(creep, resource, (res) => creep.pickup(res));
    return;
  }

  const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
    filter: tombstone_ => tombstone_.store[RESOURCE_ENERGY] > 0
  });
  if (tombstone) {
    interactWithTarget(creep, tombstone, (tomb) => creep.withdraw(tomb, RESOURCE_ENERGY));
    return;
  }

  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (source) {
    interactWithTarget(creep, source, (src) => creep.harvest(src));
    return;
  }

  const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
    filter: ruin_ => ruin_.store[RESOURCE_ENERGY] > 0
  });
  if (ruin) {
    interactWithTarget(creep, ruin, (rn) => creep.withdraw(rn, RESOURCE_ENERGY));
    return;
  }
}
