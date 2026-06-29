# 四草大眾廟技術棧遷移計畫書 (ASP 轉 WordPress 現代化架構)

本計畫書旨在規劃如何將「四草大眾廟網站（現行 Classic ASP 系統）」遷移至與「小野照崎神社」相同的現代化技術棧（WordPress + 輕量化前端套件 + 現代 SEO/效能優化機制）。

---

## 遷移目標對照表

| 項目 | 現行架構 (四草大眾廟) | 目標架構 (小野照崎神社) |
| :--- | :--- | :--- |
| **核心後端** | Windows IIS + Classic ASP (`.asp`) | Linux (Nginx/Apache) + PHP 8.x + **WordPress** |
| **資料庫** | MS SQL Server | MySQL / MariaDB |
| **網址路徑** | 動態參數型：`page.asp?orcaid={...}` | 語義化網址：`/green-tunnel/` |
| **前端樣式** | Bootstrap v3 + 商業套件 (Jango Theme) | 自製客製主題 + BEM 命名規範 + 現代 CSS (Flexbox/Grid/Variables) |
| **JS 互動** | jQuery + Revolution Slider + Owl Carousel | Swiper.js + MicroModal + 原生 Intersection Observer |
| **效能優化** | 無特別優化，載入較重的 Google Maps SDK | 圖片延遲載入 (Lazy Load) + Speculation Rules 預載 + Iframe 地圖 |
| **SEO 標籤** | 舊版 Dublin Core (DC) 元數據 | All in One SEO + JSON-LD 結構化資料 (Schema.org) |

---

## 具體執行步驟

### 第一階段：基礎建設與 WordPress 環境架設
1. **主機與環境準備**：
   * 架設支援 PHP 8.2+ 及 MySQL 8.0+ 的現代網頁主機環境（如 LNMP: Linux, Nginx, MySQL, PHP）。
   * 申請並設定 SSL 憑證，強制全站走 HTTPS 安全協定。
2. **安裝 WordPress 核心**：
   * 部署最新穩定版 WordPress。
   * 在 Nginx/Apache 中配置 URL 重寫規則（Rewriting Rules），以支援語義化乾淨網址（Pretty Permalinks）。

### 第二階段：資料庫遷移與 URL 轉址 (301 Redirect)
1. **資料清理與匯出**：
   * 從舊有的 SQL Server 資料庫中，分析並匯出最新消息、大眾廟介紹、觀光船資訊、活動相簿等欄位資料（`.csv` 或 `.sql`）。
2. **資料導入 WordPress**：
   * 將舊資料對應寫入 WordPress 的 `wp_posts`（文章/頁面）與 `wp_postmeta`（自訂欄位）資料表，或使用 WP All Import 等工具進行資料對應導入。
3. **SEO 權重保留 (301 重定向)**：
   * 由於舊網址（例如 `page.asp?orcaid={...}`）已被搜尋引擎收錄，必須建立一對一的 **301 永久轉址** 對照表。
   * 在伺服器配置文件（如 `.htaccess` 或 `nginx.conf`）或使用 WordPress Redirection 外掛，將舊網址導向新的語義化網址（例如將 `page.asp?orcaid={綠色隧道ID}` 導向 `/green-tunnel/`），防止 SEO 排名流失與 404 錯誤。

### 第三階段：現代化客製佈景主題開發
1. **建立專屬主題 (Child Theme / Custom Theme)**：
   * 在 `wp-content/themes/` 目錄下建立全新的客製主題資料夾 `4grass-modern`。
2. **樣式系統重構 (CSS)**：
   * 拋棄 Bootstrap 3 的舊格線系統，改用 CSS Grid 與 Flexbox 實現響應式排版。
   * 引進 CSS 變數（CSS Variables）定義大眾廟的代表色（如廟宇紅、生態綠），方便後續維護。
   * CSS 命名統一改採 **BEM 規範**（例如：`.l-header`、`.c-card__title`、`.p-tunnel-intro`），提升代碼可讀性與避免樣式衝突。
3. **切版與範本製作**：
   * 將原有的網頁單頁（Page）與清單頁（List）模版轉化為 WordPress 範本檔案（如 `page.php`、`archive.php`、`single.php`）。

### 第四階段：JavaScript 與互動元件輕量化
1. **移除 jQuery 依賴與舊套件**：
   * 停止載入舊式的 Revolution Slider、Owl Carousel、WOW.js 等龐大套件。
2. **導入現代輕量套件**：
   * **輪播圖**：改用 **Swiper.js** 重新實作首頁的全螢幕輪播與底部相關連結滑動條。
   * **彈出視窗**：改用 **MicroModal.js**（或 HTML5 原生 `<dialog>` 標籤）來處理彈出公告或相簿燈箱。
   * **滾動動畫**：利用 JavaScript 原生的 **Intersection Observer API** 取代 WOW.js，監聽畫面滾動並加入 CSS Fade-in 動畫，降低 CPU 負載。
3. **優化 Google Maps**：
   * 移除前端重型的 Google Maps JS API（及相關金鑰呼叫）。
   * 直接改用 `<iframe src="https://www.google.com/maps/embed?...">` 嵌入地圖，並加入 `loading="lazy"` 屬性。

### 第五階段：效能優化 (Performance)
1. **圖片延遲載入 (Lazy Loading)**：
   * 全站圖片加上 `loading="lazy"` 屬性。
   * 使用輕量 `lazyload.js` 或設定 WordPress 預設的圖片優化機制，使首頁加載時間大幅縮短。
2. **導入 Speculation Rules API**：
   * 在首頁的 `<footer>` 之前插入 Speculation Rules 的 JSON 配置，當使用者滑鼠懸停於選單連結時，瀏覽器會保守預載（Prefetch）該頁面 HTML：
     ```html
     <script type="speculationrules">
     {
       "prefetch": [
         {
           "source": "document",
           "where": {
             "and": [
               { "href_matches": "/*" },
               { "not": { "href_matches": ["/wp-*.php", "/wp-admin/*", "/*\\?(.+)"] } }
             ]
           },
           "eagerness": "conservative"
         }
       ]
     }
     </script>
     ```
3. **快取與 CDN 設定**：
   * 安裝 WordPress 快取外掛（如 LiteSpeed Cache 或 WP Rocket）產出靜態 HTML 快取。
   * 使用 Cloudflare 等 CDN 進行全站加速與防禦。

### 第六階段：現代 SEO 與 社群整合
1. **SEO 外掛設定**：
   * 安裝 **All in One SEO (AIOSEO)** 或 Rank Math。
   * 設定全站 Meta Description、Open Graph (Facebook) 及 Twitter Cards 標籤。
2. **JSON-LD 結構化標記**：
   * 在網站中設定 `Place` 或 `LocalBusiness` 的 Schema 資料，精確告知搜尋引擎大眾廟的電話、地址、營業時間與坐標，提升 Google 地圖與關鍵字的曝光度。
3. **整合外部社群平台**：
   * 將部分經常變動的社群動態或旅遊專欄，整合至 note.com 或直接利用 WordPress 內建的 REST API 自動發送/串接。
