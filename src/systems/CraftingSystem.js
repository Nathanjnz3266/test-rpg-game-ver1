import { CRAFTING_RECIPES, ITEMS_DATABASE } from '../data/items.js';
import { eventBus } from '../core/EventBus.js';

export class CraftingSystem {
  static craftRecipe(recipe, player, inventory) {
    if (player.gold < recipe.costGold) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Not enough Gold!', type: 'warning' });
      return false;
    }

    // Check ingredients
    for (let ing of recipe.ingredients) {
      const found = inventory.items.find(i => i.itemData.id === ing.id);
      if (!found || found.quantity < ing.count) {
        const itemInfo = ITEMS_DATABASE[ing.id];
        eventBus.emit('SHOW_NOTIFICATION', { text: `Missing ingredient: ${itemInfo ? itemInfo.name : ing.id}`, type: 'warning' });
        return false;
      }
    }

    // Consume Gold & Items
    player.addGold(-recipe.costGold);
    for (let ing of recipe.ingredients) {
      const found = inventory.items.find(i => i.itemData.id === ing.id);
      inventory.removeItem(found.instanceId, ing.count);
    }

    // Add crafted item
    inventory.addItem(recipe.resultId, recipe.count || 1);
    const resData = ITEMS_DATABASE[recipe.resultId];
    eventBus.emit('SHOW_NOTIFICATION', { text: `Crafted ${recipe.count}x ${resData.name}!`, type: 'success' });
    return true;
  }
}
