import EventEmitter from 'eventemitter3';

class EntityGroup {
  constructor (tags, entities) {
    this.tags = tags || []
    this.entities = entities  || [];
  }
}


class EntityManager extends EventEmitter {

  constructor () {
    super();

    this._tags = {};

    this._entities = [];

    this._groups = {};
  }

  addEntity (entity) {
    if (this._entities.indexOf(entity) === -1) {
      this._entities.push(entity);
      this.emit(EntityManager.EntityAdded, entity);
    }
    return entity;
  }

  removeEntitiesByTag (tag) {
    var entities = this._tags[tag];

    if (!entities) return;

    for (var x = entities.length - 1; x >= 0; x--) {
      var entity = entities[x];
      this.removeEntity(entity);
    }
  }

  removeAllEntities () {
    for (var x = this._entities.length - 1; x >= 0; x--) {
      this.removeEntity(this._entities[x]);
    }
  }

  removeEntity (entity) {
    var index = this._entities.indexOf(entity);

    if (index === -1) {
      throw new Error('Tried to remove an entity that is not in the list');
    }

    this.removeAllTags(entity);

    // Remove from entity list
    this.emit(EntityManager.EntityRemoved, entity);
    this._entities.splice(index, 1);
  }

  addTags (entity, tag) {
    // Allow passing multiple tags at once.
    if (arguments.length > 2) {
      const tags = Array.from(arguments);
      for (let i = 1; i < tags.length; i++) {
        this.addTags(entity, tags[i]);
      }
    }

    let entities = this._tags[tag];

    // This is a new tag. Create a new list.
    if (!entities) {
      entities = this._tags[tag] = [];
    }

    // Don't add if already there
    if (entities.indexOf(entity) === -1) {
      // Add to our tag index AND the list on the entity
      entities.push(entity);
    }


    // Check each indexed group to see if we need to add this entity to the list
    Object.entries(this._groups).forEach(([name, group]) => {

      if (group.tags.indexOf(tag) === -1) {
        return;
      }

      if (!this.hasAllTags(entity, group.tags)) {
        return;
      }

      if (group.entities.indexOf(entity) !== -1) {
        return;
      }

      group.entities.push(entity);

    });

    this.emit(EntityManager.TagAdded, entity, tag);

  }

  hasTag (entity, tag) {
    let entities = this._tags[tag];

    if (!entities) {
      return false;
    }

    return entities.indexOf(entity) !== -1;
  }

  hasAllTags (entity, tags) {
    for (const tag of tags) {
      if (!this.hasTag(entity, tag)) {
        return false;
      }
    }
    return true;
  }

  removeTag (entity, tag) {

    this.emit(EntityManager.TagRemoved, entity, tag);

    // Check each indexed group to see if we need to remove it
    Object.entries(this._groups).forEach(([name, group]) => {

      if (group.tags.indexOf(tag) === -1) {
        return;
      }

      // TODO: Why is this needed?
      if (!this.hasAllTags(entity, group.tags)) {
        return;
      }

      const index = group.entities.indexOf(entity);
      if (index !== -1) {
        group.entities.splice(index, 1);
      }
    });

    const entities = this._tags[tag];

    if (entities) {
      const index = entities.indexOf(entity);
      // Remove entity from the tag list.
      if (index !== -1) {
        entities.splice(index, 1);
      }
    }
  }

  removeAllTags (entity) {
    Object.entries(this._tags).forEach(([tag, entities]) => {

      if (entities.indexOf(entity) !== -1) {
        this.removeTag(entity, tag);
      }

    });
  }

  count () {
    return this._entities.length;
  }

  allEntities () {
    return this._entities.slice(0);
  }

  queryTags () {
    const tags = Array.from(arguments);

    let group = this._groups[this._groupKey(tags)];

    if (!group) {
      group = this._indexGroup(tags);
    }

    return group.entities;
  }

  _indexGroup (tags) {
    const key = this._groupKey(tags);

    if (this._groups[key]) {
      return;
    }

    const group = this._groups[key] = new EntityGroup(tags);

    for (const entity of this._entities) {
      if (this.hasAllTags(entity, tags)) {
        group.entities.push(entity);
      }
    }

    return group;
  }

  _groupKey (tags) {
    return tags.sort().join('-');
  }

}

EntityManager.EntityAdded   = 'EntityAdded';
EntityManager.EntityRemoved = 'EntityRemoved';
EntityManager.TagAdded      = 'TagAdded';
EntityManager.TagRemoved    = 'TagRemoved';


export default EntityManager
