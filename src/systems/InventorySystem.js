import { ITEMS_DATABASE, RARITIES } from '../data/items.js';
import { eventBus } from '../core/EventBus.js';

export class InventorySystem {
  constructor(maxSlots = 30) {
    this.maxSlots = maxSlots;
    this.items = []; // array of items with { instanceId, itemData, enhancement, quantity }
    this.equipped = {
      Weapon: null,
      Helmet: null,
      Chest: null,
      Gloves: null,
      Pants: null,
      Boots: null,
      Ring1: null,
      Ring2: null,
      Amulet: null
    };

    // Starter Items
    this.addItem('WEAPON_NOVICE_SWORD', 1);
    this.addItem('POTION_HP_SMALL', 5);
    this.addItem('FOOD_GRILLED_MEAT', 2);
  }

  addItem(itemId, quantity = 1, enhancement = 0) {
    const itemData = ITEMS_DATABASE[itemId];
    if (!itemData) return false;

    // If stackable, find existing item
    if (itemData.stackable) {
      const existing = this.items.find(i => i.itemData.id === itemId);
      if (existing) {
        existing.quantity += quantity;
        eventBus.emit('INVENTORY_UPDATED', this);
        return true;
      }
    }

    if (this.items.length >= this.maxSlots) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Inventory full!', type: 'warning' });
      return false;
    }

    const instance = {
      instanceId: `ITEM_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      itemData: itemData,
      enhancement: enhancement,
      quantity: quantity
    };

    this.items.push(instance);
    eventBus.emit('INVENTORY_UPDATED', this);
    return true;
  }

  removeItem(instanceId, quantity = 1) {
    const idx = this.items.findIndex(i => i.instanceId === instanceId);
    if (idx === -1) return false;

    this.items[idx].quantity -= quantity;
    if (this.items[idx].quantity <= 0) {
      this.items.splice(idx, 1);
    }
    eventBus.emit('INVENTORY_UPDATED', this);
    return true;
  }

  equipItem(instanceId, player) {
    const itemIndex = this.items.findIndex(i => i.instanceId === instanceId);
    if (itemIndex === -1) return false;

    const itemToEquip = this.items[itemIndex];
    const slot = itemToEquip.itemData.slot;
    if (!slot) return false;

    // Check level requirement
    if (player.level < (itemToEquip.itemData.levelReq || 1)) {
      eventBus.emit('SHOW_NOTIFICATION', { text: `Requires Level ${itemToEquip.itemData.levelReq}`, type: 'warning' });
      return false;
    }

    // Unequip currently equipped item in slot if exists
    if (this.equipped[slot]) {
      this.items.push(this.equipped[slot]);
    }

    this.equipped[slot] = itemToEquip;
    this.items.splice(itemIndex, 1);

    player.recalculateStats(this.getEquippedStatsMap());
    eventBus.emit('EQUIPMENT_UPDATED', this);
    eventBus.emit('INVENTORY_UPDATED', this);
    eventBus.emit('SHOW_NOTIFICATION', { text: `Equipped ${itemToEquip.itemData.name}`, type: 'info' });
    return true;
  }

  unequipItem(slot, player) {
    if (!this.equipped[slot]) return false;
    if (this.items.length >= this.maxSlots) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Inventory full!', type: 'warning' });
      return false;
    }

    const item = this.equipped[slot];
    this.equipped[slot] = null;
    this.items.push(item);

    player.recalculateStats(this.getEquippedStatsMap());
    eventBus.emit('EQUIPMENT_UPDATED', this);
    eventBus.emit('INVENTORY_UPDATED', this);
    return true;
  }

  getEquippedStatsMap() {
    const res = {};
    Object.keys(this.equipped).forEach(slot => {
      if (this.equipped[slot]) {
        res[slot] = {
          ...this.equipped[slot].itemData,
          enhancement: this.equipped[slot].enhancement
        };
      }
    });
    return res;
  }

  serialize() {
    return {
      items: this.items,
      equipped: this.equipped
    };
  }
}
