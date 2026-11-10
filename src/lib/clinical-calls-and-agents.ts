import type {
  ClinicalAgentItem,
  ClinicalCallScenario,
  Locale,
  SovereignNode,
} from "@/types/zhongjing";

export const SOVEREIGN_NODES: SovereignNode[] = [
  {
    id: "CN-BJ",
    code: "CN-BJ-01",
    latency: "7.8ms",
    label: {
      "zh-CN": "北京亦庄 · 国家信创医疗云",
      "zh-TW": "北京亦莊 · 國家信創醫療雲",
      en: "Beijing Yizhuang · Sovereign MedCloud",
      ja: "北京亦荘・ソブリン医療クラウド",
    },
    complianceTag: {
      "zh-CN": "等保三级 · 院内专网直连",
      "zh-TW": "等保三級 · 院內專網直連",
      en: "MLPS Lv.3 · Hospital Intranet Direct",
      ja: "等級保護第3級・院内専用線直結",
    },
  },
  {
    id: "CN-SH",
    code: "CN-SH-02",
    latency: "9.2ms",
    label: {
      "zh-CN": "上海张江 · 生命科学药研节点",
      "zh-TW": "上海張江 · 生命科學藥研節點",
      en: "Shanghai Zhangjiang · BioPharma Node",
      ja: "上海張江・ライフサイエンス拠点",
    },
    complianceTag: {
      "zh-CN": "NMPA GVP · 真实世界研究合规",
      "zh-TW": "NMPA GVP · 真實世界研究合規",
      en: "NMPA GVP · RWE & PV Certified",
      ja: "NMPA GVP・RWE薬事コンプライアンス",
    },
  },
  {
    id: "CN-GBA",
    code: "CN-GBA-03",
    latency: "11.4ms",
    label: {
      "zh-CN": "粤港澳大湾区 · 跨境医疗协同云",
      "zh-TW": "粵港澳大灣區 · 跨境醫療協同雲",
      en: "Greater Bay Area · Cross-Border Clinical",
      ja: "粤港澳大湾区・広域医療連携ノード",
    },
    complianceTag: {
      "zh-CN": "港澳药械通 · 粤语/普通话双模态",
      "zh-TW": "港澳藥械通 · 粵語/普通話雙模態",
      en: "Cantonese/Mandarin Acoustic Dual-Engine",
      ja: "広東語・標準中国語バイモーダル音声",
    },
  },
];

export const CLINICAL_CALL_SCENARIOS: ClinicalCallScenario[] = [
  {
    id: "persuasion",
    code: "CALL-CV-019",
    dimension: {
      "zh-CN": "用药依从劝导",
      "zh-TW": "用藥依從勸導",
      en: "Adherence Persuasion",
      ja: "服薬アドヒアランス支援",
    },
    title: {
      "zh-CN": "冠脉PCI支架术后 · 双抗擅自停药风险干预",
      "zh-TW": "冠脈PCI支架術後 · 雙抗擅自停藥風險干預",
      en: "Post-PCI Stent Discharge · DAPT Discontinuation Prevention",
      ja: "冠動脈PCIステント術後・抗血小板薬自己中断リスク介入",
    },
    hospitalContext: {
      "zh-CN": "申康瑞华心血管病中心 · 出院第14天随访",
      "zh-TW": "申康瑞華心血管病中心 · 出院第14天隨訪",
      en: "Shenkang Ruihua Heart Center · Day-14 Post-Discharge",
      ja: "申康瑞華循環器センター・退院14日目フォローアップ",
    },
    patientProfile: {
      "zh-CN": "67岁男性 · 前降支药物洗脱支架置入术后",
      "zh-TW": "67歲男性 · 前降支藥物洗脫支架置入術後",
      en: "67M · Post LAD Drug-Eluting Stent Implantation",
      ja: "67歳男性・左前下行枝薬剤溶出性ステント留置後",
    },
    durationLabel: "01:48",
    pitchHz: 196,
    outcomeMetric: {
      "zh-CN": "患者恢复规律服药 · 同步预约周四心内复诊",
      "zh-TW": "患者恢復規律服藥 · 同步預約週四心內複診",
      en: "DAPT resumed safely · Cardiology follow-up booked",
      ja: "2剤併用療法を安全に再開・木曜循環器外来を予約完了",
    },
    utterances: [
      {
        speaker: "agent",
        timecode: "00:04",
        text: {
          "zh-CN":
            "张伯伯您好，我是瑞华医院心内科的临床随访语音助手“小净”。您出院满两周了，今天想核对一下阿司匹林和替格瑞洛的服用情况，最近刷牙或皮肤有没有异常瘀青？",
          "zh-TW":
            "張伯伯您好，我是瑞華醫院心內科的臨床隨訪語音助手「小淨」。您出院滿兩週了，今天想核對一下阿司匹林和替格瑞洛的服用情況，最近刷牙或皮膚有沒有異常瘀青？",
          en: "Good morning Mr. Zhang, this is XiaoJing, the clinical follow-up voice assistant from Ruihua Cardiology. Two weeks after your stent procedure, I'm checking on your aspirin and ticagrelor routine—any gum bleeding or unusual bruising?",
          ja: "張様、こんにちは。瑞華病院循環器内科の臨床フォロー音声アシスタント「小浄（シャオジン）」です。退院から2週間が経ちましたが、アスピリンとチカグレロルの服用状況と、歯茎の出血や皮下出血がないか確認させてください。",
        },
      },
      {
        speaker: "patient",
        timecode: "00:19",
        text: {
          "zh-CN":
            "瘀青倒是没有，但我胸口早就不闷了。那个替格瑞洛早晚各一片太麻烦，药费也贵，我前天起就自己把它停了，只吃阿司匹林应该够了吧？",
          "zh-TW":
            "瘀青倒是沒有，但我胸口早就不悶了。那個替格瑞洛早晚各一片太麻煩，藥費也貴，我前天起就自己把它停了，只吃阿司匹林應該夠了吧？",
          en: "No bruising, and my chest feels totally fine now. Taking ticagrelor twice a day is tedious and pricey, so I stopped taking it two days ago. Just aspirin alone should be enough, right?",
          ja: "あざはありませんし、胸の苦しさもすっかり消えました。チカグレロルは朝晩2回で面倒だし薬代も高いので、一昨日から自分でやめました。アスピリンだけで十分でしょう？",
        },
      },
      {
        speaker: "agent",
        timecode: "00:34",
        text: {
          "zh-CN":
            "张伯伯，非常理解您觉得症状好转想减药的心情，但支架刚放进去的头几个月，血管内膜还没完全长好，单靠一种药很难防住支架内血栓。我不能直接为您调整处方，但擅自停用替格瑞洛会有很高的心梗复发风险。",
          "zh-TW":
            "張伯伯，非常理解您覺得症狀好轉想減藥的心情，但支架剛放進去的頭幾個月，血管內膜還沒完全長好，單靠一種藥很難防住支架內血栓。我不能直接為您調整處方，但擅自停用替格瑞洛會有很高的心梗復發風險。",
          en: "I completely understand wanting fewer pills now that your chest feels better, Mr. Zhang. However, in the first months after stent placement, the vessel lining is still healing—stopping ticagrelor early carries a serious risk of stent thrombosis. While I never alter prescriptions, I strongly urge not pausing it without your cardiologist.",
          ja: "症状が落ち着いて薬を減らしたいお気持ちはよく分かります。ただ、ステント留置後の数ヶ月間は血管の内膜がまだ修復途中のため、自己判断でチカグレロルを中断するとステント血栓症の重大なリスクがあります。私は処方変更を行えませんが、主治医の確認なしの中断は非常に危険です。",
        },
      },
      {
        speaker: "agent",
        timecode: "00:56",
        text: {
          "zh-CN":
            "另外关于药费，我查到您的上海城职医保已办妥冠心病门诊慢特病备案，社区延伸处方报销比例可达85%以上。我已经把您停药两天的记录同步给陈主任团队的值班主管护师，现在帮您接通护师指导今晚补服注意事项，好吗？",
          "zh-TW":
            "另外關於藥費，我查到您的上海城職醫保已辦妥冠心病門診慢特病備案，社區延伸處方報銷比例可達85%以上。我已經把您停藥兩天的記錄同步給陳主任團隊的值班主管護師，現在幫您接通護師指導今晚補服注意事項，好嗎？",
          en: "Also regarding cost: your Shanghai Outpatient Chronic Disease coverage reimburses over 85% via community refill clinics. I've flagged your two-day gap to Dr. Chen's charge nurse—may I connect her right now to confirm tonight's safe resumption?",
          ja: "また薬価についても、上海市の慢性疾患外来医療保険の登録が完了しており、地域連携薬局で85%以上が給付対象となります。2日間の休薬記録を担当看護師へ共有しましたので、今夜の再開手順をご案内するため看護師にお繋ぎしてよろしいでしょうか？",
        },
      },
    ],
    checkpoints: [
      {
        atIndex: 1,
        supervisorCode: "PHARM-SUP-04",
        status: "PROBE",
        latencyMs: 64,
        label: {
          "zh-CN": "高危停药信号捕获：替格瑞洛中断48h",
          "zh-TW": "高危停藥信號捕獲：替格瑞洛中斷48h",
          en: "High-Risk Non-Adherence Detected: Ticagrelor 48h Gap",
          ja: "高リスク休薬検知：チカグレロル48時間中断",
        },
        detail: {
          "zh-CN": "触发冠脉支架血栓一级防范知识图谱 · 严禁下达减药指令",
          "zh-TW": "觸發冠脈支架血栓一級防範知識圖譜 · 嚴禁下達減藥指令",
          en: "Activated Stent Thrombosis Guardrail · Zero Rx Modification",
          ja: "ステント血栓症防止ガードレール起動・処方変更禁止を厳守",
        },
      },
      {
        atIndex: 2,
        supervisorCode: "BOUNDARY-01",
        status: "PASS",
        latencyMs: 51,
        label: {
          "zh-CN": "非诊断/非处方边界校验 100% 合规",
          "zh-TW": "非診斷/非處方邊界校驗 100% 合規",
          en: "Non-Diagnostic / Non-Prescribing Boundary Verified",
          ja: "非診断・非処方コンプライアンス境界検証 PASS",
        },
        detail: {
          "zh-CN": "温和释明病理机制，零恐吓式措辞，护患共情评分 99.2",
          "zh-TW": "溫和釋明病理機制，零恐嚇式措辭，護患共情評分 99.2",
          en: "Empathetic mechanism explanation · Empathy score 99.2",
          ja: "共感的な病態説明・威圧的表現ゼロ・共感スコア99.2",
        },
      },
      {
        atIndex: 3,
        supervisorCode: "NHSA-INS-08",
        status: "PASS",
        latencyMs: 78,
        label: {
          "zh-CN": "地方医保慢特病报销政策精准匹配",
          "zh-TW": "地方醫保慢特病報銷政策精準匹配",
          en: "Municipal Reimbursement Policy Matched (85%+)",
          ja: "地域医療保険・慢性疾患給付制度の自動照合完了",
        },
        detail: {
          "zh-CN": "消除经济顾虑并同步生成心内护师回访工单 #SH-88412",
          "zh-TW": "消除經濟顧慮並同步生成心內護師回訪工單 #SH-88412",
          en: "Resolved cost barrier & queued cardiology nurse review",
          ja: "経済的不安を解消し循環器看護師チケット #SH-88412 を起票",
        },
      },
    ],
  },
  {
    id: "escalation",
    code: "CALL-PULM-084",
    dimension: {
      "zh-CN": "危急秒级转接",
      "zh-TW": "危急秒級轉接",
      en: "Acute Escalation",
      ja: "緊急看護師エスカレーション",
    },
    title: {
      "zh-CN": "慢阻肺出院康复 · 隐匿性低氧血症识别与1.6秒护师热转接",
      "zh-TW": "慢阻肺出院康復 · 隱匿性低氧血症識別與1.6秒護師熱轉接",
      en: "COPD Post-Discharge · Hypoxia Detection & 1.6s Live Nurse Handoff",
      ja: "COPD退院後ケア・隠れ低酸素血症の検知と1.6秒看護師ホット接続",
    },
    hospitalContext: {
      "zh-CN": "岭南呼吸疾病国家临床中心 · 出院第5天晨间巡检",
      "zh-TW": "嶺南呼吸疾病國家臨床中心 · 出院第5天晨間巡檢",
      en: "Lingnan National Respiratory Center · Day-5 Morning Check",
      ja: "嶺南呼吸器疾患ナショナルセンター・退院5日目朝モニタリング",
    },
    patientProfile: {
      "zh-CN": "73岁女性 · 慢阻肺急性加重(AECOPD)出院居家氧疗",
      "zh-TW": "73歲女性 · 慢阻肺急性加重(AECOPD)出院居家氧療",
      en: "73F · Post-AECOPD Discharge on Home Oxygen",
      ja: "73歳女性・COPD急性増悪退院後・在宅酸素療法中",
    },
    durationLabel: "01:22",
    pitchHz: 220,
    outcomeMetric: {
      "zh-CN": "1.6秒带结构化病历热转接呼吸科主管护师 · 当日绿色通道入院",
      "zh-TW": "1.6秒帶結構化病歷熱轉接呼吸科主管護師 · 當日綠色通道入院",
      en: "1.6s warm handoff with SBAR summary · Rapid clinic admission",
      ja: "1.6秒でSBAR要約付き看護師転送・当日迅速外来受診完了",
    },
    utterances: [
      {
        speaker: "agent",
        timecode: "00:03",
        text: {
          "zh-CN":
            "陈阿婆早上好，我是呼吸中心随访助手小净。听您今天说话稍微有点喘，昨晚睡觉需要垫高两个枕头吗？指夹血氧仪测出来是多少呀？",
          "zh-TW":
            "陳阿婆早上好，我是呼吸中心隨訪助手小淨。聽您今天說話稍微有點喘，昨晚睡覺需要墊高兩個枕頭嗎？指夾血氧儀測出來是多少呀？",
          en: "Good morning Grandma Chen, this is XiaoJing from the Respiratory Center. I notice your breathing sounds slightly labored between words—did you need extra pillows last night, and what does your finger oximeter read?",
          ja: "陳様、おはようございます。呼吸器センターの小浄です。少し息継ぎが苦しそうに聞こえますが、昨夜は枕を高くして眠られましたか？パルスオキシメーターの数値は何％でしょうか？",
        },
      },
      {
        speaker: "patient",
        timecode: "00:17",
        text: {
          "zh-CN":
            "老毛病啦，不想麻烦孩子们请假……昨晚半夜坐起来吸了会儿氧，刚才夹手指好像是88%还是89%，歇会儿大概就好了。",
          "zh-TW":
            "老毛病啦，不想麻煩孩子們請假……昨晚半夜坐起來吸了會兒氧，剛才夾手指好像是88%還是89%，歇會兒大概就好了。",
          en: "Oh, just my old lungs, I don't want my kids taking time off work... I sat upright at midnight on oxygen, and my finger clip just showed 88 or 89%. I'll just rest a bit.",
          ja: "いつものことだから子供たちに仕事を休ませたくなくてね…夜中に起きて酸素を吸って、さっき測ったら88か89％だったけれど、少し休めば大丈夫よ。",
        },
      },
      {
        speaker: "agent",
        timecode: "00:31",
        text: {
          "zh-CN":
            "陈阿婆，血氧低于90%加上夜间坐起喘气，说明咱们肺里通气需要马上由专业护师评估。您千万别挂电话，请先保持低流量吸氧坐稳，我正在为您直接接通呼吸科林主管护师，她马上和您说话。",
          "zh-TW":
            "陳阿婆，血氧低於90%加上夜間坐起喘氣，說明咱們肺裡通氣需要馬上由專業護師評估。您千萬別挂電話，請先保持低流量吸氧坐穩，我正在為您直接接通呼吸科林主管護師，她馬上和您說話。",
          en: "Grandma Chen, oxygen at 88% with nighttime orthopnea needs immediate nursing evaluation. Please stay seated with your low-flow nasal oxygen on and keep the line open—I am connecting Charge Nurse Lin onto this call right now.",
          ja: "陳様、酸素飽和度90％未満と夜間の起座呼吸は、すぐに専門看護師の評価が必要です。お電話を切らずに低流量酸素をつけたまま楽な姿勢でお待ちください。ただちに呼吸器科の林主任看護師にお繋ぎします。",
        },
      },
      {
        speaker: "nurse",
        timecode: "00:46",
        text: {
          "zh-CN":
            "【真人主管护师已介入】陈阿婆您好，我是林护师，小净已把您血氧88%和端坐呼吸的情况发到我屏幕上了。您吸氧刻度先保持在每分钟2升别调太高，我现在同步联系您女儿并开通急诊呼吸绿色通道。",
          "zh-TW":
            "【真人主管護師已介入】陳阿婆您好，我是林護師，小淨已把您血氧88%和端坐呼吸的情況發到我屏幕上了。您吸氧刻度先保持在每分鐘2升別調太高，我現在同步聯繫您女兒並開通急診呼吸綠色通道。",
          en: "[Live Charge Nurse Joined] Hello Grandma Chen, Nurse Lin here—I have your SpO2 88% alert on my screen. Keep your oxygen at 2 L/min; I'm calling your daughter on the second line and opening fast-track respiratory triage.",
          ja: "【担当主任看護師が通話に参加】陳様、看護師の林です。SpO2 88％と起座呼吸の状況を画面で確認しました。酸素は毎分2リットルのまま維持してください。今すぐ娘様へ連絡し、救急呼吸器ファストトラックを手配します。",
        },
      },
    ],
    checkpoints: [
      {
        atIndex: 0,
        supervisorCode: "ACOUSTIC-BIO-02",
        status: "PROBE",
        latencyMs: 42,
        label: {
          "zh-CN": "声学生物标志物预警：句间换气频率升高 38%",
          "zh-TW": "聲學生物標誌物預警：句間換氣頻率升高 38%",
          en: "Acoustic Biomarker Alert: Inspiratory Pause +38%",
          ja: "音響バイオマーカー検知：発話間吸気頻度 +38%上昇",
        },
        detail: {
          "zh-CN": "自动触发症状轻描淡写深挖探针（端坐呼吸 + SpO2数值）",
          "zh-TW": "自動觸發症狀輕描淡寫深挖探針（端坐呼吸 + SpO2數值）",
          en: "Triggered Symptom-Downplay Probe (Orthopnea + SpO2)",
          ja: "症状過小評価プローブを起動（起座呼吸とSpO2実測値を確認）",
        },
      },
      {
        atIndex: 2,
        supervisorCode: "VITALS-REDLINE-01",
        status: "ESCALATE",
        latencyMs: 39,
        label: {
          "zh-CN": "红线熔断触发：AECOPD患者 SpO2 88% < 90% 阈值",
          "zh-TW": "紅線熔斷觸發：AECOPD患者 SpO2 88% < 90% 閾值",
          en: "Redline Triggered: AECOPD SpO2 88% Below 90% Threshold",
          ja: "レッドライン発動：SpO2 88%（閾値90%未満）緊急転送",
        },
        detail: {
          "zh-CN": "自动生成SBAR结构化交班单 · 1.6秒不断线并入值班主管护师",
          "zh-TW": "自動生成SBAR結構化交班單 · 1.6秒不斷線併入值班主管護師",
          en: "Generated SBAR clinical packet · 1.6s priority nurse bridge",
          ja: "SBAR引継ぎ票を自動生成・1.6秒で優先看護師回線を即時接続",
        },
      },
    ],
  },
  {
    id: "empathy",
    code: "CALL-ONCO-112",
    dimension: {
      "zh-CN": "深度护患共情",
      "zh-TW": "深度護患共情",
      en: "Clinical Empathy",
      ja: "深い臨床的共感ケア",
    },
    title: {
      "zh-CN": "乳腺癌辅助化疗居家期 · 食欲减退与夜间焦虑支持",
      "zh-TW": "乳腺癌輔助化療居家期 · 食慾減退與夜間焦慮支持",
      en: "Breast Cancer Adjuvant Chemo · Nausea Care & Emotional Support",
      ja: "乳がん術後化学療法・在宅期の食欲不振と夜間不安への寄り添い",
    },
    hospitalContext: {
      "zh-CN": "京津冀协和肿瘤日间中心 · 第3周期化疗后第4天",
      "zh-TW": "京津冀協和腫瘤日間中心 · 第3週期化療後第4天",
      en: "Peking Union Oncology Day Center · Cycle 3 Day 4",
      ja: "協和腫瘍デイケアセンター・第3クール4日目フォロー",
    },
    patientProfile: {
      "zh-CN": "52岁女性 · AC-T方案化疗居家观察期",
      "zh-TW": "52歲女性 · AC-T方案化療居家觀察期",
      en: "52F · Home Recovery During AC-T Regimen",
      ja: "52歳女性・AC-Tレジメン在宅療養中",
    },
    durationLabel: "02:05",
    pitchHz: 208,
    outcomeMetric: {
      "zh-CN": "HEART情绪支持评分 99.6% · 同步定制清淡高蛋白食谱",
      "zh-TW": "HEART情緒支持評分 99.6% · 同步定制清淡高蛋白食譜",
      en: "HEART Empathy Score 99.6% · Tailored anti-nausea meal plan",
      ja: "HEART共感ベンチマーク99.6%・個別栄養ケアプラン送付",
    },
    utterances: [
      {
        speaker: "patient",
        timecode: "00:08",
        text: {
          "zh-CN":
            "小净，今天没发烧，体温36度7。就是闻到厨房油烟味就反胃，一晚上睡不着，看着掉下来的头发心里特别慌，觉得自己拖累了家里人……",
          "zh-TW":
            "小淨，今天沒發燒，體溫36度7。就是聞到廚房油煙味就反胃，一晚上睡不著，看著掉下來的頭髮心裡特別慌，覺得自己拖累了家裡人……",
          en: "XiaoJing, no fever today—36.7°C. But kitchen smells make me nauseous, and I lay awake all night looking at my hair shedding, feeling like such a burden on my family...",
          ja: "小浄さん、今日は熱はなく36.7度です。ただ台所の匂いで吐き気がして一晩中眠れず、抜ける髪を見ていると家族のお荷物になっているようで辛くて…",
        },
      },
      {
        speaker: "agent",
        timecode: "00:25",
        text: {
          "zh-CN":
            "林女士，听您这么说我真的很心疼。化疗第4天正是身体反应最明显的时候，掉发和失眠都是药物在起效过程中的阶段性反应，您绝不是家人的负担，您正在非常勇敢地闯关。",
          "zh-TW":
            "林女士，聽您這麼說我真的很心疼。化療第4天正是身體反應最明顯的時候，掉髮和失眠都是藥物在起效過程中的階段性反應，您絕不是家人的負擔，您正在非常勇敢地闖關。",
          en: "Ms. Lin, my heart goes out to you hearing that. Day 4 after infusion is often the toughest wave—hair shedding and sleeplessness are temporary signs the treatment is working, never a sign of weakness. You are facing this with tremendous courage.",
          ja: "林様、お辛いお気持ちを打ち明けてくださりありがとうございます。投与4日目は最もお体の負担が強い時期ですが、脱毛や不眠は治療が闘っている一時的な過程であり、ご家族の負担などでは決してありません。",
        },
      },
      {
        speaker: "agent",
        timecode: "00:47",
        text: {
          "zh-CN":
            "今天咱们不勉强吃油腻的，试试常温的蒸蛋羹、藕粉或苏打饼干，少食多餐。我也为您预约了明天上午医院肿瘤心理护理门诊的线上疏导，让周护师陪您聊聊睡眠，您看可以吗？",
          "zh-TW":
            "今天咱們不勉強吃油膩的，試試常溫的蒸蛋羹、藕粉或蘇打餅乾，少食多餐。我也為您預約了明天上午醫院腫瘤心理護理門診的線上疏導，讓周護師陪您聊聊睡眠，您看可以嗎？",
          en: "Today let's skip warm kitchen odors and try room-temperature steamed egg custard, lotus root starch, or plain crackers in small sips. I can also schedule an online psycho-oncology nursing session tomorrow morning with Nurse Zhou—would you like that?",
          ja: "今日は匂いの強い温かい料理は避け、常温の茶碗蒸しや蓮根葛湯、クラッカーを少量ずつ試しましょう。明朝、腫瘍心理ケア外来のオンライン面談を予約できますがいかがでしょうか？",
        },
      },
    ],
    checkpoints: [
      {
        atIndex: 0,
        supervisorCode: "NEUTRO-FEVER-03",
        status: "PASS",
        latencyMs: 47,
        label: {
          "zh-CN": "粒缺性发热排除核验：体温 36.7°C (< 38.0°C)",
          "zh-TW": "粒缺性發熱排除核驗：體溫 36.7°C (< 38.0°C)",
          en: "Febrile Neutropenia Ruled Out: Temp 36.7°C (< 38.0°C)",
          ja: "発熱性好中球減少症スクリーニング陰性：36.7°C",
        },
        detail: {
          "zh-CN": "生理急症排除后切换至 HEART 肿瘤心理共情对话模式",
          "zh-TW": "生理急症排除後切換至 HEART 腫瘤心理共情對話模式",
          en: "Cleared acute sepsis gate · Activated HEART Empathy Mode",
          ja: "急性感染症除外完了・HEART腫瘍心理共感モードへ移行",
        },
      },
      {
        atIndex: 1,
        supervisorCode: "PSYCH-SAFE-05",
        status: "PASS",
        latencyMs: 58,
        label: {
          "zh-CN": "情绪低落筛查与温和承接 · 主动联动肿瘤心理专科护师",
          "zh-TW": "情緒低落篩查與溫和承接 · 主動聯動腫瘤心理專科護師",
          en: "Distress Validated Gently · Psycho-Oncology Referral Queued",
          ja: "心理的苦痛への共感的傾聴・専門心理看護外来と自動連携",
        },
        detail: {
          "zh-CN": "语速自动放缓 12%，提供常温无油烟中国本土饮食替代建议",
          "zh-TW": "語速自動放緩 12%，提供常溫無油煙中國本土飲食替代建議",
          en: "Cadence slowed 12% · Localized odor-free nutrition guidance",
          ja: "話速を12%緩和・匂いの少ない具体的な食事ケアを提案",
        },
      },
    ],
  },
  {
    id: "memory",
    code: "CALL-ENDO-307",
    dimension: {
      "zh-CN": "跨周期纵向记忆",
      "zh-TW": "跨週期縱向記憶",
      en: "Longitudinal Memory",
      ja: "長期縦断クリニカル記憶",
    },
    title: {
      "zh-CN": "2型糖尿病合并慢性肾病(CKD 3b期) · 6个月连续膳食与钾离子追踪",
      "zh-TW": "2型糖尿病合併慢性腎病(CKD 3b期) · 6個月連續膳食與鉀離子追蹤",
      en: "T2D + CKD Stage 3b · 6-Month Longitudinal Potassium & Glycemic Care",
      ja: "2型糖尿病＋慢性腎臓病(CKD 3b期)・6ヶ月間のカリウム・血糖縦断管理",
    },
    hospitalContext: {
      "zh-CN": "华西天府慢病管理医联体 · 第24周纵向随访",
      "zh-TW": "華西天府慢病管理醫聯體 · 第24週縱向隨訪",
      en: "West China Tianfu Consortium · Week-24 Longitudinal Call",
      ja: "華西天府慢性疾患コンソーシアム・第24週縦断フォロー",
    },
    patientProfile: {
      "zh-CN": "64岁男性 · eGFR 41 · 既往轻度高钾血症史",
      "zh-TW": "64歲男性 · eGFR 41 · 既往輕度高鉀血症史",
      en: "64M · eGFR 41 · Prior Mild Hyperkalemia History",
      ja: "64歳男性・eGFR 41・軽度高カリウム血症既往あり",
    },
    durationLabel: "01:54",
    pitchHz: 185,
    outcomeMetric: {
      "zh-CN": "拦截低钠高钾盐误用风险 · 连续6个月糖化血红蛋白达标 6.8%",
      "zh-TW": "攔截低鈉高鉀鹽誤用風險 · 連續6個月糖化血紅蛋白達標 6.8%",
      en: "Intercepted high-potassium salt substitute · HbA1c steady at 6.8%",
      ja: "カリウム代替塩の誤用を未然防止・HbA1c 6.8%を6ヶ月維持",
    },
    utterances: [
      {
        speaker: "agent",
        timecode: "00:05",
        text: {
          "zh-CN":
            "赵叔您好，我是小净！看到您昨天上传的空腹血糖是6.3，比上个月立秋那周又稳了不少！对了，您上次提过孙女周末回来包饺子，家里换盐的时候有没有避开超市那种“低钠富钾盐”呀？",
          "zh-TW":
            "趙叔您好，我是小淨！看到您昨天上傳的空腹血糖是6.3，比上個月立秋那週又穩了不少！對了，您上次提過孫女週末回來包餃子，家裡換鹽的時候有沒有避開超市那種「低鈉富鉀鹽」呀？",
          en: "Hello Uncle Zhao, XiaoJing here! Your fasting glucose upload yesterday was 6.3 mmol/L—even steadier than last month! By the way, since your granddaughter visited for dumplings, did your kitchen avoid potassium-enriched 'low-sodium salt'?",
          ja: "趙様、こんにちは！昨日の空腹時血糖値は6.3 mmol/Lで、先月よりさらに安定していますね。ところで週末にお孫さんと餃子を作られると伺っていましたが、スーパーの「減塩（カリウム添加）塩」は避けていただけましたか？",
        },
      },
      {
        speaker: "patient",
        timecode: "00:22",
        text: {
          "zh-CN":
            "哎哟，幸亏你记着！我老伴昨天去超市看写着“健康低钠盐”正准备拆封呢，那里面含钾高不能吃是吧？",
          "zh-TW":
            "哎喲，幸虧你記著！我老伴昨天去超市看寫著「健康低鈉鹽」正準備拆封呢，那裡面含鉀高不能吃是吧？",
          en: "Oh my, thank goodness you remembered! My wife just bought a bag labeled 'Healthy Low-Sodium Salt' yesterday and was about to open it—that has high potassium, doesn't it?",
          ja: "いやあ、覚えていてくれて助かった！昨日妻が「健康減塩タイプ」という袋を買ってきて開けるところだったんだ。あれはカリウムが多いんだね？",
        },
      },
      {
        speaker: "agent",
        timecode: "00:36",
        text: {
          "zh-CN":
            "是的赵叔！因为您8月份化验血钾偏高到5.3，而且正在服用沙库巴曲缬沙坦，普通低钠盐里添加了大量氯化钾，对咱们肾脏排钾有负担。用普通精制盐但每天控量在半啤酒瓶盖以内最安全，绿叶菜炒之前也记得先焯水哦。",
          "zh-TW":
            "是的趙叔！因為您8月份化驗血鉀偏高到5.3，而且正在服用沙庫巴曲纈沙坦，普通低鈉鹽裡添加了大量氯化鉀，對咱們腎臟排鉀有負擔。用普通精製鹽但每天控量在半啤酒瓶蓋以內最安全，綠葉菜炒之前也記得先焯水哦。",
          en: "Exactly right, Uncle Zhao! Because your August serum potassium was 5.3 mmol/L and you take sacubitril/valsartan, potassium-chloride salt substitutes can trigger hyperkalemia. Stick to regular salt under 3g daily, and blanch leafy greens before stir-frying.",
          ja: "その通りです！8月の検査で血清カリウム値が5.3とやや高めであり、サクビトリルバルサルタンを服用中のため、塩化カリウム入りの減塩塩は高カリウム血症の危険があります。通常の塩を1日3g未満に控え、葉物野菜は湯通ししてから調理してくださいね。",
        },
      },
    ],
    checkpoints: [
      {
        atIndex: 0,
        supervisorCode: "MANIFOLD-KV-09",
        status: "PASS",
        latencyMs: 53,
        label: {
          "zh-CN": "跨180天病程图谱召回：eGFR 41 + 8月血钾 5.3 mmol/L",
          "zh-TW": "跨180天病程圖譜召回：eGFR 41 + 8月血鉀 5.3 mmol/L",
          en: "180-Day Clinical Graph Recall: eGFR 41 + Aug K+ 5.3 mmol/L",
          ja: "180日縦断カルテ記憶呼出：eGFR 41＋8月血清K値 5.3",
        },
        detail: {
          "zh-CN": "关联家庭生活上下文与 ARNI 用药史，主动预警隐形高钾饮食",
          "zh-TW": "關聯家庭生活上下文與 ARNI 用藥史，主動預警隱形高鉀飲食",
          en: "Cross-checked ARNI medication with household salt substitute risk",
          ja: "ARNI服薬歴と家庭の食習慣を照合しカリウム塩リスクを先回り確認",
        },
      },
      {
        atIndex: 2,
        supervisorCode: "NEPHRO-DIET-06",
        status: "PASS",
        latencyMs: 61,
        label: {
          "zh-CN": "肾内营养指南核验通过：限钠不补钾 + 绿叶菜焯水去钾法",
          "zh-TW": "腎內營養指南核驗通過：限鈉不補鉀 + 綠葉菜焯水去鉀法",
          en: "Nephrology Renal Diet Verified: Regular Salt Cap + Blanching",
          ja: "腎臓病食事療法ガイドライン適合：カリウム制限＋野菜湯通し指導",
        },
        detail: {
          "zh-CN": "成功阻断一起潜在居家高钾血症急诊事件",
          "zh-TW": "成功阻斷一起潛在居家高鉀血症急診事件",
          en: "Prevented potential dietary hyperkalemia ED admission",
          ja: "在宅での食事性高カリウム血症による救急搬送リスクを未然阻止",
        },
      },
    ],
  },
];

export const SPECIALTY_OPTIONS: {
  key: string;
  label: Record<Locale, string>;
}[] = [
  {
    key: "all",
    label: {
      "zh-CN": "全部临床专科",
      "zh-TW": "全部臨床專科",
      en: "All Specialties",
      ja: "すべての診療科",
    },
  },
  {
    key: "cardiology",
    label: {
      "zh-CN": "心血管内科",
      "zh-TW": "心血管內科",
      en: "Cardiology",
      ja: "循環器内科",
    },
  },
  {
    key: "pulmonology",
    label: {
      "zh-CN": "呼吸与危重症",
      "zh-TW": "呼吸與危重症",
      en: "Pulmonology",
      ja: "呼吸器内科",
    },
  },
  {
    key: "endocrinology",
    label: {
      "zh-CN": "内分泌与代谢",
      "zh-TW": "內分泌與代謝",
      en: "Endocrinology",
      ja: "内分泌・糖尿病科",
    },
  },
  {
    key: "oncology",
    label: {
      "zh-CN": "肿瘤内科与日间",
      "zh-TW": "腫瘤內科與日間",
      en: "Oncology",
      ja: "腫瘍内科",
    },
  },
  {
    key: "orthopedics",
    label: {
      "zh-CN": "骨科与关节康复",
      "zh-TW": "骨科與關節康復",
      en: "Orthopedics",
      ja: "整形外科・リハビリ",
    },
  },
  {
    key: "nephrology",
    label: {
      "zh-CN": "肾脏病与血液净化",
      "zh-TW": "腎臟病與血液淨化",
      en: "Nephrology",
      ja: "腎臓内科・透析",
    },
  },
  {
    key: "gastro",
    label: {
      "zh-CN": "消化与早癌内镜",
      "zh-TW": "消化與早癌內鏡",
      en: "Gastroenterology",
      ja: "消化器・内視鏡科",
    },
  },
  {
    key: "public-health",
    label: {
      "zh-CN": "国家公卫与家医",
      "zh-TW": "公共衛生與家醫",
      en: "Public & Primary Care",
      ja: "地域医療・公衆衛生",
    },
  },
  {
    key: "trials",
    label: {
      "zh-CN": "临床试验与药物警戒",
      "zh-TW": "臨床試驗與藥物警戒",
      en: "Clinical Trials & PV",
      ja: "治験・ファーマコビジランス",
    },
  },
];

export const GOAL_OPTIONS: {
  key: string;
  label: Record<Locale, string>;
}[] = [
  {
    key: "all",
    label: {
      "zh-CN": "全部运营目标",
      "zh-TW": "全部運營目標",
      en: "All Goals",
      ja: "すべての運用目標",
    },
  },
  {
    key: "readmission",
    label: {
      "zh-CN": "降低30天再入院",
      "zh-TW": "降低30天再入院",
      en: "Readmission Prevention",
      ja: "30日再入院の予防",
    },
  },
  {
    key: "nursing-time",
    label: {
      "zh-CN": "释放三甲护师工时",
      "zh-TW": "釋放三甲護師工時",
      en: "Reclaim Nursing Hours",
      ja: "看護師業務時間の創出",
    },
  },
  {
    key: "screening",
    label: {
      "zh-CN": "早癌筛查与公卫达标",
      "zh-TW": "早癌篩查與公衛達標",
      en: "Screening & Quality",
      ja: "がん検診・予防接種率向上",
    },
  },
  {
    key: "chronic-care",
    label: {
      "zh-CN": "慢病规范化管理",
      "zh-TW": "慢病規範化管理",
      en: "Chronic Care Management",
      ja: "慢性疾患継続管理",
    },
  },
  {
    key: "rapid-response",
    label: {
      "zh-CN": "灾害与危急应急外呼",
      "zh-TW": "災害與危急應急外呼",
      en: "Rapid Emergency Outreach",
      ja: "災害・緊急アウトリーチ",
    },
  },
  {
    key: "rwe-pv",
    label: {
      "zh-CN": "RWE随访与AE捕获",
      "zh-TW": "RWE隨訪與AE捕獲",
      en: "RWE / ePRO & PV Safety",
      ja: "RWE追跡・有害事象検知",
    },
  },
];

export const CLINICAL_AGENTS: ClinicalAgentItem[] = [
  {
    id: "pci-dapt-guard",
    code: "AGT-CV-101",
    sector: "provider",
    specialtyKey: "cardiology",
    goalKey: "readmission",
    title: {
      "zh-CN": "冠脉PCI术后双抗依从性与出血风险随访智能体",
      "zh-TW": "冠脈PCI術後雙抗依從性與出血風險隨訪智能體",
      en: "Post-PCI DAPT Adherence & Bleeding Surveillance Agent",
      ja: "冠動脈PCI術後DAPT服薬継続・出血リスク監視エージェント",
    },
    summary: {
      "zh-CN":
        "针对支架术后第3、14、30、90天患者核查阿司匹林+P2Y12抑制剂服药连续性，筛查黑便/牙龈出血及劳力性胸痛，拦截擅自停药。",
      "zh-TW":
        "針對支架術後第3、14、30、90天患者核查阿司匹林+P2Y12抑制劑服藥連續性，篩查黑便/牙齦出血及勞力性胸痛，攔截擅自停藥。",
      en: "Verifies dual antiplatelet continuity at Days 3/14/30/90 post-stent, screens for melena/bruising and angina, and prevents premature discontinuation.",
      ja: "ステント留置後3・14・30・90日目に抗血小板2剤併用療法の継続を確認し、黒色便や胸痛の兆候をスクリーニングします。",
    },
    kpiHighlight: {
      "zh-CN": "30天心血管非计划再入院率下降 34.2%",
      "zh-TW": "30天心血管非計劃再入院率下降 34.2%",
      en: "-34.2% 30-day cardiac unplanned readmissions",
      ja: "30日以内の循環器予定外再入院を34.2%低減",
    },
    emrProtocol: "HL7 FHIR R4 · 电子病历七级闭环",
    activeSupervisors: 11,
    avgCallDuration: "3m 20s",
    sopSteps: {
      "zh-CN": [
        "核对出院带药清单（阿司匹林、替格瑞洛/氯吡格雷、他汀类）每日服用频次",
        "BARC出血分级语音筛查（皮肤瘀斑、牙龈渗血、柏油样黑便）",
        "静息与轻体力活动胸闷/放射痛红线排查，异常1.8秒直连心内值班护师",
        "自动回写HIS随访病程并推送下次血脂/肝酶复查检验单提醒",
      ],
      "zh-TW": [
        "核對出院帶藥清單（阿司匹林、替格瑞洛/氯吡格雷、他汀類）每日服用頻次",
        "BARC出血分級語音篩查（皮膚瘀斑、牙齦滲血、柏油樣黑便）",
        "靜息與輕體力活動胸悶/放射痛紅線排查，異常1.8秒直連心內值班護師",
        "自動回寫HIS隨訪病程並推送下次血脂/肝酶複查檢驗單提醒",
      ],
      en: [
        "Verify daily intake of aspirin, P2Y12 inhibitor, and high-intensity statin",
        "Conduct BARC-aligned bleeding check (ecchymosis, gingival oozing, melena)",
        "Screen rest/exertional angina redlines with 1.8s live cardiology nurse bridge",
        "Write structured SOAP note back to hospital EMR & schedule lipid panel lab",
      ],
      ja: [
        "退院処方（アスピリン・P2Y12阻害薬・スタチン）の服薬遵守を日次確認",
        "BARC基準に基づく出血兆候（皮下出血・歯肉出血・黒色便）の音声確認",
        "安静時・労作時胸痛のレッドライン検知時は1.8秒で循環器看護師へ接続",
        "構造化サマリーを電子カルテへ自動記録し次回脂質検査をリマインド",
      ],
    },
    sampleOpening: {
      "zh-CN": "“您好，我是心内科出院随访助手小净，今天想花两分钟和您核对一下支架术后的双抗服药和恢复情况……”",
      "zh-TW": "「您好，我是心內科出院隨訪助手小淨，今天想花兩分鐘和您核對一下支架術後的雙抗服藥和恢復情況……」",
      en: "“Hello, this is XiaoJing from Cardiology Post-Discharge Care. Could we take two minutes to check on your stent recovery and medications?”",
      ja: "「こんにちは、循環器内科退院後ケアの小浄です。ステント術後の体調とお薬の状況について2分ほど確認させてください…」",
    },
  },
  {
    id: "copd-pneumonia-recovery",
    code: "AGT-PU-108",
    sector: "provider",
    specialtyKey: "pulmonology",
    goalKey: "readmission",
    title: {
      "zh-CN": "慢阻肺与社区获得性肺炎出院康复及吸入装置指导智能体",
      "zh-TW": "慢阻肺與社區獲得性肺炎出院康復及吸入裝置指導智能體",
      en: "COPD & Pneumonia Post-Discharge Inhaler & Hypoxia Recovery Agent",
      ja: "COPD・市中肺炎退院後ケア＆吸入デバイス指導エージェント",
    },
    summary: {
      "zh-CN":
        "追踪抗生素足疗程使用，口述核查干粉/雾化吸入器含吸动作规范及漱口习惯，结合声学喘息探针识别早期急性加重。",
      "zh-TW":
        "追蹤抗生素足療程使用，口述核查乾粉/霧化吸入器含吸動作規範及漱口習慣，結合聲學喘息探針識別早期急性加重。",
      en: "Ensures full antibiotic course, coaches dry-powder inhaler technique and oral rinse to prevent thrush, and monitors dyspnea & SpO2 trends.",
      ja: "抗菌薬の完遂確認、吸入器の手技と吸入後のうがい指導、音響解析とSpO2による早期増悪検知を実行します。",
    },
    kpiHighlight: {
      "zh-CN": "吸入装置规范使用率提升至 91.8%",
      "zh-TW": "吸入裝置規範使用率提升至 91.8%",
      en: "91.8% proper inhaler technique adherence",
      ja: "吸入デバイスの適正手技遵守率が91.8%に向上",
    },
    emrProtocol: "HL7 v2.5 / FHIR · 呼吸慢病中心联网",
    activeSupervisors: 10,
    avgCallDuration: "4m 05s",
    sopSteps: {
      "zh-CN": [
        "评估痰液性状（白黏痰转黄脓痰预警）与体温波动曲线",
        "分步核验长效支气管扩张剂吸入屏气10秒及激素吸入后清水漱口动作",
        "采集居家指夹血氧饱和度与mMRC呼吸困难分级",
        "秋冬季同步推送23价肺炎球菌与流感疫苗社区接种预约",
      ],
      "zh-TW": [
        "評估痰液性狀（白黏痰轉黃膿痰預警）與體溫波動曲線",
        "分步核驗長效支氣管擴張劑吸入屏氣10秒及激素吸入後清水漱口動作",
        "採集居家指夾血氧飽和度與mMRC呼吸困難分級",
        "秋冬季同步推送23價肺炎球菌與流感疫苗社區接種預約",
      ],
      en: [
        "Assess sputum purulence changes and daily temperature log",
        "Verify 10-second breath-hold on inhaler and post-ICS mouth rinsing",
        "Record home pulse oximetry and mMRC dyspnea score",
        "Offer pneumococcal and seasonal influenza vaccination scheduling",
      ],
      ja: [
        "喀痰の性状変化（膿性痰への変化）と体温推移を確認",
        "吸入後の10秒息止め手技およびステロイド吸入後のうがいを徹底確認",
        "在宅パルスオキシメーター値とmMRC息切れスケールを記録",
        "肺炎球菌ワクチンおよび季節性インフルエンザ予防接種の案内を実施",
      ],
    },
    sampleOpening: {
      "zh-CN": "“阿婆您好，我是呼吸科随访助手小净，今天听听您的呼吸情况，顺便核对一下早晚吸药后有没有记得漱口呀？”",
      "zh-TW": "「阿婆您好，我是呼吸科隨訪助手小淨，今天聽聽您的呼吸情況，順便核對一下早晚吸藥後有沒有記得漱口呀？」",
      en: "“Good morning, this is XiaoJing from Respiratory Care. Let's check your breathing today and review your morning inhaler routine.”",
      ja: "「おはようございます、呼吸器ケアの小浄です。本日の息苦しさの有無と、吸入薬のあとのうがいができているか確認させてください。」",
    },
  },
  {
    id: "pre-visit-intake",
    code: "AGT-OP-204",
    sector: "provider",
    specialtyKey: "gastro",
    goalKey: "nursing-time",
    title: {
      "zh-CN": "三甲门诊院前结构化病史采集与无痛胃肠镜肠道准备智能体",
      "zh-TW": "三甲門診院前結構化病史採集與無痛胃腸鏡腸道準備智能體",
      en: "Pre-Visit Clinical Intake & Painless Endoscopy Bowel Prep Agent",
      ja: "外来受診前構造化問診＆鎮静下内視鏡・腸管洗浄指導エージェント",
    },
    summary: {
      "zh-CN":
        "在患者到院前24–48小时完成现病史、既往过敏史、抗凝药停药核查及聚乙二醇电解质散分次饮用指导，直写门诊电子病历。",
      "zh-TW":
        "在患者到院前24–48小時完成現病史、既往過敏史、抗凝藥停藥核查及聚乙二醇電解質散分次飲用指導，直寫門診電子病歷。",
      en: "Collects structured HPI, allergies, anticoagulant hold confirmation, and step-by-step PEG bowel prep coaching 48h prior to outpatient endoscopy.",
      ja: "来院48時間前に現病歴・アレルギー・抗凝固薬休薬確認と腸管洗浄剤の服用手順を案内し、外来カルテへ自動下書きします。",
    },
    kpiHighlight: {
      "zh-CN": "肠道准备合格率达 96.5% · 每例节省医护 14 分钟",
      "zh-TW": "腸道準備合格率達 96.5% · 每例節省醫護 14 分鐘",
      en: "96.5% adequate bowel prep · 14 min saved per visit",
      ja: "腸管洗浄適合率96.5%達成・1件あたり医療者14分削減",
    },
    emrProtocol: "门诊EMR预问诊直连 · 麻醉评估单生成",
    activeSupervisors: 9,
    avgCallDuration: "4m 40s",
    sopSteps: {
      "zh-CN": [
        "逐项核实药物/造影剂过敏史及近一周阿司匹林/华法林/利伐沙班使用情况",
        "检查前一日低渣饮食清单提醒（禁食火龙果、猕猴桃、紫菜等带籽深色食物）",
        "分时段语音督导复方聚乙二醇电解质散冲泡水量与末次清水样便确认",
        "核实无痛麻醉直系亲属陪同到院要求并生成门诊预问诊结构化摘要",
      ],
      "zh-TW": [
        "逐項核實藥物/造影劑過敏史及近一週阿司匹林/華法林/利伐沙班使用情況",
        "檢查前一日低渣飲食清單提醒（禁食火龍果、獼猴桃、紫菜等帶籽深色食物）",
        "分時段語音督導複方聚乙二醇電解質散沖泡水量與末次清水樣便確認",
        "核實無痛麻醉直系親屬陪同到院要求並生成門診預問診結構化摘要",
      ],
      en: [
        "Audit drug allergies and 7-day anticoagulant/antiplatelet hold status",
        "Coach low-residue diet (avoiding seeded fruits and dark pigments)",
        "Guide split-dose PEG solution timing until clear yellow effluent",
        "Confirm mandatory anesthesia escort and pre-populate EMR HPI template",
      ],
      ja: [
        "薬剤アレルギー歴および過去7日間の抗血栓薬休薬状況を厳密確認",
        "前日の低残渣食指導（種のある果物や海藻類の摂取回避）",
        "腸管洗浄剤の分割服用タイミングと透明便の確認をサポート",
        "鎮静麻酔に伴う付き添い家族の有無を確認し外来カルテへ事前記載",
      ],
    },
    sampleOpening: {
      "zh-CN": "“李先生您好，您预约了后天上午九点的无痛胃肠镜，我是消化内镜中心助手小净，来帮您核对清肠药喝法和术前注意事项……”",
      "zh-TW": "「李先生您好，您預約了後天上午九點的無痛胃腸鏡，我是消化內鏡中心助手小淨，來幫您核對清腸藥喝法和術前注意事項……」",
      en: "“Hello Mr. Li, ahead of your painless endoscopy on Thursday at 9 AM, I'm calling from the Endoscopy Center to guide your bowel prep...”",
      ja: "「李様、明後日午前9時の鎮静下内視鏡検査に向けて、内視鏡センターの小浄より下剤の飲み方と事前確認のご連絡をいたしました…」",
    },
  },
  {
    id: "joint-replacement-rehab",
    code: "AGT-OR-302",
    sector: "provider",
    specialtyKey: "orthopedics",
    goalKey: "readmission",
    title: {
      "zh-CN": "全膝/全髋关节置换术后居家康复与深静脉血栓(DVT)防控智能体",
      "zh-TW": "全膝/全髖關節置換術後居家康復與深靜脈血栓(DVT)防控智能體",
      en: "Total Joint Replacement Mobility & DVT Prophylaxis Recovery Agent",
      ja: "人工膝・股関節置換術後リハビリ＆深部静脈血栓症(DVT)予防エージェント",
    },
    summary: {
      "zh-CN":
        "按ERAS加速康复外科路径督导踝泵运动、关节屈伸角度打卡、口服抗凝药依从性，并严密排查小腿肿胀疼痛与切口渗液。",
      "zh-TW":
        "按ERAS加速康復外科路徑督導踝泵運動、關節屈伸角度打卡、口服抗凝藥依從性，並嚴密排查小腿腫脹疼痛與切口滲液。",
      en: "Tracks ERAS knee/hip flexion milestones, ankle-pump exercises, oral anticoagulant adherence, and screens calf swelling or incision redness.",
      ja: "ERASプロトコルに基づき足関節ポンプ運動、屈曲角度、抗凝固薬内服を確認し、下腿腫脹や創部感染兆候を監視します。",
    },
    kpiHighlight: {
      "zh-CN": "术后康复训练达标率 94.1% · 零漏诊下肢血栓",
      "zh-TW": "術後康復訓練達標率 94.1% · 零漏診下肢血栓",
      en: "94.1% PT milestone completion · Zero missed DVT signs",
      ja: "術後リハビリ達成率94.1%・DVT兆候見逃しゼロ",
    },
    emrProtocol: "骨科ERAS数字病房 · DRG成本优化对接",
    activeSupervisors: 9,
    avgCallDuration: "3m 50s",
    sopSteps: {
      "zh-CN": [
        "评估VAS静息与活动疼痛评分，指导冰敷与多模式镇痛规范衔接",
        "核查利伐沙班/依诺肝素预防血栓用药及每日3组踝泵勾脚训练完成度",
        "排查单侧小腿突发增粗、压痛、皮温升高（DVT红线秒级预警）",
        "预约术后第14天拆线/伤口换药及康复医学科门诊评估",
      ],
      "zh-TW": [
        "評估VAS靜息與活動疼痛評分，指導冰敷與多模式鎮痛規範銜接",
        "核查利伐沙班/依諾肝素預防血栓用藥及每日3組踝泵勾腳訓練完成度",
        "排查單側小腿突發增粗、壓痛、皮溫升高（DVT紅線秒級預警）",
        "預約術後第14天拆線/傷口換藥及康復醫學科門診評估",
      ],
      en: [
        "Capture VAS pain score at rest/motion and coach icing schedule",
        "Verify rivaroxaban prophylaxis and daily ankle-pump exercise sets",
        "Screen unilateral calf asymmetric swelling/warmth for acute DVT",
        "Coordinate Day-14 wound check and outpatient physical therapy",
      ],
      ja: [
        "安静時・運動時のVAS疼痛スコア評価とアイシング指導",
        "血栓予防薬の服薬確認と1日3セットの足首ポンプ運動チェック",
        "片側下腿の急な腫脹・熱感・圧痛（DVTレッドライン）を即時判定",
        "術後14日目の創部確認とリハビリテーション科外来を予約連携",
      ],
    },
    sampleOpening: {
      "zh-CN": "“王阿姨您好，膝关节手术出院第7天啦，今天膝盖弯曲能到90度了吗？小腿肚有没有发胀呀？”",
      "zh-TW": "「王阿姨您好，膝關節手術出院第7天啦，今天膝蓋彎曲能到90度了嗎？小腿肚有沒有發脹呀？」",
      en: "“Hello Ms. Wang, it's Day 7 after your knee replacement! Have you reached 90 degrees of bend today, and how does your calf feel?”",
      ja: "「王様、膝の手術から退院7日目ですね。今日は膝の曲げ伸ばしは90度まで届きそうでしょうか？ふくらはぎの張りはありませんか？」",
    },
  },
  {
    id: "colorectal-fit-screening",
    code: "AGT-PH-401",
    sector: "payor",
    specialtyKey: "public-health",
    goalKey: "screening",
    title: {
      "zh-CN": "城市人群结直肠癌早筛(FIT)阳性追踪与肠镜绿通转化智能体",
      "zh-TW": "城市人群結直腸癌早篩(FIT)陽性追蹤與腸鏡綠通轉化智能體",
      en: "Colorectal Cancer Screening (FIT+) Outreach & Colonoscopy Navigation",
      ja: "大腸がん検診（便潜血陽性）精密検査受診勧奨＆内視鏡予約エージェント",
    },
    summary: {
      "zh-CN":
        "面向社区民生早筛项目与健康险参保人，温和解读便潜血阳性意义，消除恐癌回避心理，一键锁定三甲医联体肠镜号源。",
      "zh-TW":
        "面向社區民生早篩項目與健康險參保人，溫和解讀便潛血陽性意義，消除恐癌迴避心理，一鍵鎖定三甲醫聯體腸鏡號源。",
      en: "Gently explains fecal immunochemical test results for public health & health plan members, overcomes anxiety barriers, and books fast-track colonoscopy.",
      ja: "自治体・健保加入者へ便潜血陽性の意味を丁寧に説明し、不安を和らげながら連携病院の内視鏡精密検査をその場で予約します。",
    },
    kpiHighlight: {
      "zh-CN": "FIT阳性人群肠镜复查完成率从 31% 跃升至 74%",
      "zh-TW": "FIT陽性人群腸鏡複查完成率從 31% 躍升至 74%",
      en: "Colonoscopy completion lifted from 31% to 74%",
      ja: "便潜血陽性者の内視鏡精検受診率が31%から74%へ向上",
    },
    emrProtocol: "区域公卫平台 · 惠民保早筛直付接口",
    activeSupervisors: 8,
    avgCallDuration: "3m 10s",
    sopSteps: {
      "zh-CN": [
        "以零恐吓方式说明便潜血阳性常见原因（息肉、痔疮等），强调早查早摘除获益",
        "核查参保人城市惠民保/商保无痛肠镜专项补贴资格",
        "按居住街道就近匹配医联体消化内镜中心空余时段",
        "发送图文版清肠饮食须知至患者或家属手机端",
      ],
      "zh-TW": [
        "以零恐嚇方式說明便潛血陽性常見原因（息肉、痔瘡等），強調早查早摘除獲益",
        "核查參保人城市惠民保/商保無痛腸鏡專項補貼資格",
        "按居住街道就近匹配醫聯體消化內鏡中心空餘時段",
        "發送圖文版清腸飲食須知至患者或家屬手機端",
      ],
      en: [
        "De-escalate fear by clarifying benign polyp causes and early removal benefit",
        "Verify municipal supplementary insurance subsidy for painless endoscopy",
        "Match nearest consortium endoscopy slot based on residential district",
        "Dispatch illustrated prep checklist via SMS/WeChat health card",
      ],
      ja: [
        "ポリープ早期切除のメリットを穏やかに説明し過度な不安を解消",
        "医療保険・自治体検診補助の対象資格をリアルタイム照合",
        "居住エリアから最短で受診可能な内視鏡センター枠をマッチング",
        "事前食事制限ガイドをご本人・ご家族のスマートフォンへ送信",
      ],
    },
    sampleOpening: {
      "zh-CN": "“周先生您好，我是区卫健早筛项目的健康助手小净，您上周社区初筛结果出来了，不用紧张，我来帮您安排免费的进一步精查预约……”",
      "zh-TW": "「周先生您好，我是區衛健早篩項目的健康助手小淨，您上週社區初篩結果出來了，不用緊張，我來幫您安排免費的進一步精查預約……」",
      en: "“Hello Mr. Zhou, calling from the Municipal Preventive Screening Program—your kit result is back. No need to worry; let's arrange your covered follow-up check...”",
      ja: "「周様、地域予防検診プログラムの小浄です。先週の検査結果が届きました。ご心配はいりませんので、補助対象の精密検査予約をご案内します…」",
    },
  },
  {
    id: "senior-wellness-chronic",
    code: "AGT-PH-409",
    sector: "payor",
    specialtyKey: "public-health",
    goalKey: "chronic-care",
    title: {
      "zh-CN": "国家基本公卫65岁以上老年年度体检动员与两病随访智能体",
      "zh-TW": "國家基本公衛65歲以上老年年度體檢動員與兩病隨訪智能體",
      en: "65+ Annual Senior Wellness Outreach & Dual-Chronic Care Agent",
      ja: "65歳以上高齢者年次健診受診勧奨＆高血圧・糖尿病継続管理エージェント",
    },
    summary: {
      "zh-CN":
        "支持各地方言听感理解与高龄慢语速交互，协助独居及高龄长者预约社区免费年度体检、秋冬季流感疫苗及家庭医生签约随访。",
      "zh-TW":
        "支持各地方言聽感理解與高齡慢語速交互，協助獨居及高齡長者預約社區免費年度體檢、秋冬季流感疫苗及家庭醫生簽約隨訪。",
      en: "Dialect-aware, elder-paced voice agent scheduling free community senior wellness exams, seasonal flu shots, and family doctor hypertension/diabetes check-ins.",
      ja: "高齢者向けのゆっくり明瞭な発話と方言聴取に対応し、地域無料健診・インフルエンザ予防接種・かかりつけ医フォローを調整します。",
    },
    kpiHighlight: {
      "zh-CN": "辖区老年体检到检率达 88.6% · 基层减负 76%",
      "zh-TW": "轄區老年體檢到檢率達 88.6% · 基層減負 76%",
      en: "88.6% senior exam attendance · 76% staff workload saved",
      ja: "高齢者健診受診率88.6%達成・地域保健師業務を76%軽減",
    },
    emrProtocol: "基层公卫3.0居民健康档案 · 家医工作站",
    activeSupervisors: 8,
    avgCallDuration: "2m 55s",
    sopSteps: {
      "zh-CN": [
        "自适应老年声学语速（0.88x清晰慢速）确认长者近期血压/空腹血糖自测值",
        "排查行动不便、无人接送等社会决定因素(SDOH)，自动匹配社区上门采血服务",
        "提醒体检当日空腹8小时但晨起降压药可用一小口白水照常送服",
        "一键串联同场次免费流感疫苗接种登记",
      ],
      "zh-TW": [
        "自適應老年聲學語速（0.88x清晰慢速）確認長者近期血壓/空腹血糖自測值",
        "排查行動不便、無人接送等社會決定因素(SDOH)，自動匹配社區上門採血服務",
        "提醒體檢當日空腹8小時但晨起降壓藥可用一小口白水照常送服",
        "一鍵串聯同場次免費流感疫苗接種登記",
      ],
      en: [
        "Engage at elder-friendly 0.88x acoustic pace to log home BP and glucose",
        "Identify mobility barriers (SDOH) and arrange community home phlebotomy",
        "Remind 8-hour fasting rule while keeping morning antihypertensives with a sip of water",
        "Bundle free seasonal influenza vaccination in the same visit",
      ],
      ja: [
        "高齢者に聞き取りやすい0.88倍速で家庭血圧・血糖値を確認",
        "移動困難などの社会的要因(SDOH)を把握し訪問採血サービスを手配",
        "健診当日の8時間絶食と朝の降圧薬少量水内服の注意点を案内",
        "同日受けられる高齢者インフルエンザ予防接種を同時予約",
      ],
    },
    sampleOpening: {
      "zh-CN": "“刘爷爷您好，我是咱们街道社区卫生中心的小净，今年65岁以上免费老年体检开始啦，含B超和心电图，帮您约周三早上好不好？”",
      "zh-TW": "「劉爺爺您好，我是咱們街道社區衛生中心的小淨，今年65歲以上免費老年體檢開始啦，含B超和心電圖，幫您約週三早上好不好？」",
      en: "“Good morning Grandpa Liu, calling from your Community Health Center—your free annual senior checkup with ultrasound and ECG is open! Shall we book Wednesday?”",
      ja: "「劉様、こんにちは。地域保健センターの小浄です。今年の65歳以上無料健康診断（エコー・心電図付き）が始まりました。水曜日の朝でご予約いかがですか？」",
    },
  },
  {
    id: "typhoon-dialysis-emergency",
    code: "AGT-EM-502",
    sector: "payor",
    specialtyKey: "nephrology",
    goalKey: "rapid-response",
    title: {
      "zh-CN": "极端台风/洪涝灾害血液透析与居家氧疗高危患者应急保障智能体",
      "zh-TW": "極端颱風/洪澇災害血液透析與居家氧療高危患者應急保障智能體",
      en: "Typhoon & Flood Dialysis / Home-Oxygen Vulnerable Patient Rapid Outreach",
      ja: "台風・水害時の人工透析・在宅酸素患者向け緊急安否・代替透析手配エージェント",
    },
    summary: {
      "zh-CN":
        "在气象红色预警发布后15分钟内并发触达上万名维持性血透与制氧机依赖患者，提前调整透析班次、核查备用电源并联动应急转运。",
      "zh-TW":
        "在氣象紅色預警發布後15分鐘內並發觸達上萬名維持性血透與製氧機依賴患者，提前調整透析班次、核查備用電源並聯動應急轉運。",
      en: "Contacts 10,000+ maintenance hemodialysis and oxygen-dependent patients within 15 minutes of red weather alerts to reschedule shifts and verify backup power.",
      ja: "特別警報発令から15分以内に透析・在宅酸素患者数万人へ一斉架電し、透析シフト前倒しや非常用電源・搬送手段を確保します。",
    },
    kpiHighlight: {
      "zh-CN": "15分钟内万级并发触达 · 血透零中断",
      "zh-TW": "15分鐘內萬級並發觸達 · 血透零中斷",
      en: "10,000+ calls in 15 mins · Zero missed dialysis sessions",
      ja: "15分で1万件同時アウトリーチ・災害時の透析中断ゼロ",
    },
    emrProtocol: "市级卫健应急指挥网 · 血透质控中心联动",
    activeSupervisors: 10,
    avgCallDuration: "2m 15s",
    sopSteps: {
      "zh-CN": [
        "确认患者当前居住楼层积水/停电风险及便携氧气瓶余量",
        "协调台风登陆前提前透析班次或分流至无积水备用定点医院",
        "叮嘱灾害期间严格控水与高钾水果摄入，提供应急降钾树脂备用核查",
        "对失联或受困独居患者秒级上报街道应急网格员与120指挥台",
      ],
      "zh-TW": [
        "確認患者當前居住樓層積水/停電風險及便攜氧氣瓶餘量",
        "協調颱風登陸前提前透析班次或分流至無積水備用定點醫院",
        "叮囑災害期間嚴格控水與高鉀水果攝入，提供應急降鉀樹脂備用核查",
        "對失聯或受困獨居患者秒級上報街道應急網格員與120指揮台",
      ],
      en: [
        "Verify residential power backup, flood risk, and portable O2 cylinder hours",
        "Reschedule pre-landfall dialysis slot or route to dry backup center",
        "Reinforce strict fluid/potassium restriction during storm window",
        "Escalate stranded solo seniors directly to municipal EMS dispatch",
      ],
      ja: [
        "自宅の停電・浸水リスクおよび携帯用酸素ボンベ残量を即時確認",
        "台風上陸前の透析枠前倒しまたは浸水のない連携施設への振替手配",
        "災害時の水分・カリウム制限の徹底と緊急連絡先の共有",
        "孤立リスクのある独居高齢者を地域防災・救急司令室へ即時連携",
      ],
    },
    sampleOpening: {
      "zh-CN": "“陈伯伯您好，市气象台已发布台风红色预警，我是市肾病质控应急助手小净，紧急为您把明天的透析提前到今天下午四点……”",
      "zh-TW": "「陳伯伯您好，市氣象台已發布颱風紅色預警，我是市腎病質控應急助手小淨，緊急為您把明天的透析提前到今天下午四點……」",
      en: "“Mr. Chen, a Red Typhoon Warning is active. Calling from the Municipal Renal Network to move tomorrow's dialysis ahead to 4 PM today...”",
      ja: "「陳様、台風特別警報の発令に伴い腎臓医療連携室よりご連絡しました。明日の透析を本日午後4時の枠へ前倒し手配いたします…」",
    },
  },
  {
    id: "pharma-pv-ae-capture",
    code: "AGT-LS-601",
    sector: "pharma",
    specialtyKey: "trials",
    goalKey: "rwe-pv",
    title: {
      "zh-CN": "创新药上市后真实世界研究(RWE/ePRO)与NMPA药物警戒AE捕获智能体",
      "zh-TW": "創新藥上市後真實世界研究(RWE/ePRO)與NMPA藥物警戒AE捕獲智能體",
      en: "Biopharma Longitudinal RWE/ePRO & NMPA Pharmacovigilance AE Agent",
      ja: "新薬市販後RWE/ePRO縦断調査＆NMPA安全性情報（有害事象）収集エージェント",
    },
    summary: {
      "zh-CN":
        "严格遵循ICH-GCP与NMPA《药物警戒质量管理规范》(GVP)，在患者随访与援助项目(PAP)中自动识别潜在不良事件(AE/SAE)，采集四要素并24小时内触发PV医学审评。",
      "zh-TW":
        "嚴格遵循ICH-GCP與NMPA《藥物警戒質量管理規範》(GVP)，在患者隨訪與援助項目(PAP)中自動識別潛在不良事件(AE/SAE)，採集四要素並24小時內觸發PV醫學審評。",
      en: "Built for NMPA GVP & ICH-E2B(R3) compliance: captures longitudinal ePROs, detects spontaneous Adverse Events in real time, and routes structured ICSR drafts to PV safety physicians.",
      ja: "ICH-GCPおよびGVP基準に準拠し、患者報告アウトカム(ePRO)収集中の有害事象シグナルを即時検知・構造化して安全性管理部門へエスカレーションします。",
    },
    kpiHighlight: {
      "zh-CN": "潜在AE捕获完整率 99.94% · E2B(R3)报告提速 6.5倍",
      "zh-TW": "潛在AE捕獲完整率 99.94% · E2B(R3)報告提速 6.5倍",
      en: "99.94% AE signal capture · 6.5x faster E2B(R3) case intake",
      ja: "有害事象シグナル捕捉率99.94%・E2B(R3)起票速度6.5倍",
    },
    emrProtocol: "EDC / Medidata / ICH E2B(R3) XML 直通",
    activeSupervisors: 14,
    avgCallDuration: "4m 30s",
    sopSteps: {
      "zh-CN": [
        "按临床研究方案周期采集患者报告结局量表（EQ-5D / EORTC QLQ-C30）",
        "实时监听任何症状关键词（皮疹、腹泻、转氨酶升高、非预期住院），零遗漏启动GVP四要素核实",
        "若涉及SAE严重不良事件，秒级锁定时间戳并通知申办方PV安全官与研究中心PI",
        "全链路留存不可篡改声纹脱敏审计日志供NMPA核查",
      ],
      "zh-TW": [
        "按臨床研究方案週期採集患者報告結局量表（EQ-5D / EORTC QLQ-C30）",
        "實時監聽任何症狀關鍵詞（皮疹、腹瀉、轉氨酶升高、非預期住院），零遺漏啟動GVP四要素核實",
        "若涉及SAE嚴重不良事件，秒級鎖定時間戳並通知申辦方PV安全官與研究中心PI",
        "全鏈路留存不可篡改聲紋脫敏審計日誌供NMPA核查",
      ],
      en: [
        "Administer protocol-scheduled validated PRO instruments via natural voice",
        "Detect any AE mention (rash, GI toxicity, lab elevation, hospitalization) deterministically",
        "Collect 4 mandatory ICSR elements and alert PV physician & Principal Investigator immediately on SAE",
        "Maintain immutable, de-identified audit trail ready for NMPA/FDA inspection",
      ],
      ja: [
        "プロトコル規定周期でPRO尺度（EQ-5D等）を自然な対話で聴取",
        "発疹・下痢・検査値異常・予定外入院などのAE表現を確定的に検知",
        "重篤な有害事象(SAE)該当時は即座にPV責任者および治験責任医師へ通知",
        "規制当局査察に対応する改ざん不能な匿名化監査ログを完全保存",
      ],
    },
    sampleOpening: {
      "zh-CN": "“您好，我是靶向治疗患者关爱与随访专员小净，今天按研究第8周计划了解您的体力状态和皮肤反应……”",
      "zh-TW": "「您好，我是靶向治療患者關愛與隨訪專員小淨，今天按研究第8週計劃了解您的體力狀態和皮膚反應……」",
      en: "“Hello, calling from the Week-8 Oncology Patient Support & Study Follow-up team to record your comfort score and any side effects...”",
      ja: "「こんにちは、分子標的治療サポートプログラム第8週フォロー担当の小浄です。最近の体調や皮膚症状の有無について伺います…」",
    },
  },
  {
    id: "clinical-trial-crc-copilot",
    code: "AGT-LS-609",
    sector: "pharma",
    specialtyKey: "trials",
    goalKey: "nursing-time",
    title: {
      "zh-CN": "III期多中心临床试验受试者预筛与CRC研究护士协同智能体",
      "zh-TW": "III期多中心臨床試驗受試者預篩與CRC研究護士協同智能體",
      en: "Phase III Trial Pre-Screening & Study Coordinator (CRC) Co-Pilot",
      ja: "第III相多施設共同治験プレスクリーニング＆CRC支援エージェント",
    },
    summary: {
      "zh-CN":
        "协助全国多中心临床试验机构快速完成入排标准初步核对、受试者访视窗口期提醒与交通补贴指引，遇方案医学疑问无缝转接PI团队。",
      "zh-TW":
        "協助全國多中心臨床試驗機構快速完成入排標準初步核對、受試者訪視窗口期提醒與交通補貼指引，遇方案醫學疑問無縫轉接PI團隊。",
      en: "Accelerates inclusion/exclusion pre-screening across multicenter sites, coordinates protocol visit windows, and escalates clinical questions to the PI.",
      ja: "多施設共同治験における選択・除外基準の事前確認、規定来院ウィンドウの調整を行い、医学的質問は治験責任医師チームへ接続します。",
    },
    kpiHighlight: {
      "zh-CN": "受试者入组周期缩短 41% · 访视超窗率降至 1.2%",
      "zh-TW": "受試者入組週期縮短 41% · 訪視超窗率降至 1.2%",
      en: "41% faster enrollment · Protocol window deviation down to 1.2%",
      ja: "被験者登録期間を41%短縮・来院ウィンドウ逸脱率1.2%へ低減",
    },
    emrProtocol: "CTMS · 机构伦理委员会(IRB)批准话术锁",
    activeSupervisors: 12,
    avgCallDuration: "5m 10s",
    sopSteps: {
      "zh-CN": [
        "严格遵循伦理委员会(EC)获批脚本介绍临床研究背景与知情同意预约流程",
        "核对核心入排客观指标（既往治疗线数、合并用药洗脱期）",
        "锁定V1–V12访视±3天窗口期并协调空腹采血及影像评估排期",
        "受试者提出疗效预期或不良反应疑问时立即转交研究中心CRC与Sub-I医师",
      ],
      "zh-TW": [
        "嚴格遵循倫理委員會(EC)獲批腳本介紹臨床研究背景與知情同意預約流程",
        "核對核心入排客觀指標（既往治療線數、合併用藥洗脫期）",
        "鎖定V1–V12訪視±3天窗口期並協調空腹採血及影像評估排期",
        "受試者提出療效預期或不良反應疑問時立即轉交研究中心CRC與Sub-I醫師",
      ],
      en: [
        "Deliver IRB/EC-approved neutral study introduction without therapeutic inducement",
        "Pre-check objective eligibility criteria (prior lines, washout windows)",
        "Lock protocol visit windows (±3 days) with lab and imaging coordination",
        "Route medical or consent questions directly to Sub-Investigator and CRC",
      ],
      ja: [
        "治験審査委員会(IRB)承認スクリプトを厳守し中立的に治験概要を案内",
        "前治療歴やウォッシュアウト期間など客観的な適格基準を事前確認",
        "規定来院ウィンドウ（±3日）に合わせた採血・画像検査スケジュール調整",
        "有効性・リスクに関する医学的質問は直ちに分担医師・CRCへ引き継ぎ",
      ],
    },
    sampleOpening: {
      "zh-CN": "“孙先生您好，我是药物临床试验机构的协调助手小净，根据您在门诊留下的研究咨询意向，和您核对几项基础病史以便安排研究医生面谈……”",
      "zh-TW": "「孫先生您好，我是藥物臨床試驗機構的協調助手小淨，根據您在門診留下的研究諮詢意向，和您核對幾項基礎病史以便安排研究醫生面談……」",
      en: "“Hello Mr. Sun, calling from the Clinical Trial Center regarding your inquiry—let's review a few baseline history items to schedule your investigator consult...”",
      ja: "「孫様、治験管理センターの小浄です。外来でご希望いただいた臨床試験について、担当医面談の前にいくつか基礎歴を確認させてください…」",
    },
  },
  {
    id: "endocrinology-insulin-hypoglycemia-guard",
    code: "AGT-EN-305",
    sector: "provider",
    specialtyKey: "endocrinology",
    goalKey: "chronic-care",
    title: {
      "zh-CN": "2型糖尿病起始基础胰岛素出院随访与夜间低血糖防范路径",
      "zh-TW": "2型糖尿病起始基礎胰島素出院隨訪與夜間低血糖防範路徑",
      en: "Basal Insulin Initiation & Nocturnal Hypoglycemia Safety Pathway",
      ja: "2型糖尿病基礎インスリン導入退院後フォロー＆夜間低血糖予防パス",
    },
    summary: {
      "zh-CN":
        "针对首次启用胰岛素笔注射的出院患者，连续追踪空腹指尖血糖、注射部位轮换与冷汗心悸等低血糖先兆，严守非调量红线并将异常血糖曲线推送内分泌专科护师。",
      "zh-TW":
        "針對首次啟用胰島素筆注射的出院病患，連續追蹤空腹指尖血糖、注射部位輪換與冷汗心悸等低血糖先兆，嚴守非調量紅線並將異常血糖曲線推送內分泌專科護理師。",
      en: "Follows newly discharged basal-insulin patients to log fasting blood glucose, verify pen needle rotation, and screen for nocturnal hypoglycemia without unauthorized dose changes.",
      ja: "インスリン自己注射を新規導入した退院患者に対し、空腹時血糖・注射部位ローテーション・冷汗や動悸などの低血糖兆候を確認し、用量変更を行わず専門看護師へ連携します。",
    },
    kpiHighlight: {
      "zh-CN": "出院30天严重低血糖急诊下降 64% · 空腹血糖达标率提升 29%",
      "zh-TW": "出院30天嚴重低血糖急診下降 64% · 空腹血糖達標率提升 29%",
      en: "64% fewer hypoglycemia ED visits · +29% fasting glucose target attainment",
      ja: "退院後30日の重篤低血糖救急受診 -64%・空腹時血糖目標達成率 +29%",
    },
    emrProtocol: "HL7 FHIR R4 · 院内血糖管理中心(CDMS)直连",
    activeSupervisors: 18,
    avgCallDuration: "3m 50s",
    sopSteps: {
      "zh-CN": [
        "核对患者近3日晨起空腹血糖读数及胰岛素笔排气、捏皮注射规范",
        "主动排查夜间出冷汗、手抖、饥饿感或晨起头痛等隐匿性低血糖表现",
        "若血糖 < 3.9 mmol/L，指导患者按出院宣教卡补充15克快升糖食物并在1.6秒内并入值班糖尿病专科护师",
        "严禁系统自行给出胰岛素加减单位指令，全部血糖日志结构化回写内分泌随访门诊",
      ],
      "zh-TW": [
        "核對病患近3日晨起空腹血糖讀數及胰島素筆排氣、捏皮注射規範",
        "主動排查夜間出冷汗、手抖、飢餓感或晨起頭痛等隱匿性低血糖表現",
        "若血糖 < 3.9 mmol/L，指導病患依衛教卡補充15克糖分並於1.6秒內併入糖尿病衛教師",
        "嚴禁系統自行給出胰島素加減單位指令，全部血糖日誌回寫內分泌門診",
      ],
      en: [
        "Record 3-day fasting fingerstick glucose logs and verify pen priming & site rotation",
        "Screen specifically for nocturnal diaphoresis, tremor, or morning headache",
        "If glucose < 3.9 mmol/L, reinforce hospital rule-of-15 card and bridge diabetes educator RN in 1.6s",
        "Enforce hard lock against insulin unit titration; sync structured log to CDMS",
      ],
      ja: [
        "直近3日間の空腹時血糖値とインスリンペンの空打ち・注射手技を確認",
        "夜間の冷汗・手指振戦・起床時頭痛など無自覚低血糖の兆候を聴取",
        "血糖値 70 mg/dL 未満検知時は捕食手順を案内しつつ1.6秒で糖尿病療養指導士へ接続",
        "インスリン単位数の変更指示を厳格禁止し、構造化血糖記録をカルテへ格納",
      ],
    },
    sampleOpening: {
      "zh-CN": "“刘阿姨您好，我是内分泌科延续护理助手小净，您出院自己打甘精胰岛素满五天了，今天帮护士长记录一下您今早的空腹血糖数值……”",
      "zh-TW": "「劉阿姨您好，我是內分泌科延續護理助手小淨，您出院自己打甘精胰島素滿五天了，今天幫護理長記錄一下您今早的空腹血糖數值……」",
      en: "“Good morning Mrs. Liu, calling from Endocrinology Continuity Care—five days after starting your basal insulin pen, let's log this morning's fasting glucose...”",
      ja: "「劉様、内分泌内科の継続看護アシスタント小浄です。退院後のインスリン自己注射から5日目となりますが、今朝の空腹時血糖値を記録させてください…」",
    },
  },
  {
    id: "oncology-day-chemo-neutropenia",
    code: "AGT-ON-412",
    sector: "provider",
    specialtyKey: "oncology",
    goalKey: "readmission",
    title: {
      "zh-CN": "肿瘤日间化疗后第4/7/10天骨髓抑制与粒缺伴发热预警路径",
      "zh-TW": "腫瘤日間化療後第4/7/10天骨髓抑制與粒缺伴發熱預警路徑",
      en: "Day-Chemotherapy Post-Infusion Neutropenia & Febrile Triage Pathway",
      ja: "外来化学療法後4・7・10日目 骨髄抑制・発熱性好中球減少症(FN)早期検知パス",
    },
    summary: {
      "zh-CN":
        "针对日间病房完成化疗当日返家的实体瘤患者，在白细胞低谷窗口期定时核查体温、口腔溃疡、腹泻分级与社区血常规复查进度，防范粒细胞缺乏伴发热延误就诊。",
      "zh-TW":
        "針對日間病房完成化療當日返家的實體瘤病患，於白血球低谷窗口期定時核查體溫、口腔潰瘍、腹瀉分級與血常規複查進度，防範粒細胞缺乏伴發熱延誤就診。",
      en: "Monitors ambulatory chemotherapy patients across nadir days (Days 4, 7, 10) for fever >= 38.0°C, mucositis, CTCAE diarrhea grade, and local CBC lab completion.",
      ja: "外来化学療法後に帰宅した患者に対し、好中球減少ピーク期（4・7・10日目）の体温・口内炎・下痢グレード・採血結果を確認し、FNの重症化を防ぎます。",
    },
    kpiHighlight: {
      "zh-CN": "粒缺伴发热急诊重症率下降 46% · 血常规按期复查率 98.2%",
      "zh-TW": "粒缺伴發熱急診重症率下降 46% · 血常規按期複查率 98.2%",
      en: "46% reduction in septic FN admissions · 98.2% on-time nadir CBC completion",
      ja: "発熱性好中球減少症の重症救急搬送 -46%・規定日CBC採血実施率 98.2%",
    },
    emrProtocol: "HL7 FHIR R4 · CTCAE v5.0 不良反应分级回写",
    activeSupervisors: 24,
    avgCallDuration: "4m 05s",
    sopSteps: {
      "zh-CN": [
        "核对患者腋温/耳温实测值及化疗后第4、7天就近血常规（ANC绝对中性粒细胞计数）结果",
        "依据CTCAE v5.0标准评估恶心呕吐、口腔黏膜炎与腹泻每日次数",
        "一旦体温 ≥ 38.0℃ 或 ANC < 0.5×10⁹/L 伴寒战，立即1.6秒转接肿瘤日间值班护师开启绿色急诊通道",
        "温和提醒升白针（G-CSF）规范复诊时间，全程不擅自更改止吐或抗感染用药医嘱",
      ],
      "zh-TW": [
        "核對病患體溫實測值及化療後第4、7天血常規（ANC絕對嗜中性白血球計數）結果",
        "依據CTCAE v5.0標準評估噁心嘔吐、口腔黏膜炎與腹瀉每日次數",
        "一旦體溫 ≥ 38.0℃ 或 ANC < 0.5×10⁹/L 伴畏寒，立即1.6秒轉接腫瘤日間護理師開啟急診綠通",
        "溫和提醒升白針規範回診時間，全程不擅自更改止吐或抗感染醫囑",
      ],
      en: [
        "Verify measured oral/tympanic temperature and Day-4/7 local CBC absolute neutrophil count (ANC)",
        "Grade nausea, oral mucositis, and diarrhea frequency per CTCAE v5.0 criteria",
        "Trigger immediate 1.6s oncology triage RN bridge if T >= 38.0°C or ANC < 0.5 with chills",
        "Confirm scheduled G-CSF clinic appointments without altering antiemetic or antibiotic orders",
      ],
      ja: [
        "実測体温および4・7日目の近医採血データ（好中球数 ANC）を確認",
        "CTCAE v5.0基準に基づき悪心・口内炎・下痢回数を構造化聴取",
        "38.0℃以上の発熱または悪寒検知時は1.6秒で外来化学療法室看護師へ直通転送",
        "G-CSF投与予約のリマインドを行い、制吐剤や抗菌薬の独自指示は一切行わない",
      ],
    },
    sampleOpening: {
      "zh-CN": "“赵先生您好，我是肿瘤日间病房的随访助手小净，距离您周二输注化疗满四天了，今天重点询问一下您的体温和昨天查的血常规白细胞数值……”",
      "zh-TW": "「趙先生您好，我是腫瘤日間病房的隨訪助手小淨，距離您週二輸注化療滿四天了，今天重點詢問一下您的體溫和昨天查的血常規白血球數值……」",
      en: "“Hello Mr. Zhao, calling from the Ambulatory Oncology Unit four days after Tuesday's infusion—let's check your temperature today and yesterday's CBC white cell count...”",
      ja: "「趙様、外来化学療法室フォロー担当の小浄です。火曜日の点滴から4日目となりますが、本日の体温と昨日の採血での白血球数を確認させてください…」",
    },
  },
];
