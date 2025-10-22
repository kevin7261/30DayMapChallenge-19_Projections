/**
 * 🗺️ 定義存儲模組 (Define Store Module)
 *
 * 管理應用程式的全局配置和設定。
 * 主要功能：
 * - 管理應用程式基本配置
 * - 提供全局設定管理
 *
 * 技術架構：
 * - Pinia 狀態管理
 * - 響應式狀態更新
 * - 模組化配置管理
 * - D3.js 地圖系統（無需底圖配置）
 */

import { defineStore } from 'pinia';

export const useDefineStore = defineStore('define', {
  state: () => ({
    // 🗺️ 應用程式基本配置
    appConfig: {
      name: '30DayMapChallenge-19_Projections',
      version: '1.0.0',
    },
  }),
  actions: {
    /**
     * 🗺️ 設定應用程式配置
     * @param {Object} config - 配置對象
     */
    setAppConfig(config) {
      this.appConfig = { ...this.appConfig, ...config };
    },
  },
});
