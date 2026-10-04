import { eventBus } from '../core/EventBus.js';

export class BlacksmithSystem {
  static getUpgradeCost(currentEnhancement) {
    const gold = Math.floor(100 * Math.pow(1.5, currentEnhancement));
    const ores = Math.min(15, currentEnhancement + 1);
    const successRate = Math.max(15, 100 - currentEnhancement * 8); // 100%, 92%, 84%, ... down to 15%
    return { gold, ores, successRate };
  }

  static upgradeEquipment(itemInstance, player, inventory) {
    if (!itemInstance || !itemInstance.itemData.slot) return false;

    const currentLvl = itemInstance.enhancement || 0;
    if (currentLvl >= 20) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Item is already at Max +20!', type: 'warning' });
      return false;
    }

    const { gold, ores, successRate } = this.getUpgradeCost(currentLvl);

    if (player.gold < gold) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Not enough Gold!', type: 'warning' });
      return false;
    }

    const oreItem = inventory.items.find(i => i.itemData.id === 'MAT_IRON_ORE');
    if (!oreItem || oreItem.quantity < ores) {
      eventBus.emit('SHOW_NOTIFICATION', { text: `Requires ${ores} Iron Ores!`, type: 'warning' });
      return false;
    }

    // Deduct cost
    player.addGold(-gold);
    inventory.removeItem(oreItem.instanceId, ores);

    // Roll Success
    const roll = Math.random() * 100;
    if (roll <= successRate) {
      itemInstance.enhancement = currentLvl + 1;
      eventBus.emit('SHOW_NOTIFICATION', {
        text: `Upgrade SUCCESS! ${itemInstance.itemData.name} is now +${itemInstance.enhancement}!`,
        type: 'success'
      });
      player.recalculateStats(inventory.getEquippedStatsMap());
      return true;
    } else {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Upgrade FAILED!', type: 'warning' });
      return false;
    }
  }
}
