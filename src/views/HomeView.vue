<script>
  /**
   * 🏠 HomeView.vue - 主頁面組件 (Main Page Component)
   *
   * 這是應用程式的主頁面，整合了地圖顯示和控制面板。
   * 主要功能：
   * - 顯示世界城市地圖
   * - 提供城市導航按鈕
   * - 提供底圖切換功能
   * - 響應式佈局設計
   *
   * 組件結構：
   * - MapTab: 地圖顯示組件
   * - 控制面板: 城市導航和底圖選擇
   */

  import MapTab from '../tabs/MapTab.vue';
  import { useDataStore } from '@/stores/dataStore.js';
  import { useDefineStore } from '@/stores/defineStore.js';
  import { ref, onMounted, computed } from 'vue';

  export default {
    name: 'HomeView',
    components: { MapTab },
    setup() {
      // 📦 存儲實例
      const dataStore = useDataStore();
      const defineStore = useDefineStore();

      /**
       * 🗺️ 設定地圖實例
       * 將 D3.js 地圖實例傳遞給 dataStore 以便投影切換使用
       * @param {Object} map - D3.js 地圖實例（包含 svg, projection, path, changeProjection）
       */
      const setMapInstance = (map) => dataStore.setMapInstance(map);

      /**
       * 🌍 切換投影類型
       * 將地圖切換到指定的投影類型
       * @param {string} projectionId - 投影類型 ID
       */
      const changeProjection = (projectionId) => {
        // 更新當前投影類型名稱
        const projection = projections.value?.find((p) => p.layerId === projectionId);
        if (projection) {
          console.log('🌍 切換到投影類型:', projection.layerName);
          currentProjection.value = projection.layerName;
        }
        dataStore.changeProjection(projectionId);
      };

      // 📊 獲取投影類型列表
      const projections = computed(() => dataStore.layers[0].groupLayers);

      // 🌍 當前選中的投影類型（預設為 Azimuthal Equidistant）
      const currentProjection = ref('Azimuthal Equidistant');

      // 🚀 初始化應用程式
      onMounted(() => {
        // 預設使用 Azimuthal Equidistant 投影
        changeProjection('AzimuthalEquidistant');
      });

      return {
        setMapInstance,
        changeProjection,
        projections,
        defineStore,
        currentProjection,
      };
    },
  };
</script>

<template>
  <!-- 🏠 主應用程式容器 -->
  <div id="app" class="d-flex flex-column vh-100">
    <!-- 🗺️ 地圖區域容器 -->
    <div class="flex-grow-1 overflow-hidden position-relative">
      <!-- 🗺️ 地圖組件 -->
      <MapTab @map-ready="setMapInstance" :current-projection="currentProjection" />

      <!-- 🎛️ 左側控制面板（全高） -->
      <div
        class="position-absolute"
        style="
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        "
      >
        <div
          class="bg-dark bg-opacity-75 h-100 rounded-3 p-3"
          style="display: flex; flex-direction: column"
        >
          <!-- 🌍 投影類型選擇區域 -->
          <div
            class="d-flex flex-column gap-1 flex-grow-1"
            style="overflow-y: auto; overflow-x: hidden"
          >
            <button
              v-for="projection in projections"
              :key="projection.layerId"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1 d-flex align-items-center justify-content-between"
              :class="[currentProjection === projection.layerName ? 'active' : '']"
              @click="changeProjection(projection.layerId)"
            >
              <span>{{ projection.layerName }}</span>
              <small class="projection-shape ms-2">{{ projection.shape || '橢圓形' }}</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';

  /* 自定義滾動條樣式 */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
</style>
