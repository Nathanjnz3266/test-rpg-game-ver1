import { QUESTS_DATABASE } from '../data/quests.js';
import { ITEMS_DATABASE } from '../data/items.js';
import { eventBus } from '../core/EventBus.js';

export class QuestSystem {
  constructor() {
    this.activeQuests = [];
    this.completedQuestIds = [];

    // Load initial Main Quest
    this.startQuest('MAIN_01');
  }

  startQuest(questId) {
    const qData = QUESTS_DATABASE.find(q => q.id === questId);
    if (!qData || this.activeQuests.some(q => q.id === questId)) return false;

    const questInstance = {
      ...qData,
      status: 'Active',
      objectives: qData.objectives.map(o => ({ ...o }))
    };

    this.activeQuests.push(questInstance);
    eventBus.emit('QUEST_UPDATED', this);
    eventBus.emit('SHOW_NOTIFICATION', { text: `New Quest: ${qData.name}`, type: 'info' });
    return true;
  }

  onEnemyKilled(enemyId, player, inventory) {
    this.activeQuests.forEach(q => {
      q.objectives.forEach(obj => {
        if ((obj.type === 'KILL_ENEMY' || obj.type === 'KILL_BOSS') && obj.targetId === enemyId) {
          if (obj.current < obj.count) {
            obj.current++;
            eventBus.emit('SHOW_NOTIFICATION', { text: `Quest Progress: ${q.name} (${obj.current}/${obj.count})`, type: 'info' });
            this.checkQuestCompletion(q, player, inventory);
          }
        }
      });
    });
    eventBus.emit('QUEST_UPDATED', this);
  }

  onTalkToNpc(npcId, player, inventory) {
    this.activeQuests.forEach(q => {
      q.objectives.forEach(obj => {
        if (obj.type === 'TALK_NPC' && obj.npcId === npcId) {
          obj.current = obj.count;
          this.checkQuestCompletion(q, player, inventory);
        }
      });
    });
    eventBus.emit('QUEST_UPDATED', this);
  }

  checkQuestCompletion(quest, player, inventory) {
    const isFinished = quest.objectives.every(o => o.current >= o.count);
    if (isFinished && quest.status === 'Active') {
      quest.status = 'Completed';
      this.completedQuestIds.push(quest.id);

      // Reward player
      if (quest.rewards.exp) player.addExp(quest.rewards.exp);
      if (quest.rewards.gold) player.addGold(quest.rewards.gold);
      if (quest.rewards.item) inventory.addItem(quest.rewards.item, 1);

      eventBus.emit('SHOW_NOTIFICATION', {
        text: `Quest Complete: ${quest.name}! (+${quest.rewards.exp} EXP, +${quest.rewards.gold} Gold)`,
        type: 'success'
      });

      // Auto trigger next main quest if available
      if (quest.nextQuestId) {
        this.startQuest(quest.nextQuestId);
      }
    }
  }

  serialize() {
    return {
      activeQuests: this.activeQuests,
      completedQuestIds: this.completedQuestIds
    };
  }
}
