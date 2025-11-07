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
            shape: '●',
          },
          {
            layerId: 'AzimuthalEquidistant',
            layerName: 'Azimuthal Equidistant',
            type: 'AzimuthalEquidistant',
            scale: 80,
            shape: '●',
          },
          {
            layerId: 'Gnomonic',
            layerName: 'Gnomonic',
            type: 'Gnomonic',
            scale: 100,
            shape: '●',
          },
          {
            layerId: 'Orthographic',
            layerName: 'Orthographic',
            type: 'Orthographic',
            scale: 160,
            shape: '●',
          },
          {
            layerId: 'Stereographic',
            layerName: 'Stereographic',
            type: 'Stereographic',
            scale: 80,
            shape: '●',
          },
          {
            layerId: 'Albers',
            layerName: 'Albers',
            type: 'Albers',
            scale: 120,
            shape: '◐',
          },
          {
            layerId: 'ConicConformal',
            layerName: 'Conic Conformal',
            type: 'ConicConformal',
            scale: 100,
            shape: '◐',
          },
          {
            layerId: 'ConicEqualArea',
            layerName: 'Conic Equal Area',
            type: 'ConicEqualArea',
            scale: 100,
            shape: '◐',
          },
          {
            layerId: 'ConicEquidistant',
            layerName: 'Conic Equidistant',
            type: 'ConicEquidistant',
            scale: 100,
            shape: '◐',
          },
          {
            layerId: 'Equirectangular',
            layerName: 'Equirectangular',
            type: 'Equirectangular',
            scale: 80,
            shape: '▭',
          },
          {
            layerId: 'Mercator',
            layerName: 'Mercator',
            type: 'Mercator',
            scale: 70,
            shape: '▭',
          },
          {
            layerId: 'TransverseMercator',
            layerName: 'Transverse Mercator',
            type: 'TransverseMercator',
            scale: 70,
            shape: '▭',
          },
          {
            layerId: 'NaturalEarth',
            layerName: 'Natural Earth',
            type: 'NaturalEarth',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Airy',
            layerName: 'Airy',
            type: 'Airy',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Aitoff',
            layerName: 'Aitoff',
            type: 'Aitoff',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Armadillo',
            layerName: 'Armadillo',
            type: 'Armadillo',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'August',
            layerName: 'August',
            type: 'August',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Baker',
            layerName: 'Baker',
            type: 'Baker',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Berghaus',
            layerName: 'Berghaus',
            type: 'Berghaus',
            scale: 100,
            shape: '●',
          },
          {
            layerId: 'Bertin1953',
            layerName: 'Bertin 1953',
            type: 'Bertin1953',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Boggs',
            layerName: 'Boggs',
            type: 'Boggs',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Bonne',
            layerName: 'Bonne',
            type: 'Bonne',
            scale: 100,
            shape: '❤',
          },
          {
            layerId: 'Bottomley',
            layerName: 'Bottomley',
            type: 'Bottomley',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Bromley',
            layerName: 'Bromley',
            type: 'Bromley',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Chamberlin',
            layerName: 'Chamberlin',
            type: 'Chamberlin',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'ChamberlinAfrica',
            layerName: 'Chamberlin Africa',
            type: 'ChamberlinAfrica',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Collignon',
            layerName: 'Collignon',
            type: 'Collignon',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Craig',
            layerName: 'Craig',
            type: 'Craig',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Craster',
            layerName: 'Craster Parabolic',
            type: 'Craster',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'CylindricalEqualArea',
            layerName: 'Cylindrical Equal Area',
            type: 'CylindricalEqualArea',
            scale: 100,
            shape: '▭',
          },
          {
            layerId: 'CylindricalStereographic',
            layerName: 'Cylindrical Stereographic',
            type: 'CylindricalStereographic',
            scale: 100,
            shape: '▭',
          },
          {
            layerId: 'Eckert1',
            layerName: 'Eckert I',
            type: 'Eckert1',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eckert2',
            layerName: 'Eckert II',
            type: 'Eckert2',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eckert3',
            layerName: 'Eckert III',
            type: 'Eckert3',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eckert4',
            layerName: 'Eckert IV',
            type: 'Eckert4',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eckert5',
            layerName: 'Eckert V',
            type: 'Eckert5',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eckert6',
            layerName: 'Eckert VI',
            type: 'Eckert6',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Eisenlohr',
            layerName: 'Eisenlohr',
            type: 'Eisenlohr',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Fahey',
            layerName: 'Fahey',
            type: 'Fahey',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Foucaut',
            layerName: 'Foucaut',
            type: 'Foucaut',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'FoucautSinusoidal',
            layerName: 'Foucaut Sinusoidal',
            type: 'FoucautSinusoidal',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Gilbert',
            layerName: 'Gilbert',
            type: 'Gilbert',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Gingery',
            layerName: 'Gingery',
            type: 'Gingery',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Ginzburg4',
            layerName: 'Ginzburg IV',
            type: 'Ginzburg4',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Ginzburg5',
            layerName: 'Ginzburg V',
            type: 'Ginzburg5',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Ginzburg6',
            layerName: 'Ginzburg VI',
            type: 'Ginzburg6',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Ginzburg8',
            layerName: 'Ginzburg VIII',
            type: 'Ginzburg8',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Ginzburg9',
            layerName: 'Ginzburg IX',
            type: 'Ginzburg9',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Gringorten',
            layerName: 'Gringorten',
            type: 'Gringorten',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'GringortenQuincuncial',
            layerName: 'Gringorten Quincuncial',
            type: 'GringortenQuincuncial',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Guyou',
            layerName: 'Guyou',
            type: 'Guyou',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Hammer',
            layerName: 'Hammer',
            type: 'Hammer',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'HammerRetroazimuthal',
            layerName: 'Hammer Retroazimuthal',
            type: 'HammerRetroazimuthal',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Healpix',
            layerName: 'HEALPix',
            type: 'Healpix',
            scale: 100,
            shape: '⬡',
          },
          {
            layerId: 'Hill',
            layerName: 'Hill',
            type: 'Hill',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Homolosine',
            layerName: 'Homolosine',
            type: 'Homolosine',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Hufnagel',
            layerName: 'Hufnagel',
            type: 'Hufnagel',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Hyperelliptical',
            layerName: 'Hyperelliptical',
            type: 'Hyperelliptical',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'InterruptedBoggs',
            layerName: 'Interrupted Boggs',
            type: 'InterruptedBoggs',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedHomolosine',
            layerName: 'Interrupted Homolosine',
            type: 'InterruptedHomolosine',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedMollweide',
            layerName: 'Interrupted Mollweide',
            type: 'InterruptedMollweide',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedMollweideHemispheres',
            layerName: 'Interrupted Mollweide Hemispheres',
            type: 'InterruptedMollweideHemispheres',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedQuarticAuthalic',
            layerName: 'Interrupted Quartic Authalic',
            type: 'InterruptedQuarticAuthalic',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedSinuMollweide',
            layerName: 'Interrupted Sinu-Mollweide',
            type: 'InterruptedSinuMollweide',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'InterruptedSinusoidal',
            layerName: 'Interrupted Sinusoidal',
            type: 'InterruptedSinusoidal',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Kavrayskiy7',
            layerName: 'Kavrayskiy VII',
            type: 'Kavrayskiy7',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Lagrange',
            layerName: 'Lagrange',
            type: 'Lagrange',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Larrivee',
            layerName: 'Larrivee',
            type: 'Larrivee',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Laskowski',
            layerName: 'Laskowski',
            type: 'Laskowski',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Littrow',
            layerName: 'Littrow',
            type: 'Littrow',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Loximuthal',
            layerName: 'Loximuthal',
            type: 'Loximuthal',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Miller',
            layerName: 'Miller',
            type: 'Miller',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Mollweide',
            layerName: 'Mollweide',
            type: 'Mollweide',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'MtFlatPolarParabolic',
            layerName: 'McBryde-Thomas Flat-Polar Parabolic',
            type: 'MtFlatPolarParabolic',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'MtFlatPolarQuartic',
            layerName: 'McBryde-Thomas Flat-Polar Quartic',
            type: 'MtFlatPolarQuartic',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'MtFlatPolarSinusoidal',
            layerName: 'McBryde-Thomas Flat-Polar Sinusoidal',
            type: 'MtFlatPolarSinusoidal',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'NaturalEarth2',
            layerName: 'Natural Earth II',
            type: 'NaturalEarth2',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'NellHammer',
            layerName: 'Nell-Hammer',
            type: 'NellHammer',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Nicolosi',
            layerName: 'Nicolosi',
            type: 'Nicolosi',
            scale: 100,
            shape: '●',
          },
          {
            layerId: 'Patterson',
            layerName: 'Patterson',
            type: 'Patterson',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'PeirceQuincuncial',
            layerName: 'Peirce Quincuncial',
            type: 'PeirceQuincuncial',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Polyconic',
            layerName: 'Polyconic',
            type: 'Polyconic',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'PolyhedralButterfly',
            layerName: 'Polyhedral Butterfly',
            type: 'PolyhedralButterfly',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'PolyhedralCollignon',
            layerName: 'Polyhedral Collignon',
            type: 'PolyhedralCollignon',
            scale: 100,
            shape: '⬡',
          },
          {
            layerId: 'PolyhedralWaterman',
            layerName: 'Polyhedral Waterman',
            type: 'PolyhedralWaterman',
            scale: 100,
            shape: '⬡',
          },
          {
            layerId: 'RectangularPolyconic',
            layerName: 'Rectangular Polyconic',
            type: 'RectangularPolyconic',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Robinson',
            layerName: 'Robinson',
            type: 'Robinson',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Satellite',
            layerName: 'Satellite',
            type: 'Satellite',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'SinuMollweide',
            layerName: 'Sinu-Mollweide',
            type: 'SinuMollweide',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Sinusoidal',
            layerName: 'Sinusoidal',
            type: 'Sinusoidal',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Times',
            layerName: 'Times',
            type: 'Times',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'TwoPointAzimuthal',
            layerName: 'Two-Point Azimuthal',
            type: 'TwoPointAzimuthal',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'TwoPointEquidistant',
            layerName: 'Two-Point Equidistant',
            type: 'TwoPointEquidistant',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'VanDerGrinten',
            layerName: 'Van der Grinten',
            type: 'VanDerGrinten',
            scale: 100,
            shape: '●',
          },
          {
            layerId: 'VanDerGrinten2',
            layerName: 'Van der Grinten II',
            type: 'VanDerGrinten2',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'VanDerGrinten3',
            layerName: 'Van der Grinten III',
            type: 'VanDerGrinten3',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'VanDerGrinten4',
            layerName: 'Van der Grinten IV',
            type: 'VanDerGrinten4',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Wagner4',
            layerName: 'Wagner IV',
            type: 'Wagner4',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Wagner6',
            layerName: 'Wagner VI',
            type: 'Wagner6',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Wagner7',
            layerName: 'Wagner VII',
            type: 'Wagner7',
            scale: 100,
            shape: '⬭',
          },
          {
            layerId: 'Wiechel',
            layerName: 'Wiechel',
            type: 'Wiechel',
            scale: 100,
            shape: '⬬',
          },
          {
            layerId: 'Winkel3',
            layerName: 'Winkel Tripel',
            type: 'Winkel3',
            scale: 100,
            shape: '⬭',
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
