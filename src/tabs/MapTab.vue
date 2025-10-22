<script>
  /**
   * 🗺️ MapTab.vue - D3.js 世界地圖組件 (D3.js World Map Component)
   *
   * 使用 D3.js 繪製世界地圖，專為世界城市地圖展示設計。
   * 主要功能：
   * - 使用 D3.js 顯示世界地圖
   * - 提供城市導航功能
   * - 使用麥卡托投影 (Mercator Projection)
   * - 響應式設計
   *
   * 技術架構：
   * - Vue 3 Composition API
   * - D3.js 地圖繪製
   * - Pinia 狀態管理
   * - Bootstrap 5 樣式
   */

  import { ref, onMounted, onUnmounted, nextTick } from 'vue';
  import * as d3 from 'd3';

  export default {
    name: 'MapTab',
    emits: ['map-ready'],
    setup(_, { emit }) {
      // 🗺️ 地圖相關變數
      const mapContainer = ref(null);
      let svg = null;
      let projection = null;
      let path = null;
      let zoom = null;
      let g = null;
      let tooltipDiv = null;

      // 🎨 簡化的顏色配置
      const colors = {
        border: '#666666', // 邊界顏色
        background: '#ffffff', // 背景顏色
      };

      // 🎛️ 地圖控制狀態
      const isMapReady = ref(false);
      const mapContainerId = ref(`d3-map-${Math.random().toString(36).substr(2, 9)}`);

      // 世界地圖數據
      const worldData = ref(null);

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
        if (!mapContainer.value || !worldData.value) return false;

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
            .style('background', colors.background);

          // 建立滑鼠提示框 (tooltip)
          d3.select(mapContainer.value).style('position', 'relative');
          tooltipDiv = d3
            .select(mapContainer.value)
            .append('div')
            .attr('class', 'map-tooltip')
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('visibility', 'hidden')
            .style('z-index', '10');

          // 創建投影 - 使用麥卡托投影 (Mercator Projection)
          // 限制顯示範圍到北緯75度、南緯65度
          const northLatLimit = 75; // 北緯限制
          const southLatLimit = -65; // 南緯限制

          // 創建限制範圍的 GeoJSON（北緯75度、南緯65度）
          const limitedBounds = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-180, southLatLimit],
                      [180, southLatLimit],
                      [180, northLatLimit],
                      [-180, northLatLimit],
                      [-180, southLatLimit],
                    ],
                  ],
                },
              },
            ],
          };

          projection = d3
            .geoMercator()
            .center([0, 0]) // 以旋轉後的中央經線與赤道交點為中心
            .fitSize([width, height], limitedBounds); // 使用限制範圍進行縮放

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

          // 將地圖實例傳遞給父組件
          const mapInterface = {
            svg,
            projection,
            path,
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
          const countryPaths = g
            .selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#f0f0f0') // 統一的淺灰色
            .attr('stroke', colors.border)
            .attr('stroke-width', 0.5)
            .attr('class', 'country')
            .style('cursor', 'pointer');

          // 滑鼠事件：顯示國名 tooltip
          countryPaths
            .on('mouseover', (event, d) => {
              const countryName = d.properties?.NAME || d.properties?.ADMIN || d.properties?.name;
              if (tooltipDiv) {
                tooltipDiv.style('visibility', 'visible').text(countryName || 'Unknown');
              }
            })
            .on('mousemove', (event) => {
              if (tooltipDiv) {
                const [x, y] = d3.pointer(event, mapContainer.value);
                tooltipDiv.style('left', `${x + 12}px`).style('top', `${y + 12}px`);
              }
            })
            .on('mouseout', () => {
              if (tooltipDiv) {
                tooltipDiv.style('visibility', 'hidden');
              }
            });

          console.log('[MapTab] 世界地圖繪製完成，已繪製', countries.features?.length, '個國家');
        } catch (error) {
          console.error('[MapTab] 世界地圖繪製失敗:', error);
        }
      };

      /**
       * 📏 刷新地圖尺寸
       * 當容器大小改變時重新計算地圖尺寸
       */
      const invalidateSize = () => {
        if (!svg || !mapContainer.value || !worldData.value) return;

        const rect = mapContainer.value.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        svg.attr('width', width).attr('height', height);

        // 自動調整投影以適應新的容器尺寸（限制到北緯75度、南緯65度）
        const northLatLimit = 75; // 北緯限制
        const southLatLimit = -60; // 南緯限制
        const limitedBounds = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [-180, southLatLimit],
                    [180, southLatLimit],
                    [180, northLatLimit],
                    [-180, northLatLimit],
                    [-180, southLatLimit],
                  ],
                ],
              },
            },
          ],
        };
        projection.fitSize([width, height], limitedBounds);

        // 更新所有路徑
        g.selectAll('path.country').attr('d', path);

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

        if (tooltipDiv) {
          tooltipDiv.remove();
          tooltipDiv = null;
        }

        projection = null;
        path = null;
        zoom = null;
        g = null;
        isMapReady.value = false;
      });

      // 📤 返回組件公開的屬性和方法
      return {
        mapContainer,
        mapContainerId,
        invalidateSize,
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

  :deep(.country) {
    transition: filter 0.2s ease;
  }

  :deep(.country:hover) {
    filter: brightness(1.2);
  }

  :deep(.city-marker) {
    transition: r 0.2s ease;
  }

  :deep(.city-marker:hover) {
    r: 6;
  }
</style>
