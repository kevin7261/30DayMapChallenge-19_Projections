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

      <!-- 🎛️ 左側中間控制面板 -->
      <div
        class="position-absolute"
        style="top: 50%; left: 0; transform: translateY(-50%); z-index: 1000; padding: 1rem"
      >
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <!-- 🌍 投影類型選擇區域 -->
          <div class="">
            <div class="d-flex flex-column gap-1">
              <button
                v-for="projection in projections"
                :key="projection.layerId"
                class="btn border-0 my-country-btn my-font-sm-white px-4 py-3"
                :class="[currentProjection === projection.layerName ? 'active' : '']"
                @click="changeProjection(projection.layerId)"
              >
                {{ projection.layerName }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';
</style>
