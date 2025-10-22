/**
 * 📦 數據存儲模組 (Data Store Module)
 *
 * 管理城市圖層數據和地圖導航功能
 * 使用 Pinia 狀態管理系統和 Vue 3 Composition API
 */

// 核心依賴
import { defineStore } from 'pinia';
import { ref } from 'vue';

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
     * 🔴 微型國家座標 (Micro-states Coordinates)
     *
     * 這些國家在低解析度地圖中不存在，用圓圈標記顯示
     * 格式：{ name: '國家名稱', coordinates: [經度, 緯度] }
     * 按洲別分組
     */
    const microStates = ref([
      // 亞洲 (Asia)
      { name: 'Bahrain', coordinates: [50.5577, 26.0667] }, // 巴林
      { name: 'Maldives', coordinates: [73.2207, 3.2028] }, // 馬爾地夫
      { name: 'Singapore', coordinates: [103.8198, 1.3521] }, // 新加坡

      // 歐洲 (Europe)
      { name: 'Andorra', coordinates: [1.5218, 42.5063] }, // 安道爾
      { name: 'Liechtenstein', coordinates: [9.5215, 47.141] }, // 列支敦士登
      { name: 'Malta', coordinates: [14.3754, 35.9375] }, // 馬爾他
      { name: 'Monaco', coordinates: [7.4246, 43.7384] }, // 摩納哥
      { name: 'San Marino', coordinates: [12.4578, 43.9424] }, // 聖馬利諾
      { name: 'Vatican', coordinates: [12.4534, 41.9029] }, // 梵蒂岡

      // 北美洲 (North America)
      { name: 'Antigua and Barbuda', coordinates: [-61.8456, 17.0608] }, // 安地卡及巴布達
      { name: 'Barbados', coordinates: [-59.5432, 13.1939] }, // 巴巴多斯
      { name: 'Dominica', coordinates: [-61.371, 15.415] }, // 多米尼克
      { name: 'Grenada', coordinates: [-61.679, 12.1165] }, // 格瑞那達
      { name: 'Saint Kitts and Nevis', coordinates: [-62.783, 17.3578] }, // 聖克里斯多福及尼維斯
      { name: 'Saint Lucia', coordinates: [-60.9789, 13.9094] }, // 聖露西亞
      { name: 'Saint Vincent and the Grenadines', coordinates: [-61.2872, 13.2528] }, // 聖文森及格瑞那丁

      // 非洲 (Africa)
      { name: 'Cabo Verde', coordinates: [-23.6052, 16.5388] }, // 維德角
      { name: 'Comoros', coordinates: [43.3333, -11.6455] }, // 葛摩
      { name: 'Mauritius', coordinates: [57.5522, -20.1609] }, // 模里西斯
      { name: 'São Tomé and Príncipe', coordinates: [6.6131, 0.1864] }, // 聖多美普林西比
      { name: 'Seychelles', coordinates: [55.492, -4.6796] }, // 塞席爾

      // 大洋洲 (Oceania)
      { name: 'Kiribati', coordinates: [-157.363, 1.8709] }, // 吉里巴斯
      { name: 'Marshall Islands', coordinates: [171.1845, 7.1315] }, // 馬紹爾群島
      { name: 'Micronesia', coordinates: [158.1625, 6.9248] }, // 密克羅尼西亞
      { name: 'Nauru', coordinates: [166.9315, -0.5228] }, // 諾魯
      { name: 'Niue', coordinates: [-169.9167, -19.0544] }, // 紐埃
      { name: 'Palau', coordinates: [134.5825, 7.515] }, // 帛琉
      { name: 'Samoa', coordinates: [-172.1046, -13.759] }, // 薩摩亞
      { name: 'Tonga', coordinates: [-175.1982, -21.1789] }, // 東加
      { name: 'Tuvalu', coordinates: [179.1962, -8.5167] }, // 吐瓦魯
    ]);

    /**
     * 🔵 參與國家列表 (Participant Countries List)
     *
     * 這些國家在地圖上會以淺藍色標示
     * 名稱需與 GeoJSON 中的 properties.NAME 欄位完全匹配
     * 按洲別分組
     */
    const participantCountries = ref([
      // 亞洲 (Asia)
      'Armenia', // 亞美尼亞
      'Azerbaijan', // 亞塞拜然
      'Bahrain', // 巴林
      'Bangladesh', // 孟加拉
      'Bhutan', // 不丹
      'Brunei', // 汶萊
      'Cambodia', // 柬埔寨
      'China', // 中國
      'India', // 印度
      'Indonesia', // 印尼
      'Israel', // 以色列
      'Japan', // 日本
      'Jordan', // 約旦
      'Kazakhstan', // 哈薩克
      'South Korea', // 韓國
      'Kuwait', // 科威特
      'Kyrgyzstan', // 吉爾吉斯
      'Laos', // 寮國
      'Malaysia', // 馬來西亞
      'Mongolia', // 蒙古
      'Nepal', // 尼泊爾
      'Oman', // 阿曼
      'Pakistan', // 巴基斯坦
      'Palestine', // 巴勒斯坦
      'Philippines', // 菲律賓
      'Qatar', // 卡達
      'Saudi Arabia', // 沙烏地阿拉伯
      'Singapore', // 新加坡
      'Sri Lanka', // 斯里蘭卡
      'Taiwan', // 台灣
      'Tajikistan', // 塔吉克
      'Thailand', // 泰國
      'Timor-Leste', // 東帝汶
      'Turkey', // 土耳其
      'Turkmenistan', // 土庫曼
      'United Arab Emirates', // 阿拉伯聯合大公國
      'Uzbekistan', // 烏茲別克
      'Vietnam', // 越南
      'Yemen', // 葉門

      // 歐洲 (Europe)
      'Austria', // 奧地利
      'Belgium', // 比利時
      'Bulgaria', // 保加利亞
      'Croatia', // 克羅埃西亞
      'Czechia', // 捷克
      'Denmark', // 丹麥
      'Finland', // 芬蘭
      'France', // 法國
      'Germany', // 德國
      'Hungary', // 匈牙利
      'Iceland', // 冰島
      'Ireland', // 愛爾蘭
      'Italy', // 義大利
      'Kosovo', // 科索沃
      'Latvia', // 拉脫維亞
      'Lithuania', // 立陶宛
      'Luxembourg', // 盧森堡
      'Malta', // 馬爾他
      'Moldova', // 摩爾多瓦
      'Monaco', // 摩納哥
      'Montenegro', // 蒙特內哥羅
      'Netherlands', // 荷蘭
      'North Macedonia', // 北馬其頓
      'Norway', // 挪威
      'Poland', // 波蘭
      'Portugal', // 葡萄牙
      'Romania', // 羅馬尼亞
      'San Marino', // 聖馬利諾
      'Serbia', // 塞爾維亞
      'Slovakia', // 斯洛伐克
      'Slovenia', // 斯洛維尼亞
      'Spain', // 西班牙
      'Sweden', // 瑞典
      'Switzerland', // 瑞士
      'Ukraine', // 烏克蘭
      'United Kingdom', // 英國
      'Vatican', // 梵蒂岡

      // 北美洲 (North America)
      'Antigua and Barbuda', // 安地卡及巴布達
      'Barbados', // 巴巴多斯
      'Belize', // 貝里斯
      'Canada', // 加拿大
      'Cuba', // 古巴
      'Dominican Rep.', // 多明尼加
      'Grenada', // 格瑞那達
      'Guatemala', // 瓜地馬拉
      'Haiti', // 海地
      'Honduras', // 宏都拉斯
      'Jamaica', // 牙買加
      'Panama', // 巴拿馬
      'Saint Kitts and Nevis', // 聖克里斯多福及尼維斯
      'Saint Lucia', // 聖露西亞
      'Saint Vincent and the Grenadines', // 聖文森及格瑞那丁
      'Trinidad and Tobago', // 千里達及托巴哥
      'United States of America', // 美國

      // 南美洲 (South America)
      'Bolivia', // 玻利維亞
      'Brazil', // 巴西
      'Chile', // 智利
      'Colombia', // 哥倫比亞
      'Guyana', // 蓋亞那
      'Paraguay', // 巴拉圭
      'Peru', // 秘魯
      'Suriname', // 蘇利南
      'Uruguay', // 烏拉圭

      // 非洲 (Africa)
      'Algeria', // 阿爾及利亞
      'Angola', // 安哥拉
      'Benin', // 貝南
      'Burkina Faso', // 布吉納法索
      'Burundi', // 蒲隆地
      'Cabo Verde', // 維德角
      'Cameroon', // 喀麥隆
      'Central African Rep.', // 中非共和國
      'Chad', // 查德
      'Comoros', // 葛摩
      "Côte d'Ivoire", // 象牙海岸
      'Dem. Rep. Congo', // 剛果民主共和國
      'Djibouti', // 吉布地
      'Egypt', // 埃及
      'Eq. Guinea', // 赤道幾內亞
      'eSwatini', // 史瓦帝尼
      'Ethiopia', // 衣索比亞
      'Gabon', // 加彭
      'Gambia', // 甘比亞
      'Ghana', // 迦納
      'Guinea', // 幾內亞
      'Guinea-Bissau', // 幾內亞比索
      'Kenya', // 肯亞
      'Lesotho', // 賴索托
      'Liberia', // 賴比瑞亞
      'Madagascar', // 馬達加斯加
      'Malawi', // 馬拉威
      'Mali', // 馬利
      'Mauritania', // 茅利塔尼亞
      'Mauritius', // 模里西斯
      'Mozambique', // 莫三比克
      'Nigeria', // 奈及利亞
      'Rwanda', // 盧安達
      'São Tomé and Príncipe', // 聖多美普林西比
      'Senegal', // 塞內加爾
      'Seychelles', // 塞席爾
      'Sierra Leone', // 獅子山
      'Somalia', // 索馬利亞
      'S. Sudan', // 南蘇丹
      'Sudan', // 蘇丹
      'Tanzania', // 坦尚尼亞
      'Togo', // 多哥
      'Tunisia', // 突尼西亞
      'Uganda', // 烏干達
      'Zambia', // 尚比亞
      'Zimbabwe', // 辛巴威

      // 大洋洲 (Oceania)
      'Australia', // 澳大利亞
      'Fiji', // 斐濟
      'Marshall Islands', // 馬紹爾群島
      'Micronesia', // 密克羅尼西亞
      'Nauru', // 諾魯
      'Palau', // 帛琉
      'Papua New Guinea', // 巴布亞紐幾內亞
      'Samoa', // 薩摩亞
      'Solomon Is.', // 索羅門群島
      'Tonga', // 東加
      'Tuvalu', // 吐瓦魯
      'Vanuatu', // 萬那杜
    ]);

    /**
     * 🟢 退出國家列表 (Withdrawn Countries List)
     *
     * 這些國家已退出，在地圖上會以綠色標示
     * 按洲別分組
     */
    const withdrawnCountries = ref([
      // 亞洲 (Asia)
      'Afghanistan', // 阿富汗 (1 November 2024)
      'Iran', // 伊朗 (27 December 2024)

      // 歐洲 (Europe)
      'Estonia', // 愛沙尼亞 (14 November 2023)
      'Greece', // 希臘 (29 November 2024)
      'Russia', // 俄羅斯 (28 November 2023)

      // 北美洲 (North America)
      'El Salvador', // 薩爾瓦多 (27 December 2024)
      'Mexico', // 墨西哥 (14 November 2023)

      // 南美洲 (South America)
      'Argentina', // 阿根廷 (18 June 2024)

      // 非洲 (Africa)
      'Botswana', // 波札那 (27 December 2024)
      'Niger', // 尼日 (1 November 2024)
      'South Africa', // 南非 (27 December 2024)

      // 大洋洲 (Oceania)
      'Niue', // 紐埃 (18 June 2024)
    ]);

    /**
     * 🔴 未參與國家列表 (Non-Participant Countries List)
     *
     * 這些國家未參與，在地圖上會以紅色標示
     * 按洲別分組
     */
    const nonParticipantCountries = ref([
      // 亞洲 (Asia)
      'Cyprus', // 賽普勒斯
      'Georgia', // 喬治亞
      'Iraq', // 伊拉克
      'Lebanon', // 黎巴嫩
      'Maldives', // 馬爾地夫
      'Myanmar', // 緬甸
      'North Korea', // 北韓
      'Syria', // 敘利亞

      // 歐洲 (Europe)
      'Albania', // 阿爾巴尼亞
      'Andorra', // 安道爾
      'Belarus', // 白俄羅斯
      'Bosnia and Herz.', // 波士尼亞與赫塞哥維納
      'Liechtenstein', // 列支敦士登

      // 北美洲 (North America)
      'Bahamas', // 巴哈馬
      'Costa Rica', // 哥斯大黎加
      'Dominica', // 多米尼克
      'Nicaragua', // 尼加拉瓜

      // 南美洲 (South America)
      'Ecuador', // 厄瓜多
      'Venezuela', // 委內瑞拉

      // 非洲 (Africa)
      'Congo', // Republic of the Congo（GeoJSON NAME）
      'Eritrea', // 厄利垂亞
      'Libya', // 利比亞
      'Morocco', // 摩洛哥
      'Namibia', // 納米比亞

      // 大洋洲 (Oceania)
      'Cook Islands', // 庫克群島
      'Kiribati', // 吉里巴斯
      'New Zealand', // 紐西蘭
    ]);

    /**
     * 🔍 檢查國家類型的輔助函數
     *
     * @param {string} countryName - 國家名稱
     * @param {Array} countryList - 要檢查的國家列表
     * @returns {boolean} 是否在列表中
     */
    const isCountryInList = (countryName, countryList) => {
      if (!countryName) return false;

      // 僅允許完全匹配；名稱以 GeoJSON 的欄位為準
      const normalizedName = countryName.trim();
      return countryList.some((country) => normalizedName === country);
    };

    /**
     * 🔵 檢查國家是否為參與國 (Check if Country is Participant)
     *
     * @param {string} countryName - 國家名稱（來自 GeoJSON 的 properties.name 或其他屬性）
     * @returns {boolean} 是否為參與國家
     */
    const isParticipantCountry = (countryName) => {
      return isCountryInList(countryName, participantCountries.value);
    };

    /**
     * 🟢 檢查國家是否為退出國 (Check if Country is Withdrawn)
     *
     * @param {string} countryName - 國家名稱（來自 GeoJSON 的 properties.name 或其他屬性）
     * @returns {boolean} 是否為退出國家
     */
    const isWithdrawnCountry = (countryName) => {
      return isCountryInList(countryName, withdrawnCountries.value);
    };

    /**
     * 🔴 檢查國家是否為未參與國 (Check if Country is Non-Participant)
     *
     * @param {string} countryName - 國家名稱（來自 GeoJSON 的 properties.name 或其他屬性）
     * @returns {boolean} 是否為未參與國家
     */
    const isNonParticipantCountry = (countryName) => {
      return isCountryInList(countryName, nonParticipantCountries.value);
    };

    // ------------------------------------------------------------
    // 地圖實例管理
    const mapInstance = ref(null);

    const setMapInstance = (map) => {
      mapInstance.value = map;
    };

    return {
      mapInstance, // 地圖實例
      setMapInstance, // 設定地圖實例
      participantCountries, // 參與國家列表
      withdrawnCountries, // 退出國家列表
      nonParticipantCountries, // 未參與國家列表
      isParticipantCountry, // 檢查國家是否為參與國
      isWithdrawnCountry, // 檢查國家是否為退出國
      isNonParticipantCountry, // 檢查國家是否為未參與國
      microStates, // 微型國家座標列表
    };
  },
  {
    persist: true,
  }
);
