import type { Locale } from "@/types/zhongjing";

export type LocaleKey = "zh-CN" | "zh-TW" | "en" | "ja";

export const BUSINESS = {
  /* ========================================================================
     PRICING — 基于市场调研：SaaS 订阅 45% 市场份额，企业合同 $50K-$5M+/年
     ======================================================================== */
  pricing: {
    "zh-CN": {
      eyebrow: "部署定价",
      title: "按医院规模与临床场景付费",
      subtitle:
        "无隐藏条款，无强制全院捆绑。从单科室试点到全院标准化，按实际使用规模增长。",
      plans: [
        {
          id: "pilot",
          name: "科室试点",
          nameEn: "Department Pilot",
          price: "¥8,000",
          unit: "/月·科室",
          desc:
            "适用于单一临床场景（药房、护理站或病案室）。2 小时交付，去标识化测试专线，验证工作流与安全边界后再扩容。",
          features: [
            "单一临床场景（药房/护理站/病案室）",
            "2 小时交付，去标识化测试专线",
            "SM4 加密，院内部署",
            "邮件支持，响应 ≤ 24 小时",
          ],
          cta: "申请试点",
          highlighted: false,
        },
        {
          id: "hospital",
          name: "全院部署",
          nameEn: "Full Hospital",
          price: "¥120,000",
          unit: "/年·科室",
          desc:
            "适用于二级及以上医院全院临床工作流。SM4 加密，纯内网断网支持，HIS 对接，院内 IT 运营。支持分批次推进，控制实施风险。",
          features: [
            "全院临床工作流覆盖",
            "SM4 加密，纯内网断网支持",
            "HIS 对接，院内 IT 运营",
            "专属客户经理，响应 ≤ 4 小时",
            "年度合规审计报告",
          ],
          cta: "获取方案",
          highlighted: true,
        },
        {
          id: "regional",
          name: "区域医疗中心",
          nameEn: "Regional Medical Center",
          price: "定制",
          unit: "按协议",
          desc:
            "适用于医联体与区域医疗中心。标准化交付与区域安全策略，支持大规模临床工作流与多院区审计。数据所有权始终归属医疗机构。",
          features: [
            "医联体/区域中心部署",
            "标准化交付，多院区审计",
            "区域安全策略与数据主权",
            "7×24 专属支持，响应 ≤ 1 小时",
            "定制 SLA 与合规里程碑",
          ],
          cta: "洽谈合作",
          highlighted: false,
        },
      ],
      faq: [
        {
          q: "试点阶段需要签全院合同吗？",
          a: "不需要。试点仅限一个临床场景，验证通过后再决定是否扩容。",
        },
        {
          q: "数据是否出院内网？",
          a: "否。100% 院内部署，SM4 加密，零公有云上传，数据所有权始终归属医疗机构。",
        },
        {
          q: "支持哪些临床场景？",
          a: "药房（肾功折算与配伍核验）、护理站（危急值处理与随访）、病案室（ICD-10 编码与 DRG）、医保办（DRG/DIP 付费模拟）。",
        },
      ],
    },
    "zh-TW": {
      eyebrow: "部署定價",
      title: "按醫院規模與臨床場景付費",
      subtitle:
        "無隱藏條款，無強制全院捆綁。從單個科室試點到全院標準化，按實際使用規模增長。",
      plans: [
        {
          id: "pilot",
          name: "科室試點",
          nameEn: "Department Pilot",
          price: "¥8,000",
          unit: "/月·科室",
          desc:
            "適用於單一臨床場景（藥房、護理站或病案室）。2 小時交付，去標識化測試專線，驗證工作流與安全邊界後再擴容。",
          features: [
            "單一臨床場景（藥房/護理站/病案室）",
            "2 小時交付，去標識化測試專線",
            "SM4 加密，院內部署",
            "電子郵件支持，響應 ≤ 24 小時",
          ],
          cta: "申請試點",
          highlighted: false,
        },
        {
          id: "hospital",
          name: "全院部署",
          nameEn: "Full Hospital",
          price: "¥120,000",
          unit: "/年·科室",
          desc:
            "適用於二級及以上醫院全院臨床工作流。SM4 加密，純內網斷網支持，HIS 對接，院內 IT 運營。支持分批次推進，控制實施風險。",
          features: [
            "全院臨床工作流覆蓋",
            "SM4 加密，純內網斷網支持",
            "HIS 對接，院內 IT 運營",
            "專屬客戶經理，響應 ≤ 4 小時",
            "年度合規審計報告",
          ],
          cta: "獲取方案",
          highlighted: true,
        },
        {
          id: "regional",
          name: "區域醫療中心",
          nameEn: "Regional Medical Center",
          price: "定制",
          unit: "按協議",
          desc:
            "適用於醫聯體與區域醫療中心。標準化交付與區域安全策略，支持大規模臨床工作流與多院區審計。數據所有權始終歸屬醫療機構。",
          features: [
            "醫聯體/區域中心部署",
            "標準化交付，多院區審計",
            "區域安全策略與數據主權",
            "7×24 專屬支持，響應 ≤ 1 小時",
            "定制 SLA 與合規里程碑",
          ],
          cta: "洽談合作",
          highlighted: false,
        },
      ],
      faq: [
        {
          q: "試點階段需要簽全院合同嗎？",
          a: "不需要。試點僅限一個臨床場景，驗證通過後再決定是否擴容。",
        },
        {
          q: "數據是否出院內網？",
          a: "否。100% 院內部署，SM4 加密，零公有雲上傳，數據所有權始終歸屬醫療機構。",
        },
        {
          q: "支持哪些臨床場景？",
          a: "藥房（腎功折算與配伍核驗）、護理站（危急值處理與隨訪）、病案室（ICD-10 編碼與 DRG）、醫療保險辦公室（DRG/DIP 付費模擬）。",
        },
      ],
    },
    en: {
      eyebrow: "Deployment Pricing",
      title: "Pay by Hospital Scale & Clinical Scenario",
      subtitle:
        "No hidden terms, no forced enterprise-wide bundling. From single-department pilot to full-hospital standardization, scale with actual usage.",
      plans: [
        {
          id: "pilot",
          name: "Department Pilot",
          nameEn: "Department Pilot",
          price: "$800",
          unit: "/month·dept",
          desc:
            "Single clinical scenario (pharmacy, nursing station, or medical records). 2-hour delivery, de-identified test line. Verify workflow and safety boundary before scaling.",
          features: [
            "Single clinical scenario (pharmacy / nursing station / medical records)",
            "2-hour delivery, de-identified test line",
            "SM4 encryption, on-premise deployment",
            "Email support, response ≤ 24 hours",
          ],
          cta: "Request Pilot",
          highlighted: false,
        },
        {
          id: "hospital",
          name: "Full Hospital",
          nameEn: "Full Hospital",
          price: "$12,000",
          unit: "/year·dept",
          desc:
            "Full-hospital clinical workflow for Tier-2+ hospitals. SM4 encryption, air-gapped intranet support, HIS integration, IT-owned operations. Phased rollout to control implementation risk.",
          features: [
            "Full-hospital clinical workflow coverage",
            "SM4 encryption, air-gapped intranet support",
            "HIS integration, IT-owned operations",
            "Dedicated customer success, response ≤ 4 hours",
            "Annual compliance audit report",
          ],
          cta: "Get Proposal",
          highlighted: true,
        },
        {
          id: "regional",
          name: "Regional Medical Center",
          nameEn: "Regional Medical Center",
          price: "Custom",
          unit: "per agreement",
          desc:
            "For medical consortiums and regional medical centers. Standardized delivery and regional security policy, supporting large-scale clinical workflows and multi-site audits. Data ownership remains with the medical institution.",
          features: [
            "Consortium / regional center deployment",
            "Standardized delivery, multi-site audits",
            "Regional security policy and data sovereignty",
            "7×24 dedicated support, response ≤ 1 hour",
            "Custom SLA and compliance milestones",
          ],
          cta: "Talk to Sales",
          highlighted: false,
        },
      ],
      faq: [
        {
          q: "Do I need an enterprise-wide contract for the pilot?",
          a: "No. The pilot is limited to a single clinical scenario. Expand only after verification.",
        },
        {
          q: "Does data leave the hospital intranet?",
          a: "No. 100% on-premise deployment, SM4 encryption, zero public-cloud upload. Data ownership remains with the medical institution.",
        },
        {
          q: "Which clinical scenarios are supported?",
          a: "Pharmacy (renal dosing & DDI verification), nursing station (critical value & follow-up), medical records (ICD-10 coding & DRG), insurance office (DRG/DIP simulation).",
        },
      ],
    },
    ja: {
      eyebrow: "導入料金",
      title: "病院規模と臨床シナリオに応じた課金",
      subtitle:
        "隠れた条件はありません。単一科室パイロットから病院全体標準化まで、実際の使用規模に応じて拡張します。",
      plans: [
        {
          id: "pilot",
          name: "科室パイロット",
          nameEn: "Department Pilot",
          price: "¥120,000",
          unit: "/月·科室",
          desc:
            "単一臨床シナリオ（調剤室、看護ステーション、医事課）。2 時間納品、非識別化テスト回線。ワークフローと安全境界を検証してから拡張します。",
          features: [
            "単一臨床シナリオ（調剤室／看護ステーション／医事課）",
            "2 時間納品、非識別化テスト回線",
            "SM4 暗号化、院内導入",
            "メールサポート、返答 ≤ 24 時間",
          ],
          cta: "パイロットを申請",
          highlighted: false,
        },
        {
          id: "hospital",
          name: "病院全体導入",
          nameEn: "Full Hospital",
          price: "¥1,800,000",
          unit: "/年·科室",
          desc:
            "二次救急病院以上の病院全体臨床ワークフロー。SM4 暗号化、院内閉域ネットワーク対応、HIS 連携、院内 IT 運営。段階的な展開で導入リスクを制御します。",
          features: [
            "病院全体臨床ワークフロー対応",
            "SM4 暗号化、院内閉域ネットワーク対応",
            "HIS 連携、院内 IT 運営",
            "専任カスタマーサクセス、返答 ≤ 4 時間",
            "年度コンプライアンス監査レポート",
          ],
          cta: "提案を依頼",
          highlighted: true,
        },
        {
          id: "regional",
          name: "地域医療センター",
          nameEn: "Regional Medical Center",
          price: "カスタム",
          unit: "契約に応じ",
          desc:
            "医療連携体と地域医療センター向け。標準化納品と地域セキュリティポリシー、大規模臨床ワークフローと複数拠点監査をサポート。データ所有権は常に医療機関に帰属します。",
          features: [
            "医療連携体／地域センター導入",
            "標準化納品、複数拠点監査",
            "地域セキュリティポリシーとデータ主権",
            "7×24 専任サポート、返答 ≤ 1 時間",
            "カスタム SLA とコンプライアンスマイルストーン",
          ],
          cta: "営業と相談",
          highlighted: false,
        },
      ],
      faq: [
        {
          q: "パイロット段階で病院全体契約が必要ですか？",
          a: "いいえ。パイロットは単一臨床シナリオに限定されます。検証後、拡張を検討します。",
        },
        {
          q: "データは院外に持ち出されますか？",
          a: "いいえ。100% 院内導入、SM4 暗号化、パブリッククラウドアップロードはゼロ。データ所有権は常に医療機関に帰属します。",
        },
        {
          q: "どのような臨床シナリオをサポートしていますか？",
          a: "調剤室（腎機能減量・多薬相互作用チェック）、看護ステーション（クリティカル値対応・フォローアップ）、医事課（ICD-10 コーディング・DRG ウェイト）、保険事務（DRG/DIP 支払いシミュレーション）。",
        },
      ],
    },
  },

  /* ========================================================================
     INVESTORS — 市场规模 $28.6B by 2034，CAGR 27%，14.1x ARR 估值倍数
     ======================================================================== */
  investors: {
    "zh-CN": {
      eyebrow: "投资者关系",
      title: "医疗 AI 操作系统，万亿级市场入口",
      subtitle:
        "全球 AI 医疗工作流市场 2025 年 $32.8 亿，预计 2035 年突破 $109 亿。有签约企业合同的医疗 AI 公司估值达 14.1x Forward ARR。",
      metrics: [
        { label: "市场规模 (2025)", value: "$32.8B", sub: "全球医疗 SaaS" },
        { label: "市场规模 (2035 预测)", value: "$109B", sub: "CAGR 12.8%" },
        { label: "AI 工作流 SaaS 市场 (2034)", value: "$28.6B", sub: "CAGR 27.0%" },
        { label: "企业合同估值倍数", value: "14.1x", sub: "Forward ARR" },
      ],
      thesis: [
        {
          title: "数据护城河",
          desc:
            "院内部署 + SM4 加密 + 5 年审计痕迹，构建不可复制的临床数据壁垒。",
        },
        {
          title: "监管壁垒",
          desc:
            "等保三级、NMPA 医疗器械注册、数据安全法合规，准入门槛高，替换成本高。",
        },
        {
          title: "高粘性收入",
          desc:
            "嵌入医院工作流后更换成本极高，SaaS 订阅毛利 70-85%，收入高度可预测。",
        },
        {
          title: "多维变现",
          desc:
            "SaaS 订阅 + 结果导向定价 + 数据变现（匿名化临床数据授权给制药与研究机构）。",
        },
      ],
      contact: "investors@zhongjing.internal",
    },
    "zh-TW": {
      eyebrow: "投資者關係",
      title: "醫療 AI 操作系統，萬億級市場入口",
      subtitle:
        "全球 AI 醫療工作流市場 2025 年 $32.8 億，預計 2035 年突破 $109 億。有簽約企業合約的醫療 AI 公司估值達 14.1x Forward ARR。",
      metrics: [
        { label: "市場規模 (2025)", value: "$32.8B", sub: "全球醫療 SaaS" },
        { label: "市場規模 (2035 預測)", value: "$109B", sub: "CAGR 12.8%" },
        { label: "AI 工作流 SaaS 市場 (2034)", value: "$28.6B", sub: "CAGR 27.0%" },
        { label: "企業合約估值倍數", value: "14.1x", sub: "Forward ARR" },
      ],
      thesis: [
        {
          title: "數據護城河",
          desc:
            "院內部署 + SM4 加密 + 5 年審計痕跡，構建不可複製的臨床數據壁壘。",
        },
        {
          title: "監管壁壘",
          desc:
            "等保三級、NMPA 醫療器械登錄、數據安全法合規，準入門檻高，替換成本高。",
        },
        {
          title: "高黏性收入",
          desc:
            "嵌入醫院工作流後更換成本極高，SaaS 訂閱毛利 70-85%，收入高度可預測。",
        },
        {
          title: "多維變現",
          desc:
            "SaaS 訂閱 + 結果導向定價 + 數據變現（匿名化臨床數據授權給製藥與研究機構）。",
        },
      ],
      contact: "investors@zhongjing.internal",
    },
    en: {
      eyebrow: "Investor Relations",
      title: "Medical AI Operating System — Trillion-Dollar Market Entry",
      subtitle:
        "Global AI healthcare workflow market $32.8B in 2025, projected to exceed $109B by 2035. Healthcare AI companies with signed enterprise contracts command 14.1x Forward ARR.",
      metrics: [
        { label: "Market Size (2025)", value: "$32.8B", sub: "Global Healthcare SaaS" },
        { label: "Market Size (2035 Forecast)", value: "$109B", sub: "CAGR 12.8%" },
        { label: "AI Workflow SaaS (2034)", value: "$28.6B", sub: "CAGR 27.0%" },
        { label: "Enterprise Contract Multiple", value: "14.1x", sub: "Forward ARR" },
      ],
      thesis: [
        {
          title: "Data Moat",
          desc:
            "On-premise deployment + SM4 encryption + 5-year audit trail builds an irreproducible clinical data barrier.",
        },
        {
          title: "Regulatory Moat",
          desc:
            "Level 3 protection, NMPA device registration, Data Security Law compliance — high entry barrier, high switching cost.",
        },
        {
          title: "Sticky Revenue",
          desc:
            "Embedded in hospital workflows makes replacement cost extremely high. SaaS subscription gross margin 70-85%, highly predictable revenue.",
        },
        {
          title: "Multi-dimensional Monetization",
          desc:
            "SaaS subscription + outcome-based pricing + data monetization (anonymized clinical data licensing to pharma and research institutions).",
        },
      ],
      contact: "investors@zhongjing.internal",
    },
    ja: {
      eyebrow: "投資家向け情報",
      title: "医療 AI オペレーティングシステム — 兆円級市場への参入",
      subtitle:
        "グローバル AI 医療ワークフロー市場は 2025 年 $32.8 億、2035 年には $109 億を超える見込み。企業契約を持つ医療 AI 企業は 14.1x Forward ARR で評価。",
      metrics: [
        { label: "市場規模 (2025)", value: "$32.8B", sub: "グローバル医療 SaaS" },
        { label: "市場規模 (2035 予測)", value: "$109B", sub: "CAGR 12.8%" },
        { label: "AI ワークフロー SaaS (2034)", value: "$28.6B", sub: "CAGR 27.0%" },
        { label: "企業契約評価倍数", value: "14.1x", sub: "Forward ARR" },
      ],
      thesis: [
        {
          title: "データ護城河",
          desc:
            "院内導入 + SM4 暗号化 + 5 年監査証跡により、再現不可能な臨床データ壁垒を構築。",
        },
        {
          title: "規制壁垒",
          desc:
            "レベル 3 保護、NMPA 医療機器登録、データセキュリティ法準拠。参入障壁が高く、切り替えコストが高い。",
        },
        {
          title: "高粘着収益",
          desc:
            "病院ワークフローに組み込まれると切り替えコストが極めて高い。SaaS サブスクリプション粗利 70-85%、収益は高度に予測可能。",
        },
        {
          title: "多面収益化",
          desc:
            "SaaS サブスクリプション + 成果連動課金 + データ収益化（匿名化臨床データを製薬・研究機関にライセンス）。",
        },
      ],
      contact: "investors@zhongjing.internal",
    },
  },

  /* ========================================================================
     PARTNERS — 合作临床中心
     ======================================================================== */
  partners: {
    "zh-CN": {
      eyebrow: "合作临床中心",
      title: "多省区三甲医院与专科中心已完成科室试点",
      subtitle:
        "系统设计以医院最高级别的安全与合规要求为准。已在多家三级医院科室完成试点部署，零严重不良事件记录。",
      institutions: [
        { name: "某三甲医院心内科", sector: "心血管内科", locale: "zh-CN" },
        { name: "某三甲医院肾内科", sector: "肾脏内科", locale: "zh-CN" },
        { name: "某三甲医院病案室", sector: "病案信息", locale: "zh-CN" },
        { name: "某省级人民医院药剂科", sector: "药学", locale: "zh-CN" },
        { name: "某三甲医院护理站", sector: "护理", locale: "zh-CN" },
        { name: "某医保局合作医院", sector: "医保管理", locale: "zh-CN" },
      ],
    },
    "zh-TW": {
      eyebrow: "合作臨床中心",
      title: "多省區三級醫院與專科中心已完成科室試點",
      subtitle:
        "系統設計以醫院最高級別的安全與合規要求為準。已在多家三級醫院科室完成試點部署，零嚴重不良事件記録。",
      institutions: [
        { name: "某三甲醫院心內科", sector: "心血管內科", locale: "zh-TW" },
        { name: "某三甲醫院腎內科", sector: "腎臟內科", locale: "zh-TW" },
        { name: "某三甲醫院病案室", sector: "病案資訊", locale: "zh-TW" },
        { name: "某省級人民醫院藥劑科", sector: "藥學", locale: "zh-TW" },
        { name: "某三甲醫院護理站", sector: "護理", locale: "zh-TW" },
        { name: "某醫療保險局合作醫院", sector: "醫保管理", locale: "zh-TW" },
      ],
    },
    en: {
      eyebrow: "Partner Clinical Centers",
      title: "Multi-Region Tier-3 & Specialty Centers — Department Pilots Completed",
      subtitle:
        "System design follows the highest hospital-level security and compliance requirements. Piloted across multiple Tier-3 hospital departments. Zero severe adverse event record.",
      institutions: [
        { name: "Tier-3 Hospital Cardiology", sector: "Cardiology", locale: "en" },
        { name: "Tier-3 Hospital Nephrology", sector: "Nephrology", locale: "en" },
        { name: "Tier-3 Hospital Medical Records", sector: "Medical Records", locale: "en" },
        { name: "Provincial People's Hospital Pharmacy", sector: "Pharmacy", locale: "en" },
        { name: "Tier-3 Hospital Nursing Station", sector: "Nursing", locale: "en" },
        { name: "Medical Insurance Bureau Partner Hospital", sector: "Insurance Management", locale: "en" },
      ],
    },
    ja: {
      eyebrow: "協力臨床センター",
      title: "複数の三次救急病院と専科センターで科室パイロット完了",
      subtitle:
        "システム設計は病院レベルの最高セキュリティとコンプライアンス要件に従う。複数の三次救急病院の診療科でパイロット導入を完了。重篤な有害事象記録ゼロ。",
      institutions: [
        { name: "三次救急病院 循環器内科", sector: "循環器内科", locale: "ja" },
        { name: "三次救急病院 腎臓内科", sector: "腎臓内科", locale: "ja" },
        { name: "三次救急病院 医事課", sector: "医事課", locale: "ja" },
        { name: "県立病院 薬剤科", sector: "薬剤科", locale: "ja" },
        { name: "三次救急病院 看護ステーション", sector: "看護", locale: "ja" },
        { name: "医療保険局 連携病院", sector: "医療保険管理", locale: "ja" },
      ],
    },
  },

  /* ========================================================================
     CAREERS — 招贤纳士
     ======================================================================== */
  careers: {
    "zh-CN": {
      eyebrow: "加入我们",
      title: "构建医疗 AI 操作系统，守护十亿患者院外安全",
      subtitle:
        "我们不拼资历，拼的是在临床一线解决过真问题的人。临床、技术、合规三条线，共同定义医疗 AI 的下十年。",
      roles: [
        {
          title: "临床产品经理",
          location: "北京 / 上海",
          type: "全职",
          desc: "主导临床工作流与 AI 产品的落地，深谙医院信息化与 DRG/DIP 支付逻辑。",
        },
        {
          title: "AI 工程师 (LLM / 语音)",
          location: "北京 / 远程",
          type: "全职",
          desc: "负责医疗语音交互与确定性引擎研发，熟悉 FHIR R4 与 32 路否决栅栏算法。",
        },
        {
          title: "信息安全工程师",
          location: "上海",
          type: "全职",
          desc: "负责 SM4 国密加密、等保三级合规与纯内网断网架构设计。",
        },
        {
          title: "实施顾问",
          location: "全国出差",
          type: "全职",
          desc: "负责医院科室试点交付、HIS 对接与全院标准化部署。",
        },
      ],
      contact: "careers@zhongjing.internal",
    },
    "zh-TW": {
      eyebrow: "加入我們",
      title: "構建醫療 AI 操作系統，守護十億患者院外安全",
      subtitle:
        "我們不拼資歷，拼的是在臨床一線解決過真問題的人。臨床、技術、合規三條線，共同定義醫療 AI 的下十年。",
      roles: [
        {
          title: "臨床產品經理",
          location: "北京 / 上海",
          type: "全職",
          desc: "主導臨床工作流與 AI 產品的落地，深諳醫院資訊化與 DRG/DIP 付費邏輯。",
        },
        {
          title: "AI 工程師 (LLM / 語音)",
          location: "北京 / 遠程",
          type: "全職",
          desc: "負責醫療語音交互與確定性引擎研發，熟悉 FHIR R4 與 32 路否決柵欄演算法。",
        },
        {
          title: "資訊安全工程師",
          location: "上海",
          type: "全職",
          desc: "負責 SM4 國密加密、等保三級合規與純內網斷網架構設計。",
        },
        {
          title: "實施顧問",
          location: "全國出差",
          type: "全職",
          desc: "負責醫院科室試點交付、HIS 對接與全院標準化部署。",
        },
      ],
      contact: "careers@zhongjing.internal",
    },
    en: {
      eyebrow: "Join Us",
      title: "Build the Medical AI Operating System, Protect a Billion Patients Beyond the Hospital",
      subtitle:
        "We don't compete on resumes. We compete on who has solved real problems on the clinical frontline. Clinical, technical, compliance — three lines defining the next decade of medical AI.",
      roles: [
        {
          title: "Clinical Product Manager",
          location: "Beijing / Shanghai",
          type: "Full-time",
          desc: "Lead clinical workflow and AI product deployment, deep expertise in hospital informatics and DRG/DIP payment logic.",
        },
        {
          title: "AI Engineer (LLM / Voice)",
          location: "Beijing / Remote",
          type: "Full-time",
          desc: "Responsible for medical voice interaction and deterministic engine development, familiar with FHIR R4 and 32-gate veto algorithm.",
        },
        {
          title: "Information Security Engineer",
          location: "Shanghai",
          type: "Full-time",
          desc: "Responsible for SM4 national-secret encryption, Level 3 protection compliance, and air-gapped intranet architecture design.",
        },
        {
          title: "Implementation Consultant",
          location: "Nationwide travel",
          type: "Full-time",
          desc: "Responsible for department pilot delivery, HIS integration, and full-hospital standardized deployment.",
        },
      ],
      contact: "careers@zhongjing.internal",
    },
    ja: {
      eyebrow: "採用情報",
      title: "医療 AI オペレーティングシステムを構築し、10 億人の患者の院外安全を守る",
      subtitle:
        "履歴ではなく、臨床現場で真の課題を解決してきたか。臨床、技術、コンプライアンスの 3 ラインで、医療 AI の次の 10 年を定義する。",
      roles: [
        {
          title: "臨床プロダクトマネージャー",
          location: "北京 / 上海",
          type: "フルタイム",
          desc: "臨床ワークフローと AI プロダクトの導入を主導。病院情報化と DRG/DIP 支払いロジックに精通。",
        },
        {
          title: "AI エンジニア (LLM / 音声)",
          location: "北京 / リモート",
          type: "フルタイム",
          desc: "医療音声インタラクションと決定論的エンジン開発を担当。FHIR R4 と 32 ゲート否決アルゴリズムに精通。",
        },
        {
          title: "情報セキュリティエンジニア",
          location: "上海",
          type: "フルタイム",
          desc: "SM4 国産暗号、レベル 3 保護準拠、院内閉域ネットワークアーキテクチャ設計を担当。",
        },
        {
          title: "導入コンサルタント",
          location: "全国出張",
          type: "フルタイム",
          desc: "科室パイロット導入、HIS 連携、病院全体標準化導入を担当。",
        },
      ],
      contact: "careers@zhongjing.internal",
    },
  },
} as const;

export function getLocaleKey(locale: string | undefined): LocaleKey {
  if (locale === "zh-TW") return "zh-TW";
  if (locale === "en") return "en";
  if (locale === "ja") return "ja";
  return "zh-CN";
}
