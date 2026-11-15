# 补天派对 · 安卓平板离线试玩（重制原型）

本项目重新制作，非原来丢失的文件；仅单人、离线、WebGL 浏览器试玩，非 APK、非多人、非 Steam 成品。推荐安卓平板横屏；文件管理器选择支持本地 HTML 和 WebGL 的浏览器打开。并非所有安卓文件管理器/浏览器允许本地 HTML，尚未在安卓真机验证。

开始后先点击“放垫”，方向键走近月亮，再按“踢球”；弹垫接住月亮后会将它弹向金色目标，进球得分。触屏方向按钮可以按住移动；也可用 WASD / 方向键、E 放垫、F 踢球、空格跳跃。

本地构建：`npm ci && npm test && npm run build`（在本目录执行），输出 `../deliverables/SkyPatch-Android-Offline.html`。HTML 内嵌代码、背景和字体，运行无需网络或服务器。

画面为程序生成的临时几何体及 AI 背景，不代表最终原创美术。使用 Three.js（MIT，`assets/THREE-LICENSE.txt`），Noto Sans SC 字体子集（SIL OFL，`assets/FONT-LICENSE.txt`），许可也包含在生成 HTML 中。测试采用 Node 规则测试与桌面 Chromium 离线平板触屏模拟，不等同真实安卓设备测试。
