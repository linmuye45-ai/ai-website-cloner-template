# 部署与恢复指南

## 永久网址（GitHub Pages，不受沙箱重置影响）

- 地址：https://linmuye45-ai.github.io/ai-website-cloner-template/
- 入口：`/play/`（Phaser 版 Sunny Land）、`/game/`（自研引擎 Ember Trail）
- 内容存放在仓库 `gh-pages` 分支，由 GitHub 基础设施托管，沙箱重启、
  `node_modules` 被清空都不影响线上访问。

### 重新部署

代码变更后一条命令完成静态导出并强制推送 `gh-pages`：

```bash
npm run deploy:pages
```

脚本（`scripts/deploy/pages.sh`）做的事：

1. 以 `NEXT_PUBLIC_EXPORT=1` + `NEXT_PUBLIC_BASE_PATH=/ai-website-cloner-template`
   执行 `next build`，产出纯静态 `out/`；
2. 写入 `.nojekyll`（保证 `_next/` 资产不被 Jekyll 忽略）；
3. 在 `out/` 内建立独立 git 仓库，强制推送到 `gh-pages` 分支。

Pages 的 Source 需要在仓库 Settings → Pages 中指向 `gh-pages` / root
（当前已配置；细粒度 token 无 Pages 管理权限时这一步需人工确认一次）。

## 子路径适配原理

项目页 URL 带 `/ai-website-cloner-template` 前缀，所有资产路径通过
`src/phaser-game/assets.ts` 的 `ASSET_BASE`（构建期注入的
`NEXT_PUBLIC_BASE_PATH`）统一拼接；Tiled 地图 JSON 内嵌的图片绝对路径
在 `PlayScene` 建图前于运行时加前缀。本地 dev 模式下该常量为空字符串，
行为与此前完全一致。

## 沙箱内预览（临时，重置后需恢复）

dev server 跑在 `0.0.0.0:3000`，沙箱重置会杀掉进程并清空 `node_modules`。
一键恢复：

```bash
npm run resume        # scripts/dev/resume.sh：缺依赖则安装，然后启动 dev
```

跨域说明：预览经 `*.e2b.app` 代理访问，`next.config.ts` 的
`allowedDevOrigins` 已放行，否则 Next 16 会拦截开发资源导致白屏。

## 两套形态对照

| | dev/standalone | GitHub Pages 静态导出 |
| --- | --- | --- |
| 启动方式 | `npm run dev` | `npm run deploy:pages` |
| 运行时 | 需要 Node | 任意静态主机 |
| 资产前缀 | 根路径 | `/ai-website-cloner-template` |
| 寿命 | 沙箱重置即失效 | 永久，直到下次部署覆盖 |
