export function gotoSources(creep: Creep) {
  const resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: resource_ => {
      return resource_.resourceType === RESOURCE_ENERGY
    }
  });
  if (resource) {
    if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
      const path = creep.pos.findPathTo(resource, {
        range: 1
      });
      creep.moveByPath(path);
    }
    return
  }

  const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
    filter: tombstone_ => {
      return tombstone_.store[RESOURCE_ENERGY] > 0
    }
  })
  if (tombstone) {
    if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      const path = creep.pos.findPathTo(tombstone, {
        range: 1
      });
      creep.moveByPath(path);
    }
    return
  }

  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      const path = creep.pos.findPathTo(source, {
        range: 1
      });
      creep.moveByPath(path);
    }
    return
  }

  const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
    filter: ruin_ => {
      return ruin_.store[RESOURCE_ENERGY] > 0
    }
  })
  if (ruin) {
    if (creep.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      const path = creep.pos.findPathTo(ruin, {
        range: 1
      });
      creep.moveByPath(path);
    }
    return
  }
}
