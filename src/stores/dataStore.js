/**
 * 📦 數據存儲模組 (Data Store Module)
 *
 * 管理城市圖層數據和地圖導航功能
 * 使用 Pinia 狀態管理系統和 Vue 3 Composition API
 */

// 核心依賴
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * 🏪 數據存儲商店定義 (Data Store Definition)
 *
 * 使用 Pinia 的 defineStore 創建一個名為 'data' 的狀態管理商店。
 * 採用 Composition API 語法，提供更好的 TypeScript 支援和代碼組織。
 *
 * @returns {Object} 包含所有狀態和方法的商店對象
 */
export const useDataStore = defineStore(
  'data', // 商店唯一標識符
  () => {
    /**
     * 🗺️ 投影類型配置數據 (Projection Type Configuration Data)
     *
     * 定義所有可用的地圖投影類型，採用分組結構組織，每個投影包含完整的配置信息。
     * 使用 ref 創建響應式數據，當投影類型改變時會自動更新相關 UI 組件。
     *
     * 📋 投影結構說明：
     * - groupName: 投影組名稱，用於 UI 分組顯示
     * - groupLayers: 該組下的所有投影列表
     *   - layerId: 投影唯一標識符
     *   - layerName: 投影顯示名稱
     *   - type: D3.js 投影類型名稱
     *   - scale: 投影縮放比例
     */
    const layers = ref([
      {
        // 🌍 地圖投影類型集合
        groupName: '地圖投影',
        groupLayers: [
          {
            layerId: 'AzimuthalEqualArea',
            layerName: 'Azimuthal Equal Area',
            type: 'AzimuthalEqualArea',
            scale: 100,
          },
          {
            layerId: 'AzimuthalEquidistant',
            layerName: 'Azimuthal Equidistant',
            type: 'AzimuthalEquidistant',
            scale: 80,
          },
          {
            layerId: 'Gnomonic',
            layerName: 'Gnomonic',
            type: 'Gnomonic',
            scale: 100,
          },
          {
            layerId: 'Orthographic',
            layerName: 'Orthographic',
            type: 'Orthographic',
            scale: 160,
          },
          {
            layerId: 'Stereographic',
            layerName: 'Stereographic',
            type: 'Stereographic',
            scale: 80,
          },
          {
            layerId: 'Albers',
            layerName: 'Albers',
            type: 'Albers',
            scale: 120,
          },
          {
            layerId: 'ConicConformal',
            layerName: 'Conic Conformal',
            type: 'ConicConformal',
            scale: 100,
          },
          {
            layerId: 'ConicEqualArea',
            layerName: 'Conic Equal Area',
            type: 'ConicEqualArea',
            scale: 100,
          },
          {
            layerId: 'ConicEquidistant',
            layerName: 'Conic Equidistant',
            type: 'ConicEquidistant',
            scale: 100,
          },
          {
            layerId: 'Equirectangular',
            layerName: 'Equirectangular',
            type: 'Equirectangular',
            scale: 80,
          },
          {
            layerId: 'Mercator',
            layerName: 'Mercator',
            type: 'Mercator',
            scale: 70,
          },
          {
            layerId: 'TransverseMercator',
            layerName: 'Transverse Mercator',
            type: 'TransverseMercator',
            scale: 70,
          },
        ],
      },
    ]);

    /**
     * 🏠 台灣 (Taiwan)
     *
     * 台灣在地圖上會以紅色標示
     */
    const homeCountry = ref('Taiwan');

    /**
     * 🔍 檢查國家是否為台灣 (Check if Country is Taiwan)
     *
     * @param {string} countryName - 國家名稱（來自 GeoJSON 的 properties.name 或其他屬性）
     * @returns {boolean} 是否為台灣
     */
    const isHomeCountry = (countryName) => {
      if (!countryName) return false;
      return countryName.trim() === homeCountry.value;
    };

    /**
     * 🔍 根據圖層 ID 查找圖層對象 (Find Layer by ID)
     *
     * 在分組結構的圖層配置中搜索指定 ID 的圖層，返回完整的圖層配置對象。
     * 使用嵌套循環遍歷所有圖層組和圖層，確保能夠找到正確的圖層。
     *
     * @param {string} layerId - 要查找的圖層唯一標識符
     * @returns {Object|null} 找到的圖層對象，如果未找到則返回 null
     *
     * @example
     * const layer = findLayerById('安養機構');
     * if (layer) {
     *   console.log('找到圖層:', layer.layerName);
     * }
     */
    const findLayerById = (layerId) => {
      // 遍歷所有圖層組
      for (const group of layers.value) {
        // 遍歷當前組的所有圖層
        for (const layer of group.groupLayers) {
          // 檢查圖層 ID 是否匹配
          if (layer.layerId === layerId) {
            return layer; // 返回找到的圖層對象
          }
        }
      }
      return null; // 未找到指定 ID 的圖層
    };

    /**
     * 📋 獲取所有圖層的扁平陣列 (Get All Layers as Flat Array)
     *
     * 將分組結構的圖層配置轉換為扁平的一維陣列，便於進行批量操作和遍歷。
     * 使用展開運算符將每個圖層組的所有圖層合併到一個陣列中。
     *
     * @returns {Array} 包含所有圖層的扁平陣列
     *
     * @example
     * const allLayers = getAllLayers();
     * console.log('總共有', allLayers.length, '個圖層');
     */
    const getAllLayers = () => {
      const allLayers = []; // 初始化結果陣列
      // 遍歷所有圖層組
      for (const group of layers.value) {
        // 使用展開運算符將當前組的所有圖層添加到結果陣列
        allLayers.push(...group.groupLayers);
      }
      return allLayers; // 返回扁平化的圖層陣列
    };

    /**
     * 🔄 切換圖層可見性狀態 (Toggle Layer Visibility)
     *
     * 控制指定圖層的顯示/隱藏狀態，並在圖層首次顯示時自動載入相關數據。
     * 這是圖層管理的核心方法，負責處理圖層狀態變更和數據載入邏輯。
     *
     * @param {string} layerId - 要切換狀態的圖層唯一標識符
     * @returns {Promise<void>} 異步操作，無返回值
     *
     * @example
     * // 切換安養機構圖層的顯示狀態
     * await toggleLayerVisibility('安養機構');
     */
    // 移除圖層可見性切換（城市圖層永久可見，且無需勾選切換）

    // 移除 GeoJSON 載入功能，現在直接使用座標點

    // ------------------------------------------------------------
    // 選中的地圖物件（用於清除選取狀態）
    const selectedFeature = ref(null);

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    // ------------------------------------------------------------
    // 地圖導航功能
    const mapInstance = ref(null);

    const setMapInstance = (map) => {
      mapInstance.value = map;
    };

    /**
     * 🌍 切換投影類型
     *
     * 將地圖切換到指定的投影類型
     *
     * @param {string} projectionId - 投影類型的唯一標識符
     * @returns {void}
     */
    const changeProjection = (projectionId) => {
      // 查找投影圖層
      const projectionLayer = findLayerById(projectionId);
      if (!projectionLayer) {
        // eslint-disable-next-line no-console
        console.error('❌ 找不到投影類型:', projectionId);
        return;
      }

      // 檢查地圖實例是否準備就緒
      if (!mapInstance.value) {
        // eslint-disable-next-line no-console
        console.error('❌ 地圖實例未準備就緒，等待地圖初始化...');
        // 延遲重試機制
        setTimeout(() => {
          if (mapInstance.value) {
            // eslint-disable-next-line no-console
            console.log('🌍 地圖已準備就緒，重新嘗試切換投影');
            changeProjection(projectionId);
          } else {
            // eslint-disable-next-line no-console
            console.error('❌ 地圖實例仍未準備就緒');
          }
        }, 1000);
        return;
      }

      // 執行投影切換
      try {
        // D3.js 地圖使用 changeProjection 方法
        if (mapInstance.value.changeProjection) {
          mapInstance.value.changeProjection(projectionLayer.type, projectionLayer.scale);
          // eslint-disable-next-line no-console
          console.log(`🌍 成功切換到投影類型: ${projectionLayer.layerName}`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ 投影切換失敗:', error);
      }
    };

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      selectedFeature, // 選中的地圖要素
      setSelectedFeature, // 設定選中的地圖要素
      mapInstance, // 地圖實例
      setMapInstance, // 設定地圖實例
      changeProjection, // 切換投影類型
      homeCountry, // 台灣（紅色標示）
      isHomeCountry, // 檢查國家是否為台灣
      // 所有圖層都是可見的，所以直接返回所有圖層
      visibleLayers: computed(() => getAllLayers()),
    };
  },
  {
    persist: true,
  }
);
