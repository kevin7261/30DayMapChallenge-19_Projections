# 🌍 30DayMapChallenge-04_Data-challenge-My-Data - 世界國家地圖

一個基於 Vue 3 和 Leaflet 的互動式世界國家地圖應用程式，展示六大國家的座標點。

## 📋 目錄

- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [專案結構](#專案結構)
- [安裝與運行](#安裝與運行)
- [使用說明](#使用說明)
- [API 文檔](#api-文檔)
- [開發指南](#開發指南)
- [部署說明](#部署說明)

## ✨ 功能特色

### 🗺️ 地圖功能

- **世界國家展示**: 顯示台灣、中國、日本、美國、法國、德國六大國家
- **國家導航**: 點擊按鈕快速導航到指定國家
- **標準底圖**: 使用 Carto Dark 底圖樣式
- **響應式設計**: 適配各種設備尺寸

### 🎨 用戶界面

- **簡潔設計**: 基於 Bootstrap 5 的現代化界面
- **直觀操作**: 左上角控制面板，操作簡單
- **視覺效果**: 平滑的地圖動畫和過渡效果
- **HTML 中心點**: 在截圖框框中央顯示固定的白色圓點

### 🚀 技術特色

- **Vue 3 Composition API**: 現代化的 Vue 開發模式
- **Pinia 狀態管理**: 高效的響應式狀態管理
- **Leaflet 地圖庫**: 輕量級、高性能的地圖解決方案
- **模組化架構**: 清晰的代碼組織和維護性

## 🏗️ 技術架構

### 前端技術棧

- **Vue 3.3+**: 前端框架
- **Leaflet 1.9+**: 地圖庫
- **Pinia**: 狀態管理
- **Bootstrap 5**: UI 框架
- **Vue CLI**: 構建工具

### 核心組件

- **HomeView**: 主頁面組件，整合地圖和控制面板
- **MapTab**: 地圖顯示組件，處理地圖渲染和互動
- **dataStore**: 數據管理，處理國家數據和導航
- **defineStore**: 配置管理，處理底圖和地圖狀態

## 📁 專案結構

```
30DayMapChallenge-04_Data-challenge-My-Data/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── css/               # 樣式文件
│   │       ├── common.css     # 通用樣式
│   │       └── variables.css  # CSS 變數
│   ├── stores/
│   │   ├── dataStore.js       # 國家數據存儲
│   │   └── defineStore.js     # 配置存儲
│   ├── tabs/
│   │   └── MapTab.vue         # 地圖組件
│   ├── views/
│   │   └── HomeView.vue       # 主頁面
│   ├── main.js                # 應用入口
│   └── router/
│       └── index.js           # 路由配置
├── package.json
└── README.md
```

## 🚀 安裝與運行

### 環境要求

- Node.js 16.0+
- npm 7.0+ 或 yarn 1.22+

### 安裝步驟

1. **克隆專案**

   ```bash
   git clone https://github.com/kevin7261/30DayMapChallenge-04_Data-challenge-My-Data.git
   cd 30DayMapChallenge-04_Data-challenge-My-Data
   ```

2. **安裝依賴**

   ```bash
   npm install
   # 或
   yarn install
   ```

3. **啟動開發服務器**

   ```bash
   npm run serve
   # 或
   yarn serve
   ```

4. **構建生產版本**
   ```bash
   npm run build
   # 或
   yarn build
   ```

### 開發服務器

- 本地地址: `http://localhost:8080/30DayMapChallenge-04_Data-challenge-My-Data/`
- 網路地址: `http://[your-ip]:8080/30DayMapChallenge-04_Data-challenge-My-Data/`

## 📖 使用說明

### 基本操作

1. **國家導航**

   - 點擊左上角「國家導航」區域的按鈕
   - 地圖會平滑移動到對應國家
   - 支援的國家：台灣、中國、日本、美國、法國、德國

2. **地圖互動**
   - 滑鼠滾輪：縮放地圖
   - 拖拽：移動地圖視圖
   - 中心點：在截圖框框中央顯示固定的白色圓點

### 支援的國家

| 國家名稱 | 座標                | 縮放級別 |
| -------- | ------------------- | -------- |
| 台灣     | 25.04583, 121.51972 | 16       |
| 中國     | 39.89877, 116.39288 | 16       |
| 日本     | 35.68404, 139.77449 | 16       |
| 美國     | 38.89511, -77.03655 | 16       |
| 法國     | 48.85333, 2.34889   | 16       |
| 德國     | 52.51083, 13.39889  | 16       |

## 📚 API 文檔

### dataStore API

#### 方法

- `getAllLayers()`: 獲取所有國家圖層
- `findLayerById(layerId)`: 根據 ID 查找國家圖層
- `navigateToCountry(countryId)`: 導航到指定國家
- `setMapInstance(map)`: 設定地圖實例

#### 狀態

- `layers`: 國家圖層配置數組
- `mapInstance`: Leaflet 地圖實例
- `selectedFeature`: 當前選中的要素

### defineStore API

#### 方法

- `setSelectedBasemap(value)`: 設定選中的底圖
- `setMapView(center, zoom)`: 設定地圖視圖狀態

#### 狀態

- `selectedBasemap`: 當前選中的底圖類型
- `mapView`: 地圖視圖狀態
- `basemaps`: 底圖配置列表

## 🛠️ 開發指南

### 添加新國家

1. **準備國家座標**

   - 確定國家的中心座標 [經度, 緯度]
   - 選擇合適的縮放級別

2. **更新國家配置**

   ```javascript
   // 在 src/stores/dataStore.js 中添加
   {
     layerId: 'NewCountry',
     layerName: 'NEW COUNTRY',
     center: [lng, lat], // 國家中心座標 [經度, 緯度]
   }
   ```

3. **更新按鈕樣式**

   - 按鈕會自動使用 `my-country-btn` 樣式
   - 如需自定義樣式，請修改 `common.css`

### 自定義樣式

1. **修改國家按鈕樣式**

   ```css
   /* 在 src/assets/css/common.css 中 */
   .my-country-btn {
     /* 自定義樣式 */
   }
   ```

2. **修改中心點樣式**

   ```html
   <!-- 在 src/tabs/MapTab.vue 中 -->
   <div class="rounded-circle bg-white" style="width: 12px; height: 12px"></div>
   ```

### 開發工具

- **Vue DevTools**: 調試 Vue 組件和狀態
- **Leaflet Debug**: 使用瀏覽器開發者工具調試地圖
- **ESLint**: 代碼質量檢查

## 🚀 部署說明

### GitHub Pages 部署

1. **構建專案**

   ```bash
   npm run build
   ```

2. **部署到 GitHub Pages**

   ```bash
   npm run deploy
   ```

3. **訪問網站**

   ```
   https://kevin7261.github.io/30DayMapChallenge-04_Data-challenge-My-Data/
   ```

### 環境變數

創建 `.env` 文件配置環境變數：

```env
# 開發環境
NODE_ENV=development
VUE_APP_API_URL=http://localhost:3000

# 生產環境
NODE_ENV=production
VUE_APP_API_URL=https://your-api-domain.com
```

### 性能優化

1. **代碼分割**: 使用動態導入減少初始包大小
2. **圖片優化**: 移除不必要的 GeoJSON 文件
3. **緩存策略**: 配置適當的 HTTP 緩存頭

## 🤝 貢獻指南

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯繫方式

- 專案維護者: [Your Name]
- 電子郵件: [your.email@example.com]
- 專案連結:
  [https://github.com/kevin7261/30DayMapChallenge-04_Data-challenge-My-Data](https://github.com/kevin7261/30DayMapChallenge-04_Data-challenge-My-Data)

## 🙏 致謝

- [Leaflet](https://leafletjs.com/) - 開源地圖庫
- [Vue.js](https://vuejs.org/) - 漸進式 JavaScript 框架
- [Bootstrap](https://getbootstrap.com/) - CSS 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 狀態管理庫

---

**30DayMapChallenge-04_Data-challenge-My-Data** - 探索世界國家的點之美 🌍✨
