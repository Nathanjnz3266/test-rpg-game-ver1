const SAVE_KEY = 'ETERNAL_REALM_SAVE_V1';

export class SaveSystem {
  static save(gameState) {
    try {
      const serialized = JSON.stringify({
        version: 1,
        timestamp: Date.now(),
        player: gameState.player.serialize(),
        inventory: gameState.inventory.serialize(),
        equipment: gameState.equipment.serialize(),
        quests: gameState.quests.serialize(),
        achievements: gameState.achievements.serialize(),
        unlockedShrines: gameState.unlockedShrines || ['SHRINE_GREENVALE_TOWN'],
        reputation: gameState.reputation || {
          ROYAL: 'Neutral',
          MAGE_GUILD: 'Neutral',
          HUNTER_GUILD: 'Neutral',
          MERCHANT_GUILD: 'Neutral'
        }
      });
      localStorage.setItem(SAVE_KEY, serialized);
      return true;
    } catch (err) {
      console.error('Failed to save game:', err);
      return false;
    }
  }

  static load() {
    try {
      const dataStr = localStorage.getItem(SAVE_KEY);
      if (!dataStr) return null;
      return JSON.parse(dataStr);
    } catch (err) {
      console.error('Failed to load save data:', err);
      return null;
    }
  }

  static exportSaveFile() {
    const dataStr = localStorage.getItem(SAVE_KEY);
    if (!dataStr) return;
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eternal_Realm_Save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importSaveFile(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.player && parsed.inventory) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error('Invalid save format:', e);
    }
    return false;
  }

  static clearSave() {
    localStorage.removeItem(SAVE_KEY);
  }
}
