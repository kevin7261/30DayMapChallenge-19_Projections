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
  import {
    geoAiry,
    geoAitoff,
    geoArmadillo,
    geoAugust,
    geoBaker,
    geoBerghaus,
    geoBertin1953,
    geoBoggs,
    geoBonne,
    geoBottomley,
    geoBromley,
    geoChamberlin,
    geoChamberlinAfrica,
    geoCollignon,
    geoCraig,
    geoCraster,
    geoCylindricalEqualArea,
    geoCylindricalStereographic,
    geoEckert1,
    geoEckert2,
    geoEckert3,
    geoEckert4,
    geoEckert5,
    geoEckert6,
    geoEisenlohr,
    geoFahey,
    geoFoucaut,
    geoFoucautSinusoidal,
    geoGilbert,
    geoGingery,
    geoGinzburg4,
    geoGinzburg5,
    geoGinzburg6,
    geoGinzburg8,
    geoGinzburg9,
    geoGringorten,
    geoGringortenQuincuncial,
    geoGuyou,
    geoHammer,
    geoHammerRetroazimuthal,
    geoHealpix,
    geoHill,
    geoHomolosine,
    geoHufnagel,
    geoHyperelliptical,
    geoInterruptedBoggs,
    geoInterruptedHomolosine,
    geoInterruptedMollweide,
    geoInterruptedMollweideHemispheres,
    geoInterruptedQuarticAuthalic,
    geoInterruptedSinuMollweide,
    geoInterruptedSinusoidal,
    geoKavrayskiy7,
    geoLagrange,
    geoLarrivee,
    geoLaskowski,
    geoLittrow,
    geoLoximuthal,
    geoMiller,
    geoMollweide,
    geoMtFlatPolarParabolic,
    geoMtFlatPolarQuartic,
    geoMtFlatPolarSinusoidal,
    geoNaturalEarth2,
    geoNellHammer,
    geoNicolosi,
    geoPatterson,
    geoPeirceQuincuncial,
    geoPolyconic,
    geoPolyhedralButterfly,
    geoPolyhedralCollignon,
    geoPolyhedralWaterman,
    geoRectangularPolyconic,
    geoRobinson,
    geoSatellite,
    geoSinuMollweide,
    geoSinusoidal,
    geoTimes,
    geoTwoPointAzimuthal,
    geoTwoPointEquidistant,
    geoVanDerGrinten,
    geoVanDerGrinten2,
    geoVanDerGrinten3,
    geoVanDerGrinten4,
    geoWagner4,
    geoWagner6,
    geoWagner7,
    geoWiechel,
    geoWinkel3,
  } from 'd3-geo-projection';
  import { useDataStore } from '@/stores/dataStore.js';

  const TAIWAN_CENTER = [120.9820246, 23.9738747];

  export default {
    name: 'MapTab',
    props: {
      currentProjection: { type: String, default: 'Azimuthal Equal Area' },
    },
    emits: ['map-ready'],
    setup(props, { emit }) {
      // 📦 存儲實例
      const dataStore = useDataStore();

      // 🗺️ 地圖相關變數
      const mapContainer = ref(null);
      const svgElement = ref(null);
      let svg = null;
      let projection = null;
      let path = null;
      let zoom = null;
      let g = null;
      let gBorder = null; // 邊框組（不受裁剪影響）
      let clipPathId = null;

      // 🎛️ 地圖控制狀態
      const isMapReady = ref(false);
      const mapContainerId = ref(`d3-map-${Math.random().toString(36).substr(2, 9)}`);

      // 世界地圖數據
      const worldData = ref(null);

      // 當前投影類型和縮放比例
      const currentProjectionType = ref('AzimuthalEquidistant');
      const currentScale = ref(80);
      const centerPresets = {
        origin: [0, 0],
        taiwan: TAIWAN_CENTER,
        lon120: [120, 0],
      };
      const currentCenterMode = ref('origin');
      const currentCenterCoords = ref(centerPresets.origin);
      const currentViewMode = ref('world');

      // ConicConformal 投影的放大倍率
      const conicConformalScale = ref(5000);

      // 圓圈現在使用 D3.js 繪製，不需要大小計算函數

      // 📊 計算屬性：檢查是否有任何圖層可見
      const isAnyLayerVisible = computed(() => dataStore.getAllLayers().length > 0);

      /**
       * 🗺️ 創建投影
       * 根據投影類型創建對應的 D3.js 投影，並自動適應版面大小
       */
      const createProjection = (type, width, height) => {
        let proj;
        const [centerLon, centerLat] = currentCenterCoords.value;
        const rotation = [-centerLon, -centerLat, 0];

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
            // Stereographic 投影：東經120度、北緯0度中心
            proj = d3.geoStereographic();
            break;
          case 'Albers':
            proj = d3.geoAlbers().parallels([20, 60]);
            break;
          case 'ConicConformal':
            // Conic Conformal 投影：標準圓錐投影，中心點設為經緯度 0,0
            proj = d3
              .geoConicConformal()
              .parallels([20, 60]) // 標準緯線：北緯20° 和 60°
              .rotate([0, 0]) // 旋轉：讓經度0度成為中心線
              .center([0, 0]); // 中心點 [經度, 緯度] (0°，0°)
            break;
          case 'ConicEqualArea':
            proj = d3.geoConicEqualArea().parallels([20, 60]);
            break;
          case 'ConicEquidistant':
            proj = d3.geoConicEquidistant().parallels([20, 60]);
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
          case 'NaturalEarth':
            proj = d3.geoNaturalEarth1();
            break;
          case 'Airy':
            proj = geoAiry();
            break;
          case 'Aitoff':
            proj = geoAitoff();
            break;
          case 'Armadillo':
            proj = geoArmadillo();
            break;
          case 'August':
            proj = geoAugust();
            break;
          case 'Baker':
            proj = geoBaker();
            break;
          case 'Berghaus':
            proj = geoBerghaus();
            break;
          case 'Bertin1953':
            proj = geoBertin1953();
            break;
          case 'Boggs':
            proj = geoBoggs();
            break;
          case 'Bonne':
            proj = geoBonne();
            break;
          case 'Bottomley':
            proj = geoBottomley();
            break;
          case 'Bromley':
            proj = geoBromley();
            break;
          case 'Chamberlin':
            // Chamberlin 需要3个点参数，使用台湾和周边地区
            proj = geoChamberlin([120.98, 23.97], [121.5, 25.0], [120.0, 22.0]);
            break;
          case 'ChamberlinAfrica':
            proj = geoChamberlinAfrica();
            break;
          case 'Collignon':
            proj = geoCollignon();
            break;
          case 'Craig':
            proj = geoCraig();
            break;
          case 'Craster':
            proj = geoCraster();
            break;
          case 'CylindricalEqualArea':
            proj = geoCylindricalEqualArea();
            break;
          case 'CylindricalStereographic':
            proj = geoCylindricalStereographic();
            break;
          case 'Eckert1':
            proj = geoEckert1();
            break;
          case 'Eckert2':
            proj = geoEckert2();
            break;
          case 'Eckert3':
            proj = geoEckert3();
            break;
          case 'Eckert4':
            proj = geoEckert4();
            break;
          case 'Eckert5':
            proj = geoEckert5();
            break;
          case 'Eckert6':
            proj = geoEckert6();
            break;
          case 'Eisenlohr':
            proj = geoEisenlohr();
            break;
          case 'Fahey':
            proj = geoFahey();
            break;
          case 'Foucaut':
            proj = geoFoucaut();
            break;
          case 'FoucautSinusoidal':
            proj = geoFoucautSinusoidal();
            break;
          case 'Gilbert':
            proj = geoGilbert();
            break;
          case 'Gingery':
            proj = geoGingery();
            break;
          case 'Ginzburg4':
            proj = geoGinzburg4();
            break;
          case 'Ginzburg5':
            proj = geoGinzburg5();
            break;
          case 'Ginzburg6':
            proj = geoGinzburg6();
            break;
          case 'Ginzburg8':
            proj = geoGinzburg8();
            break;
          case 'Ginzburg9':
            proj = geoGinzburg9();
            break;
          case 'Gringorten':
            proj = geoGringorten();
            break;
          case 'GringortenQuincuncial':
            proj = geoGringortenQuincuncial();
            break;
          case 'Guyou':
            proj = geoGuyou();
            break;
          case 'HammerRetroazimuthal':
            proj = geoHammerRetroazimuthal();
            break;
          case 'Healpix':
            proj = geoHealpix();
            break;
          case 'Hill':
            proj = geoHill();
            break;
          case 'Homolosine':
            proj = geoHomolosine();
            break;
          case 'Hufnagel':
            proj = geoHufnagel();
            break;
          case 'Hyperelliptical':
            proj = geoHyperelliptical();
            break;
          case 'InterruptedHomolosine':
            proj = geoInterruptedHomolosine();
            break;
          case 'InterruptedMollweide':
            proj = geoInterruptedMollweide();
            break;
          case 'InterruptedMollweideHemispheres':
            proj = geoInterruptedMollweideHemispheres();
            break;
          case 'InterruptedQuarticAuthalic':
            proj = geoInterruptedQuarticAuthalic();
            break;
          case 'InterruptedSinuMollweide':
            proj = geoInterruptedSinuMollweide();
            break;
          case 'Kavrayskiy7':
            proj = geoKavrayskiy7();
            break;
          case 'Lagrange':
            proj = geoLagrange();
            break;
          case 'Larrivee':
            proj = geoLarrivee();
            break;
          case 'Laskowski':
            proj = geoLaskowski();
            break;
          case 'Littrow':
            proj = geoLittrow();
            break;
          case 'Loximuthal':
            proj = geoLoximuthal();
            break;
          case 'Miller':
            proj = geoMiller();
            break;
          case 'MtFlatPolarParabolic':
            proj = geoMtFlatPolarParabolic();
            break;
          case 'MtFlatPolarQuartic':
            proj = geoMtFlatPolarQuartic();
            break;
          case 'MtFlatPolarSinusoidal':
            proj = geoMtFlatPolarSinusoidal();
            break;
          case 'NaturalEarth2':
            proj = geoNaturalEarth2();
            break;
          case 'NellHammer':
            proj = geoNellHammer();
            break;
          case 'Nicolosi':
            proj = geoNicolosi();
            break;
          case 'Patterson':
            proj = geoPatterson();
            break;
          case 'Polyconic':
            proj = geoPolyconic();
            break;
          case 'PolyhedralCollignon':
            proj = geoPolyhedralCollignon();
            break;
          case 'PolyhedralWaterman':
            proj = geoPolyhedralWaterman();
            break;
          case 'RectangularPolyconic':
            proj = geoRectangularPolyconic();
            break;
          case 'InterruptedSinusoidal':
            proj = geoInterruptedSinusoidal();
            break;
          case 'InterruptedBoggs':
            proj = geoInterruptedBoggs();
            break;
          case 'PolyhedralButterfly':
            proj = geoPolyhedralButterfly();
            break;
          case 'PeirceQuincuncial':
            proj = geoPeirceQuincuncial();
            break;
          case 'Hammer':
            proj = geoHammer();
            break;
          case 'Mollweide':
            proj = geoMollweide();
            break;
          case 'Robinson':
            proj = geoRobinson();
            break;
          case 'Sinusoidal':
            proj = geoSinusoidal();
            break;
          case 'Satellite':
            proj = geoSatellite();
            break;
          case 'SinuMollweide':
            proj = geoSinuMollweide();
            break;
          case 'Times':
            proj = geoTimes();
            break;
          case 'TwoPointAzimuthal':
            // TwoPoint 需要2个点参数，使用台湾和东京
            proj = geoTwoPointAzimuthal([120.98, 23.97], [139.69, 35.68]);
            break;
          case 'TwoPointEquidistant':
            // TwoPoint 需要2个点参数，使用台湾和东京
            proj = geoTwoPointEquidistant([120.98, 23.97], [139.69, 35.68]);
            break;
          case 'VanDerGrinten':
            proj = geoVanDerGrinten();
            break;
          case 'VanDerGrinten2':
            proj = geoVanDerGrinten2();
            break;
          case 'VanDerGrinten3':
            proj = geoVanDerGrinten3();
            break;
          case 'VanDerGrinten4':
            proj = geoVanDerGrinten4();
            break;
          case 'Wagner4':
            proj = geoWagner4();
            break;
          case 'Wagner6':
            proj = geoWagner6();
            break;
          case 'Wagner7':
            proj = geoWagner7();
            break;
          case 'Wiechel':
            proj = geoWiechel();
            break;
          case 'Winkel3':
            proj = geoWinkel3();
            break;
          default:
            proj = d3.geoAzimuthalEquidistant();
        }

        // 確保投影對象有效
        if (!proj) {
          console.error('[MapTab] 投影創建失敗:', type);
          proj = d3.geoAzimuthalEquidistant(); // 降級到預設投影
        }

        // 使用幾何邊界自動適應視窗（保留 32px 邊距）
        const padding = 32;
        const extent = [
          [padding, padding],
          [width - padding, height - padding],
        ];
        const fitTarget = getFitTarget();

        // 針對不同投影類型設定不同的旋轉
        if (proj.rotate) {
          // 根據所選中心設定投影旋轉
          try {
            proj.rotate(rotation);
          } catch (e) {
            console.warn('[MapTab] rotate 失敗:', type, e);
          }
        }

        const supportsCenterMethod = [
          'Albers',
          'ConicEqualArea',
          'ConicEquidistant',
          'AzimuthalEqualArea',
          'AzimuthalEquidistant',
          'Gnomonic',
          'Orthographic',
        ];

        try {
          if (proj.fitExtent) {
            if (type === 'ConicConformal') {
              proj.fitExtent(extent, fitTarget);
              const currentScale = proj.scale();
              proj.scale(currentScale * conicConformalScale.value);
            } else if (supportsCenterMethod.includes(type) && proj.center && currentViewMode.value === 'world') {
              proj.center([0, 0]).fitExtent(extent, fitTarget);
            } else {
              proj.fitExtent(extent, fitTarget);
            }
          } else if (proj.scale && proj.translate) {
            const scale = Math.min(width, height) / 2 - padding;
            proj.scale(scale).translate([width / 2, height / 2]);
          }
        } catch (e) {
          console.error('[MapTab] fitExtent 失敗:', type, e);
          try {
            const scale = Math.min(width, height) / 2 - padding;
            if (proj.scale && proj.translate) {
              proj.scale(scale).translate([width / 2, height / 2]);
            }
          } catch (e2) {
            console.error('[MapTab] 降級策略也失敗:', type, e2);
          }
        }

        return proj;
      };

      /**
       * 🔧 設定 ConicConformal 放大倍率
       * 設定圓錐保角投影的放大倍率
       */
      const setConicConformalScale = (scale) => {
        conicConformalScale.value = scale;
        // 如果當前是 ConicConformal 投影，立即更新
        if (currentProjectionType.value === 'ConicConformal') {
          changeProjection('ConicConformal', currentScale.value);
        }
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

        projection = createProjection(type, width, height);
        path = d3.geoPath().projection(projection);

        // 更新裁剪路徑
        if (clipPathId) {
          svg.select(`#${clipPathId} path`).datum({ type: 'Sphere' }).attr('d', path);
        }

        renderSphereBorder();
        renderCountries();
        renderGridLines();
        renderTaiwanGuides();

        console.log('[MapTab] 投影切換完成，類型:', type, '縮放:', scale, '模式:', currentViewMode.value);
      };

      const setMapCenter = (mode) => {
        const preset = centerPresets[mode] || centerPresets.origin;
        currentCenterMode.value = mode;
        currentCenterCoords.value = preset;
        if (isMapReady.value) {
          changeProjection(currentProjectionType.value, currentScale.value);
        }
      };

      const setViewMode = (mode) => {
        const normalized = mode === 'taiwan' ? 'taiwan' : 'world';
        if (currentViewMode.value === normalized && isMapReady.value) {
          if (normalized === 'taiwan' && currentCenterMode.value !== 'taiwan') {
            setMapCenter('taiwan');
          }
          return;
        }

        const previousMode = currentViewMode.value;
        currentViewMode.value = normalized;

        if (normalized === 'taiwan' && currentCenterMode.value !== 'taiwan') {
          setMapCenter('taiwan');
          if (previousMode !== normalized) {
            return;
          }
        }

        if (isMapReady.value) {
          changeProjection(currentProjectionType.value, currentScale.value);
        }
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
            .style('background', '#cecece');

          svgElement.value = svg.node();

          // 創建投影 - 使用參數化的投影類型
          // 所有投影以經緯度 0,0 為中心，自動適應版面大小
          projection = createProjection(currentProjectionType.value, width, height);

          // 創建路徑生成器
          path = d3.geoPath().projection(projection);

          // 創建裁剪路徑（用於裁剪超出投影邊界的內容）
          clipPathId = `clip-${Math.random().toString(36).substr(2, 9)}`;
          const defs = svg.append('defs');
          const clipPath = defs.append('clipPath').attr('id', clipPathId);
          clipPath.append('path').datum({ type: 'Sphere' }).attr('d', path);

          // 創建容器組（受裁剪影響，用於地圖內容）
          g = svg.append('g').attr('clip-path', `url(#${clipPathId})`);

          // 創建邊框組（不受裁剪影響，用於顯示投影邊界）
          gBorder = svg.append('g').attr('class', 'border-group');

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
            setMapCenter: (mode) => setMapCenter(mode),
            setViewMode: (mode) => setViewMode(mode),
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
       * 🌐 生成經緯線網格數據
       * 生成每30度的經線和緯線，針對ConicConformal投影限制範圍
       */
      const generateGridLines = (projectionType = 'default') => {
        const gridLines = [];

        // 根據投影類型設定不同的經緯度範圍
        let latMin, latMax, lonMin, lonMax;

        if (projectionType === 'ConicConformal') {
          // ConicConformal 投影：從北緯90度到南緯60度，不顯示南極
          latMin = -60;
          latMax = 90;
          lonMin = -180;
          lonMax = 180;
        } else {
          // 其他投影：使用完整範圍
          latMin = -90;
          latMax = 90;
          lonMin = -180;
          lonMax = 180;
        }

        // 生成緯線 (每30度一條)
        for (let lat = latMin; lat <= latMax; lat += 30) {
          // 跳過極點（它們是點而非線）
          if (lat === -90 || lat === 90) continue;

          const line = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          };

          // 每條緯線由多個點組成
          for (let lon = lonMin; lon <= lonMax; lon += 1) {
            line.geometry.coordinates.push([lon, lat]);
          }

          gridLines.push(line);
        }

        // 生成經線 (每30度一條)
        for (let lon = lonMin; lon <= lonMax - 30; lon += 30) {
          const line = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          };

          // 每條經線由多個點組成
          for (let lat = latMin; lat <= latMax; lat += 1) {
            line.geometry.coordinates.push([lon, lat]);
          }

          gridLines.push(line);
        }

        return {
          type: 'FeatureCollection',
          features: gridLines,
        };
      };

      const getFeaturesForView = () => {
        const data = worldData.value;
        if (!data?.features) return [];

        if (currentViewMode.value === 'taiwan') {
          return data.features.filter((feature) => {
            const countryName =
              feature.properties?.name ||
              feature.properties?.ADMIN ||
              feature.properties?.NAME ||
              feature.properties?.adm0_a3 ||
              feature.properties?.ADM0_A3;
            return dataStore.isHomeCountry(countryName);
          });
        }

        return data.features;
      };

      const getFitTarget = () => ({ type: 'Sphere' });

      const featureKey = (feature, index) =>
        feature.properties?.ADM0_A3 ||
        feature.properties?.adm0_a3 ||
        feature.properties?.ISO_A3 ||
        feature.properties?.iso_a3 ||
        feature.properties?.NAME ||
        feature.properties?.ADMIN ||
        feature.properties?.name ||
        feature.id ||
        `idx-${index}`;

      const renderSphereBorder = () => {
        if (!gBorder) return;
        gBorder.selectAll('path.sphere').remove();

        gBorder
          .append('path')
          .datum({ type: 'Sphere' })
          .attr('class', 'sphere')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', '#999999')
          .attr('stroke-width', 2);
      };

      const renderCountries = () => {
        if (!g || !worldData.value) return;
        const features = getFeaturesForView();
        const selection = g.selectAll('path.country').data(features, featureKey);
        selection.exit().remove();
        const merged = selection
          .enter()
          .append('path')
          .attr('class', 'country')
          .merge(selection);

        merged
          .attr('d', path)
          .attr('fill', (d) => {
            const countryName =
              d.properties.name || d.properties.ADMIN || d.properties.NAME;
            if (dataStore.isHomeCountry(countryName)) return '#ff0000';
            return '#999999';
          })
          .attr('stroke', 'none');
      };

      const renderTaiwanGuides = () => {
        if (!g || !projection) return;

        const createMeridian = (lon, id) => {
          const coordinates = [];
          for (let lat = -90; lat <= 90; lat += 1) {
            coordinates.push([lon, lat]);
          }
          return { id, type: 'Feature', geometry: { type: 'LineString', coordinates } };
        };

        const createParallel = (lat, id) => {
          const coordinates = [];
          for (let lon = -180; lon <= 180; lon += 1) {
            coordinates.push([lon, lat]);
          }
          return { id, type: 'Feature', geometry: { type: 'LineString', coordinates } };
        };

        const guidesData = [
          createMeridian(TAIWAN_CENTER[0], 'guide-longitude-taiwan-east'),
          createMeridian(TAIWAN_CENTER[0] - 180, 'guide-longitude-taiwan-west'),
          createParallel(TAIWAN_CENTER[1], 'guide-latitude-taiwan'),
          createMeridian(0, 'guide-longitude-0-east'),
          createMeridian(-180, 'guide-longitude-0-west'),
          createParallel(0, 'guide-equator'),
        ];

        const selection = g
          .selectAll('path.taiwan-guide')
          .data(guidesData, (d) => d.id);

        selection.exit().remove();

        const merged = selection
          .enter()
          .append('path')
          .attr('class', 'taiwan-guide')
          .merge(selection);

        merged
          .attr('d', (d) => path(d))
          .attr('fill', 'none')
          .attr('stroke', (d) =>
            d.id === 'guide-longitude-0-east' ||
            d.id === 'guide-longitude-0-west' ||
            d.id === 'guide-equator'
              ? '#44b046'
              : '#366cb4'
          )
          .attr('stroke-width', 4)
          .attr('opacity', 0.9)
          .raise();
      };

      const renderGridLines = () => {
        if (!g) return;
        g.selectAll('path.grid-line').remove();
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
          const features = getFeaturesForView();
          console.log('[MapTab] 開始繪製地圖，特徵數量:', features.length);

          renderSphereBorder();
          renderCountries();
          renderGridLines();
          renderTaiwanGuides();

          console.log('[MapTab] 地圖繪製完成，模式:', currentViewMode.value);
        } catch (error) {
          console.error('[MapTab] 世界地圖繪製失敗:', error);
        }
      };

      // addCityMarkers 函數已移除 - 不再需要城市標記

      /**
       * 🌍 導航到指定位置
       * 保留此函數以維持兼容性
       */
      const navigateToLocation = () => {
        // 地圖中心點已固定在經緯度 0,0
        console.log('[MapTab] 地圖中心點已固定');
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

        projection = createProjection(currentProjectionType.value, width, height);
        path = d3.geoPath().projection(projection);

        // 更新裁剪路徑
        if (clipPathId) {
          svg.select(`#${clipPathId} path`).datum({ type: 'Sphere' }).attr('d', path);
        }

        renderSphereBorder();
        renderCountries();
        renderGridLines();
        renderTaiwanGuides();

        console.log('[MapTab] 地圖尺寸更新完成，模式:', currentViewMode.value);
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
        gBorder = null;
        clipPathId = null;
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
        navigateToLocation,
        changeProjection,
        setMapCenter,
        setViewMode,
        // ConicConformal 相關
        conicConformalScale,
        setConicConformalScale,
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

  :deep(.grid-line) {
    transition: opacity 0.3s ease;
  }

  :deep(.grid-line:hover) {
    opacity: 1 !important;
    stroke-width: 2 !important;
    stroke: #333333 !important;
  }
</style>
