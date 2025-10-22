<script>
  /**
   * 🗺️ MapTab.vue - D3.js 世界地圖組件 (D3.js World Map Component)
   *
   * 使用 D3.js 繪製世界地圖，專為世界城市地圖展示設計。
   * 主要功能：
   * - 使用 D3.js 顯示世界地圖
   * - 提供城市導航功能
   * - 支援多種投影方式
   * - 響應式設計
   *
   * 技術架構：
   * - Vue 3 Composition API
   * - D3.js 地圖繪製
   * - Pinia 狀態管理
   * - Bootstrap 5 樣式
   */

  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
  import * as d3 from 'd3';
  import { useDataStore } from '@/stores/dataStore.js';
  import { useDefineStore } from '@/stores/defineStore.js';

  export default {
    name: 'MapTab',
    props: {
      currentProjection: { type: String, default: 'Azimuthal Equal Area' },
    },
    emits: ['map-ready'],
    setup(props, { emit }) {
      // 📦 存儲實例
      const dataStore = useDataStore();
      const defineStore = useDefineStore();

      // 🗺️ 地圖相關變數
      const mapContainer = ref(null);
      const svgElement = ref(null);
      let svg = null;
      let projection = null;
      let path = null;
      let zoom = null;
      let g = null;

      // 🎛️ 地圖控制狀態
      const isMapReady = ref(false);
      const mapContainerId = ref(`d3-map-${Math.random().toString(36).substr(2, 9)}`);

      // 世界地圖數據
      const worldData = ref(null);

      // 當前投影類型和縮放比例
      const currentProjectionType = ref('AzimuthalEquidistant');
      const currentScale = ref(80);

      // 圓圈現在使用 D3.js 繪製，不需要大小計算函數

      // 📊 計算屬性：檢查是否有任何圖層可見
      const isAnyLayerVisible = computed(() => dataStore.getAllLayers().length > 0);

      /**
       * 🗺️ 創建投影
       * 根據投影類型創建對應的 D3.js 投影，並自動適應版面大小
       */
      const createProjection = (type, width, height, baseScale) => {
        const taiwanCenter = [120.982025, 23.973875];
        let proj;

        switch (type) {
          case 'AzimuthalEqualArea':
            proj = d3.geoAzimuthalEqualArea();
            break;
          case 'AzimuthalEquidistant':
            proj = d3.geoAzimuthalEquidistant();
            break;
          case 'Gnomonic':
            proj = d3.geoGnomonic();
            break;
          case 'Orthographic':
            proj = d3.geoOrthographic();
            break;
          case 'Stereographic':
            proj = d3.geoStereographic();
            break;
          case 'Albers':
            proj = d3.geoAlbers().parallels([15, 35]);
            break;
          case 'ConicConformal':
            proj = d3.geoConicConformal().parallels([15, 35]);
            break;
          case 'ConicEqualArea':
            proj = d3.geoConicEqualArea().parallels([15, 35]);
            break;
          case 'ConicEquidistant':
            proj = d3.geoConicEquidistant().parallels([15, 35]);
            break;
          case 'Equirectangular':
            proj = d3.geoEquirectangular();
            break;
          case 'Mercator':
            proj = d3.geoMercator();
            break;
          case 'TransverseMercator':
            proj = d3.geoTransverseMercator();
            break;
          default:
            proj = d3.geoAzimuthalEquidistant();
        }

        // 計算適合的縮放比例，讓地圖適應版面
        const padding = 32;
        const availableWidth = width - padding * 2;
        const availableHeight = height - padding * 2;

        // 根據投影類型計算適合的縮放比例，讓地圖完全適應畫面
        let scale;
        if (
          type.includes('Azimuthal') ||
          type === 'Orthographic' ||
          type === 'Stereographic' ||
          type === 'Gnomonic'
        ) {
          // 方位投影：以較小邊為基準，確保圓形投影完整顯示
          scale = Math.min(availableWidth, availableHeight) / 4.5;
        } else if (type.includes('Conic')) {
          // 圓錐投影：考慮緯度範圍
          scale = Math.min(availableWidth, availableHeight) / 5.0;
        } else if (type === 'Equirectangular') {
          // 等距圓柱投影：保持長寬比
          scale = Math.min(availableWidth, availableHeight) / 5.5;
        } else if (type === 'Mercator') {
          // 墨卡托投影：考慮緯度範圍
          scale = Math.min(availableWidth, availableHeight) / 4.5;
        } else if (type === 'TransverseMercator') {
          // 橫軸墨卡托投影
          scale = Math.min(availableWidth, availableHeight) / 4.5;
        } else {
          // 預設縮放
          scale = Math.min(availableWidth, availableHeight) / 5.0;
        }

        // 應用基礎縮放比例調整
        scale = scale * (baseScale / 100);

        proj
          .scale(scale)
          .center([0, 0])
          .rotate([-taiwanCenter[0], -taiwanCenter[1], 0])
          .translate([width / 2, height / 2]);

        return proj;
      };

      /**
       * 🔄 切換投影類型
       * 動態更新地圖的投影類型
       */
      const changeProjection = (type, scale) => {
        if (!svg || !mapContainer.value) return;

        currentProjectionType.value = type;
        currentScale.value = scale;

        const rect = mapContainer.value.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        projection = createProjection(type, width, height, scale);
        path = d3.geoPath().projection(projection);

        // 更新所有路徑
        g.selectAll('path.country').attr('d', path);

        // 移除距離圓圈繪製

        // eslint-disable-next-line no-console
        console.log('[MapTab] 投影切換完成，類型:', type, '縮放:', scale);
      };

      /**
       * 📥 載入世界地圖數據
       */
      const loadWorldData = async () => {
        try {
          // 使用本地的 GeoJSON 檔案
          console.log('[MapTab] 開始載入 GeoJSON 數據...');
          const response = await fetch(
            `${process.env.BASE_URL}data/ne_110m_admin_0_countries.geojson`
          );

          if (!response.ok) {
            throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
          }

          const data = await response.json();
          worldData.value = data;
          console.log('[MapTab] 世界地圖數據載入成功，特徵數量:', data.features?.length);
          return true;
        } catch (error) {
          console.error('[MapTab] 世界地圖數據載入失敗:', error);
          return false;
        }
      };

      /**
       * 🏗️ 創建地圖實例
       * 初始化 D3 地圖並設定基本配置
       */
      const createMap = () => {
        if (!mapContainer.value) return false;

        const rect = mapContainer.value.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[MapTab] 容器尺寸為零，延遲初始化');
          return false;
        }

        try {
          const width = rect.width;
          const height = rect.height;

          // 創建 SVG 元素
          svg = d3
            .select(mapContainer.value)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#f0f0f0');

          svgElement.value = svg.node();

          // 創建投影 - 使用參數化的投影類型
          // 預設以台灣地理中心為投影中心，自動適應版面大小
          projection = createProjection(
            currentProjectionType.value,
            width,
            height,
            currentScale.value
          );

          // 創建路徑生成器
          path = d3.geoPath().projection(projection);

          // 創建容器組
          g = svg.append('g');

          // 設置縮放行為（禁用所有互動）
          zoom = d3
            .zoom()
            .scaleExtent([1, 1]) // 禁用縮放
            .on('zoom', null); // 禁用縮放事件

          svg.call(zoom).on('wheel.zoom', null).on('dblclick.zoom', null);

          isMapReady.value = true;

          // 將地圖實例和方法一起傳遞
          const mapInterface = {
            svg,
            projection,
            path,
            navigateToLocation: () => navigateToLocation(),
            changeProjection: (type, scale) => changeProjection(type, scale),
          };

          emit('map-ready', mapInterface);

          console.log('[MapTab] D3 地圖創建成功');
          return true;
        } catch (error) {
          console.error('[MapTab] D3 地圖創建失敗:', error);
          return false;
        }
      };

      /**
       * 🎨 繪製世界地圖
       */
      const drawWorldMap = async () => {
        if (!g || !worldData.value) {
          console.error('[MapTab] 無法繪製地圖: g=', !!g, 'worldData=', !!worldData.value);
          return;
        }

        try {
          // 直接使用 GeoJSON 數據（無需轉換）
          const countries = worldData.value;
          console.log('[MapTab] 開始繪製地圖，國家數量:', countries.features?.length);

          // 繪製國家邊界
          g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', (d) => {
              // 檢查國家顏色：台灣(紅色) > 已造訪(淺藍色) > 其他(淺灰色)
              const countryName = d.properties.name || d.properties.ADMIN || d.properties.NAME;
              if (dataStore.isHomeCountry(countryName)) return '#ff9999'; // 台灣：紅色
              if (dataStore.isCountryVisited(countryName)) return '#cce5ff'; // 已造訪：淺藍色
              return '#d0d0d0'; // 其他：淺灰色
            })
            .attr('stroke', '#666666')
            .attr('stroke-width', 0.5)
            .attr('class', 'country');

          // 距離圓圈功能已移除

          console.log('[MapTab] 世界地圖繪製完成，已繪製', countries.features?.length, '個國家');
        } catch (error) {
          console.error('[MapTab] 世界地圖繪製失敗:', error);
        }
      };

      // addCityMarkers 函數已移除 - 不再需要城市標記

      /**
       * 🌍 導航到指定位置
       * 保留此函數以維持兼容性，但台灣位置已固定
       */
      const navigateToLocation = () => {
        // 台灣位置已固定在投影中心，此函數不再需要執行任何操作
        console.log('[MapTab] 台灣位置已固定');
      };

      /**
       * 📏 刷新地圖尺寸
       * 當容器大小改變時重新計算地圖尺寸
       */
      const invalidateSize = () => {
        if (!svg || !mapContainer.value) return;

        const rect = mapContainer.value.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        svg.attr('width', width).attr('height', height);

        projection = createProjection(
          currentProjectionType.value,
          width,
          height,
          currentScale.value
        );
        path = d3.geoPath().projection(projection);

        // 更新所有路徑
        g.selectAll('path.country').attr('d', path);

        // 不再繪製距離圓

        // eslint-disable-next-line no-console
        console.log('[MapTab] 地圖尺寸更新完成');
      };

      /**
       * 🚀 初始化地圖
       * 創建地圖並載入初始數據
       */
      const initMap = async () => {
        let attempts = 0;
        const maxAttempts = 20;

        // 先載入世界地圖數據
        const loaded = await loadWorldData();
        if (!loaded) {
          console.error('[MapTab] 無法載入世界地圖數據');
          return;
        }

        const tryCreateMap = async () => {
          if (attempts >= maxAttempts) {
            console.error('[MapTab] 地圖初始化失敗，已達到最大嘗試次數');
            return;
          }

          attempts++;
          console.log(`[MapTab] 嘗試創建地圖 (${attempts}/${maxAttempts})`);

          if (createMap()) {
            console.log('[MapTab] 地圖創建成功，開始繪製世界地圖');
            await drawWorldMap();
          } else {
            console.log('[MapTab] 地圖創建失敗，100ms 後重試');
            setTimeout(tryCreateMap, 100);
          }
        };

        tryCreateMap();
      };

      // 📏 設置 ResizeObserver 監聽容器大小變化
      let resizeObserver = null;
      let resizeTimeout = null;

      const setupResizeObserver = () => {
        if (!mapContainer.value || !window.ResizeObserver) return;

        resizeObserver = new ResizeObserver(() => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }

          resizeTimeout = setTimeout(() => {
            console.log('🔄 容器大小變化，刷新地圖');
            invalidateSize();
          }, 200);
        });

        resizeObserver.observe(mapContainer.value);
        console.log('✅ ResizeObserver 已設置');
      };

      // 🧹 生命週期：組件掛載
      onMounted(() => {
        nextTick(() => {
          initMap();
          setupResizeObserver();
        });
      });

      // 🧹 生命週期：組件卸載
      onUnmounted(() => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        if (resizeObserver) {
          resizeObserver.disconnect();
        }

        if (svg) {
          svg.remove();
          svg = null;
        }

        projection = null;
        path = null;
        zoom = null;
        g = null;
        isMapReady.value = false;
      });

      // 👀 監聽器：監聽資料存儲中的圖層變化
      watch(
        () => dataStore.layers,
        () => {
          if (isMapReady.value) {
            // 距離圓圈功能已移除
          }
        },
        { deep: true }
      );

      // 👀 監聽器：監聽當前投影類型變化
      watch(
        () => props.currentProjection,
        (newProjection) => {
          if (isMapReady.value && newProjection) {
            // currentProjection 是 layerName，需要找到對應的投影圖層
            const allLayers = dataStore.getAllLayers();
            const layer = allLayers.find((l) => l.layerName === newProjection);
            if (layer) {
              changeProjection(layer.type, layer.scale);
            }
          }
        }
      );

      // 📤 返回組件公開的屬性和方法
      return {
        mapContainer,
        mapContainerId,
        isAnyLayerVisible,
        invalidateSize,
        defineStore,
        navigateToLocation,
        changeProjection,
      };
    },
  };
</script>

<template>
  <!-- 🗺️ 地圖主容器 -->
  <div id="map-container" class="h-100 w-100 position-relative bg-transparent z-0">
    <!-- 🗺️ D3.js 地圖容器 -->
    <div :id="mapContainerId" ref="mapContainer" class="h-100 w-100"></div>
  </div>
</template>

<style scoped>
  @import '../assets/css/common.css';

  #map-container {
    overflow: hidden;
  }

  /* 距離圓圈現在使用 D3.js 繪製，不需要 CSS 樣式 */

  :deep(.country) {
    transition: fill 0.2s ease;
  }

  :deep(.country:hover) {
    fill: #c0c0c0;
  }

  :deep(.city-marker) {
    transition: r 0.2s ease;
  }

  :deep(.city-marker:hover) {
    r: 6;
  }
</style>
