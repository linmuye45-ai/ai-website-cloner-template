> **状态更新：** 本文件的原始规划和状态记录可能过时；当前交付范围和测试记录以 [Party Lab 功能与部署](05-party-release.md) 为准。

# 产品需求与技术方案（实验版）

## 1. 定位与取舍

主推：给**社群运营者、活动代理与品牌活动负责人**制作可配置、可邀请、浏览器打开即玩的短局游戏。买方要可控、可复用、快速交付和参与度数据；玩家要不用下载、规则秒懂、有朋友一起玩且愿意再来。三个都仅为访谈假说。现阶段建议先找英语和中文社群的成人组织者，不面向儿童公开运营。

保留：原有移动端官网基础、Canvas 体验及本地草稿；删除/不再强调：未经证实的百角兽叙事与概念卡片冒充产品；重做：将用户引入实际规则、邀请与对局的短链路。品牌 OMNIVERSE 暂为内部代号，参见商标风险。

### 用户为何创作、邀请、复玩？

组织者想让自己的活动、粉丝和品牌有共同记忆；不是为了重复制作另一个普通小游戏。朋友点击是因为被认识的人邀请，30 秒内能参与并看到结果。创作者回访假说是能换主题、改规则并服务下一次活动；付费理由是假设品牌配置、活动支持、可靠托管、结果导出能节省人力。为什么不选 Roblox/Astrocade？我们必须实证证明免安装、私有活动交付及可用性有优势，否则客户应选对手。免费模板不等于护城河。

## 2. PRD 和流程：现在 vs 下一阶段

| 环节 | 用户行为/页面 | 当前实际状态 | 后续需求和指标 |
|---|---|---|---|
| 灵感/创建 | 设置标题、时长、目标分、昵称 | 已实现固定模板规则配置，不是 AI | 中位创建耗时、创建完成率 |
| AI生成 | 描述玩法→受限结构化 DSL | 未实现 | 要求验证 JSON schema、版权与预算，执行失败可回退模板；记录成功率及成本 |
| 自动测试 | 检查规则可结束和控件可点击 | 当前只测试服务器流程 | 无解/无限对局拒绝发布；生成到通过测试的比例 |
| 试玩 | 单人点星拿分、胜利/倒计时 | 已实现单人模式（客户端） | 真机移动端测试及可访问性 |
| 邀请 | 建房获得一次性房间码/复制链接 | 配套 Node 服务器预览下实现；静态 Pages 无后端 | 到达→加入成功率；不采集个人信息前取得告知 |
| 多人对战 | 2–4 玩家抢同一个目标、服务器判分 | 单进程、内存房间、房主开始；无账号持久化；需服务器 | 跨区域 P95 延时、完赛率、异常率 |
| 分享/Remix | 分享房间链接 | 仅分享房间；未实现结果分享和公开 Remix | 分享点击率、每名组织者二次开局率；结果卡不曝光用户数据 |
| 再次创作 | 改标题、时间和目标 | 重新创建房间可改；现有房间不能热更新 | 7/28 天复办率、组织者复购 |

胜负：房主设目标 5/10/15、时长 15/30/60 秒。任意人先达到目标立即结束；时间到按最高分，平局共同领先；少于两人时不允许开始，中途掉到一人则提前结束。客户端提示并不替代服务器裁判。房间码 10 位随机十六进制，非身份凭证；加入后关闭/掉线即离开，当前无重连。

## 3. 技术选择与架构

评估：Phaser 适合浏览器 2D 和交互/资源管理；PixiJS 是渲染库，须补游戏逻辑；PlayCanvas 面向 Web 3D，MIT 引擎与其商业托管编辑器需分清；Godot Web 可移植但引擎/导出包、移动兼容要实测；Unity Web 构建及许可复杂、3D 强；Colyseus 提供权威房间及同步但需服务运维。来源：[Poki](https://developers.poki.com/guide/web-engine)、[PlayCanvas](https://playcanvas.com/products/engine)、[Colyseus](https://0-17.docs.colyseus.io/)。**当前最小原型**选 React DOM + Node `ws`：仅 9 格不需引入完整渲染引擎，少依赖易测试；不是性能评测证明最优。扩大到动作类后对比 Phaser，3D 看 PlayCanvas；多人规模化评估 Colyseus，而不是宣布已集成。

```text
[浏览器] -- HTTPS --> [静态资源/Next 导出]
    |                游戏配置表单（目前仅固定模板）
    | WSS /api/party
    v
[单进程 Node + ws 原型] --> 内存 rooms -> 权威状态/计时/目标/分数
                                  |
                                  +--> 广播同一状态到房间客户端
未来：登录 + 限流网关 -> API -> Postgres(项目/版本/同意) + Redis(房间/队列)
      AI 服务 -> DSL schema 验证 -> 执行器模拟与审核 -> 可发布版本
      事件采集 -> 聚合指标（默认最小采集，不采集提示内容或敏感数据）
```

当前代码 `src/components/party.tsx` / `src/app/party/page.tsx`，`server/party.mjs`，`tests/party.test.mjs`。9 格命中在服务器校验目标索引；静态单人本地计算。服务器控制分数、房主、时钟、胜负；消息上限、粗略每连接速率上限、人数与房间数上限、随机码、同源校验、断开清理。每连接限流不防分布式滥用；并发/房间 flood、名字冒充、恶意连点、host 同源/反向代理配置、掉线与部署重启丢房均未解决。禁止直接当生产服务。

### 协议（实际实现）

- `GET /api/health` → `{ok:true,multiplayer:'prototype'}`；静态 Pages 404 即提示无多人服务。
- `WS /api/party`：客户端 `create {name,spec:{title,targetScore,seconds}}`；`join {name,code}`；`start`；`tap {cell:0..8}`；`leave`。服务端 `joined {code,playerId}`、`state {room,serverNow}`、`error {message}`、`left`。仅房主开始，至少 2 人、最多 4 人。实际接口并非持久公开 API，可能更改。

### 未来 DSL（设计，不是已实现）

```json
{"version":1,"template":"star-race","title":"周五派对","players":{"min":2,"max":4},"durationSeconds":30,"win":{"kind":"firstToScoreOrTimeout","target":10},"board":{"cells":9}}
```

允许列表 + 类型/数值边界校验，版本签名、只读资产与确定性解释器；不执行模型代码。AI 仅转换用户文本为 JSON 并解释不支持的功能，人工确认后执行。测试 Agent 应在服务端运行可重复模拟：目标可达、计时结束、非法指令不影响分数、断线与平局；不能使用无证据的“自动修复成功率”。

### 数据库（未来，不是现有数据库）

`users(id, provider_id, created_at)`；`projects(id, owner_id, title, visibility, created_at)`；`project_versions(id, project_id, schema_version, validated_spec, asset_manifest, created_at)`；`rooms(id, project_version_id, status, created_at, expires_at)`；`sessions(id, room_id, pseudonym, joined_at, completed_at)`；`events(id, session_id, type, timestamp, version)`；`subscriptions(id, user_id, provider_ref, status)`。FK/index、访问控制、加密、定期删除、导出/删除 API。别在事件中存原始私人对话，数据留存与跨境按具体地区法律和政策审查。

### 部署与安全边界

- 当前 `npm run party` 在 0.0.0.0:3000 同源提供已构建的 `site/` 和 WebSocket；GitHub Pages 不运行服务器，所以公开静态页只能单人。临时预览中的多人不是永久托管。
- 持久上线需用户选择付费/可控 Node 主机、域名、TLS/WSS、反代升级 WebSocket、健康探测、容器重启、监控与预算告警；先配密钥与基础设施，不可假装已完成。生产须独立域名、严格 Origin allowlist、IP+账号限流、CSRF/登录、内容审核、未成年人保护、日志脱敏、异常检测、备份/回滚、负载与滥用测试。
- 没有 AI/语音/聊天/上传/外链内容，减少当前风险；加入任意内容前要有审核、申诉、版权与年龄策略。公网邀请链接不是机密；无需登录，不可用于敏感活动。
