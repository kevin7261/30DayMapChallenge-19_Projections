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
  import { ref, onMounted, computed, nextTick } from 'vue';

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
      const setMapInstance = (map) => {
        dataStore.setMapInstance(map);
        nextTick(() => {
          map?.setMapCenter?.(centerMode.value);
          map?.setViewMode?.(viewMode.value);
        });
      };

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
      const centerMode = ref('origin');
      const viewMode = ref('world');

      const setCenterMode = (mode) => {
        centerMode.value = mode;
        const map = dataStore.mapInstance?.value ?? dataStore.mapInstance;
        if (map?.setMapCenter) {
          nextTick(() => map.setMapCenter(mode));
        }
      };

      const setViewMode = (mode) => {
        viewMode.value = mode === 'taiwan' ? 'taiwan' : 'world';
        const map = dataStore.mapInstance?.value ?? dataStore.mapInstance;
        if (map?.setViewMode) {
          nextTick(() => map.setViewMode(viewMode.value));
        }
        if (viewMode.value === 'taiwan') {
          setCenterMode('taiwan');
        }
      };

      // 🚀 初始化應用程式
      onMounted(() => {
        // 預設使用 Azimuthal Equidistant 投影
        changeProjection('AzimuthalEquidistant');
      });

      return {
        setMapInstance,
        changeProjection,
        setCenterMode,
        setViewMode,
        projections,
        defineStore,
        currentProjection,
        centerMode,
        viewMode,
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

      <!-- 🎯 右上角中心切換按鈕 -->
      <div
        class="position-absolute top-0 end-0 p-3 d-flex flex-column align-items-end"
        style="gap: 0.5rem; z-index: 1000;"
      >
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <div class="d-flex flex-column gap-2">
            <button
              type="button"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1"
              :class="[centerMode === 'origin' ? 'active' : '']"
              @click="setCenterMode('origin')"
              title="地圖中心：經緯度原點 (0°, 0°)"
            >
              原點
            </button>
            <button
              type="button"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1"
              :class="[centerMode === 'taiwan' ? 'active' : '']"
              @click="setCenterMode('taiwan')"
              title="地圖中心：台灣地理中心 (23°58′25.9486″N, 120°58′55.2886″E)"
            >
              台灣
            </button>
            <button
              type="button"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1"
              :class="[centerMode === 'lon120' ? 'active' : '']"
              @click="setCenterMode('lon120')"
              title="地圖中心：東經120° 赤道"
            >
              經度120
            </button>
          </div>
        </div>
      </div>

      <!-- 🧭 右下角視圖切換按鈕 -->
      <div
        class="position-absolute bottom-0 end-0 p-3 d-flex flex-column align-items-end"
        style="gap: 0.5rem; z-index: 1000;"
      >
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <div class="d-flex flex-column gap-2">
            <button
              type="button"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1"
              :class="[viewMode === 'world' ? 'active' : '']"
              @click="setViewMode('world')"
              title="顯示完整世界地圖"
            >
              世界地圖
            </button>
            <button
              type="button"
              class="btn border-0 my-country-btn my-font-xs-white px-4 py-1"
              :class="[viewMode === 'taiwan' ? 'active' : '']"
              @click="setViewMode('taiwan')"
              title="僅顯示台灣"
            >
              台灣
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
