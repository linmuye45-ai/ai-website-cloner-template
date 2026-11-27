import type { Trait } from "./story";

export type LocalizedEnding = {
  title: string;
  treat: string;
  description: string;
  shareLine: string;
};
export type LocalizedChoice = { label: string; response: string };
export type LocalizedScene = {
  eyebrow: string;
  title: string;
  body: string;
  choices: Record<string, LocalizedChoice>;
};
export type LocalizedChapter = {
  title: string;
  subtitle: string;
  duration: string;
  scenes: LocalizedScene[];
  endings: Record<Trait, LocalizedEnding>;
};

const storyCopy: Record<string, Record<string, LocalizedChapter>> = {
  "en-US": {
    "tomorrow-cloud": {
      title: "The Tomorrow Cloud",
      subtitle: "A small thing that feels bigger after dark",
      duration: "3 min",
      scenes: [
        { eyebrow: "THE NIGHT WINDOW", title: "A cloud with a long list", body: "The cloud is no bigger than a teacup, but it carries a very long list. Blue ink has run into little rivers. KURU looks at the empty shelf by the window.", choices: {
          hold: { label: "Hold the cloud gently", response: "KURU cups the cloud in both paws. Its trembling slows, and a little warmth returns." },
          ask: { label: "Ask what it is protecting", response: "A tiny star peeks out from behind the list. The cloud has been keeping it safe from the wind." },
          shelf: { label: "Make room on the quiet shelf", response: "KURU clears one small space. The cloud finally lets out a breath." }
        }},
        { eyebrow: "THE PAPER STAIR", title: "One line keeps glowing", body: "Most of the list has faded. One line still glows: “Remember this tomorrow.” KURU cannot tell whether it is a reminder or a worry wearing a reminder’s coat.", choices: {
          fold: { label: "Fold the line into an envelope", response: "The words fit. They do not disappear; they simply stop filling the whole sky." },
          listen: { label: "Listen for the little star", response: "The star gives one quiet blink. Being remembered is not the same as being solved." },
          turn: { label: "Turn the paper toward the moon", response: "In the moonlight, the line looks smaller. It was written in a very large hand." }
        }},
        { eyebrow: "THE LAST BELL", title: "The cloud is ready to rest", body: "The station bell rings once. The cloud is lighter now. KURU can turn what remains into one small dream treat for the morning shelf.", choices: {
          warm: { label: "Warm it between two paws", response: "A soft golden glow settles in the middle of the cloud." },
          name: { label: "Give it a kinder name", response: "The cloud is no longer called “Everything”. It is called “One Thing, Later”." },
          rest: { label: "Let it rest without a label", response: "The cloud curls up on the shelf. Nothing asks it to explain itself." }
        }}
      ],
      endings: {
        tenderness: { title: "A Warm Little Pouch", treat: "A pocket of moon-warmth", description: "KURU folds the cloud into a soft oat-coloured pouch. One small thought can rest there until daylight.", shareLine: "Tonight, I gave one small worry a softer place to sit." },
        curiosity: { title: "The Little Lantern", treat: "A star with room to breathe", description: "The hidden star becomes a tiny lantern. It does not show the whole road; it makes the next step easier to see.", shareLine: "Tonight, I found a little light inside an ordinary worry." },
        patience: { title: "The Moon Envelope", treat: "A note for tomorrow", description: "The cloud becomes an envelope on the quiet shelf. Tomorrow can open it. Tonight does not have to.", shareLine: "Tonight, I put one unfinished thing somewhere safe for tomorrow." }
      }
    },
    "sour-star": {
      title: "The Sour Star",
      subtitle: "A star that forgot how to shine",
      duration: "3 min",
      scenes: [
        { eyebrow: "THE TEA ROOM", title: "A very sour star", body: "KURU lifts a star from the tea tin. It tastes of lemon peel and has been shining for everyone for so long that it has forgotten how to rest.", choices: {
          sip: { label: "Offer it warm milk", response: "The star takes one careful sip. Its light softens like a lamp behind a curtain." },
          why: { label: "Ask when it last rested", response: "The star counts the nights on its points, loses count, then laughs." },
          wait: { label: "Sit beside it in silence", response: "For a little while, nobody asks the star to sparkle. The room feels larger." }
        }},
        { eyebrow: "THE SUGAR DRAWER", title: "A brightness of its own", body: "Inside the drawer are a honey crumb, a blank label and a little bell. The star may choose what to carry into the next night.", choices: {
          honey: { label: "Share the honey crumb", response: "The star discovers that a small sweetness can be enough for one evening." },
          blank: { label: "Leave the label blank", response: "The star likes not having to explain its light." },
          bell: { label: "Keep the bell for later", response: "The bell can ring when the star is ready, not when the sky demands it." }
        }},
        { eyebrow: "THE WINDOW SEAT", title: "A smaller kind of shine", body: "The star climbs onto the window seat. The moon is not trying to outshine anything. KURU waits while the star chooses what kind of light feels right.", choices: {
          glow: { label: "Let it glow softly", response: "The star becomes a warm dot of light, easy to keep nearby." },
          wander: { label: "Let it explore the dark", response: "The star finds a constellation made of the spaces between things." },
          pause: { label: "Let it switch off for a moment", response: "The dark is kind. When the star returns, it is still itself." }
        }}
      ],
      endings: {
        tenderness: { title: "The Honey Star", treat: "A little sweetness, shared", description: "KURU makes a honey-glazed star with a soft, steady warmth. It is bright enough for the windowsill.", shareLine: "Tonight, I let a small light be enough." },
        curiosity: { title: "A New Constellation", treat: "A map made of quiet spaces", description: "The star finds a pattern no one has named. A different way of shining can still belong to the same sky.", shareLine: "Tonight, I found a new shape in the spaces between things." },
        patience: { title: "The Resting Bell", treat: "A bell that rings only when ready", description: "KURU hangs the bell beside the window. The star can ring it when it wants company. Silence is allowed, too.", shareLine: "Tonight, I remembered that rest is part of the rhythm." }
      }
    },
    "quiet-shelf": {
      title: "The Quiet Shelf",
      subtitle: "A place for things that are not finished",
      duration: "4 min",
      scenes: [
        { eyebrow: "THE BACK ROOM", title: "A shelf with no more room", body: "KURU opens the back room. Tiny boxes fill the shelf. None are dangerous; they are simply things that have not found their right time yet.", choices: {
          sort: { label: "Make room for each box", response: "KURU moves slowly. Every box gets a place, even if it is temporary." },
          open: { label: "Open one box together", response: "Inside is a paper boat. It has been waiting for a river, not an answer." },
          share: { label: "Ask which box wants company", response: "One box gives a tiny knock. It does not need fixing; it only wants company." }
        }},
        { eyebrow: "THE LABEL MAKER", title: "Not everything needs a deadline", body: "There are labels for “soon”, “later” and “not mine to carry”. One box has no label at all.", choices: {
          later: { label: "Choose “later” for now", response: "The box relaxes. “Later” turns out to be a real place, not a failure." },
          mine: { label: "Ask whether it belongs here", response: "The box is surprised. It has been carried from room to room without being asked." },
          near: { label: "Keep it near the warm lamp", response: "The box does not need to speak. It is enough to be kept with care." }
        }},
        { eyebrow: "THE MORNING DOOR", title: "One last thing to leave behind", body: "The first pale line of morning appears. KURU can carry one small thing into the new day, or leave the room exactly as it is.", choices: {
          carry: { label: "Carry one small box into morning", response: "KURU chooses one box, not the whole shelf. The day can begin with one thing." },
          leave: { label: "Leave the shelf as it is", response: "Nothing has to be finished before the door opens." },
          wave: { label: "Wave goodnight to every box", response: "The boxes seem less lonely. KURU switches off the lamp." }
        }}
      ],
      endings: {
        tenderness: { title: "The Company Box", treat: "A small box with two seats", description: "KURU leaves a warm place beside the lamp. Some things are easier to carry when they are not carried alone.", shareLine: "Tonight, I left a little room for company." },
        curiosity: { title: "The Paper Boat", treat: "A boat for one small tomorrow", description: "The paper boat finds a narrow ribbon of morning light. It only needs somewhere to begin.", shareLine: "Tonight, I let one small thing begin without knowing the whole way." },
        patience: { title: "The Quiet Shelf", treat: "A place that can wait", description: "The boxes are still there, but they no longer feel like a list of failures. They are simply things with their own time.", shareLine: "Tonight, I let unfinished things have their own time." }
      }
    }
  },
  "zh-CN": {
    "tomorrow-cloud": {
      title: "明日云朵", subtitle: "夜深之后，一件小事也会显得很大", duration: "3 分钟",
      scenes: [
        { eyebrow: "夜窗边", title: "带着长长清单的云", body: "这朵云只有茶杯那么大，却带来一张很长的清单。蓝色墨迹洇成细细的河流。KURU望向窗边空着的架子。", choices: {
          hold: { label: "轻轻托住云朵", response: "KURU用两只爪子托住云朵。它不再发抖，身上也渐渐有了暖意。" },
          ask: { label: "问问它在保护什么", response: "一颗小星星从清单后探出头来。原来云朵一直在替它挡风。" },
          shelf: { label: "在安静的架子上腾出位置", response: "KURU清出一小块地方。云朵终于长长地舒了一口气。" }
        }},
        { eyebrow: "纸阶梯", title: "有一行字仍在发光", body: "清单上的字大多已经淡去，只有一行还亮着：“明天记得这件事。”KURU分不清它是提醒，还是披着提醒外衣的担忧。", choices: {
          fold: { label: "把这行字折进信封", response: "字句被妥善收好。它们没有消失，只是不再占满整片天空。" },
          listen: { label: "听听小星星的声音", response: "小星星轻轻眨了一下眼。被记住，并不等于必须马上解决。" },
          turn: { label: "把纸转向月亮", response: "月光下，那行字显得小了一些。原来写字的人用力太大了。" }
        }},
        { eyebrow: "最后一声铃", title: "云朵准备休息了", body: "车站的铃响了一声。云朵已经轻了许多。KURU可以把剩下的部分做成一份小小的梦点心。", choices: {
          warm: { label: "放在两只爪子间暖一暖", response: "一团柔和的金色光芒在云朵中央亮了起来。" },
          name: { label: "给它取一个温柔的名字", response: "它不再叫“所有事情”，而叫“有一件事，明天再说”。" },
          rest: { label: "不贴标签，让它休息", response: "云朵蜷在架子上。终于没有人要求它解释自己。" }
        }}
      ],
      endings: {
        tenderness: { title: "暖暖的小布袋", treat: "一口月光般的温暖", description: "KURU把云朵折成柔软的燕麦色小布袋。一个小小的念头可以在里面安心待到天亮。", shareLine: "今晚，我给一件小小的烦恼找到了更柔软的位置。" },
        curiosity: { title: "小小灯笼", treat: "一颗可以自由呼吸的星星", description: "藏起来的小星星变成一盏灯笼。它照不亮整条路，却能让下一步更容易看清。", shareLine: "今晚，我在一件普通的烦恼里找到了一点光。" },
        patience: { title: "月亮信封", treat: "留给明天的一封信", description: "云朵变成信封，安静地留在架子上。明天可以打开它，今晚不必。", shareLine: "今晚，我把一件尚未完成的事放在了安全的地方，留给明天。" }
      }
    },
    "sour-star": {
      title: "酸涩的小星星", subtitle: "忘记了如何发光的星星", duration: "3 分钟",
      scenes: [
        { eyebrow: "茶水间", title: "一颗很酸的小星星", body: "KURU从茶叶罐里捧出一颗星星。它带着柠檬皮的酸味，已经为所有人发光太久，忘记了如何休息。", choices: {
          sip: { label: "给它一杯温牛奶", response: "星星小心地喝了一口，光芒变得柔和，像隔着窗帘的灯。" },
          why: { label: "问问它上次休息是什么时候", response: "星星数着自己尖角上的夜晚，数着数着就笑了。" },
          wait: { label: "安静地坐在它身边", response: "有一会儿，没有人要求星星闪耀。房间仿佛变宽了。" }
        }},
        { eyebrow: "糖罐抽屉", title: "属于自己的亮度", body: "抽屉里有一粒蜂蜜碎、一张空白标签和一只小铃铛。星星可以选择带什么进入下一个夜晚。", choices: {
          honey: { label: "和它分享蜂蜜碎", response: "星星发现，一点点甜就足够照亮一个晚上。" },
          blank: { label: "让标签保持空白", response: "星星喜欢不用解释自己的光。" },
          bell: { label: "把铃铛留到以后", response: "铃铛可以等星星准备好了再响，而不是听从天空的催促。" }
        }},
        { eyebrow: "窗边座位", title: "小一点的光也很好", body: "星星爬上窗台。月亮并不急着照亮一切。KURU等着星星选出自己喜欢的亮度。", choices: {
          glow: { label: "让它轻轻发光", response: "星星变成一粒温暖的光点，安静地陪在身边。" },
          wander: { label: "让它去黑暗里探索", response: "星星发现了一片由空隙组成的新星座。" },
          pause: { label: "让它暂时熄灭一会儿", response: "黑暗很温柔。星星再次亮起时，仍然是它自己。" }
        }}
      ],
      endings: {
        tenderness: { title: "蜂蜜星星", treat: "可以分享的一点甜", description: "KURU做出一颗蜂蜜星星，散发稳定而柔和的暖光。放在窗台上刚刚好。", shareLine: "今晚，我允许一盏小小的灯光就足够了。" },
        curiosity: { title: "新的星座", treat: "由安静空隙组成的地图", description: "星星找到了一种从未被命名的图案。不同的发光方式，也属于同一片天空。", shareLine: "今晚，我在事物之间的空隙里发现了新的形状。" },
        patience: { title: "休息铃铛", treat: "准备好时才会响的铃铛", description: "KURU把铃铛挂在窗边。星星想要陪伴时就摇一摇，保持安静也可以。", shareLine: "今晚，我想起休息也是节奏的一部分。" }
      }
    },
    "quiet-shelf": {
      title: "安静的架子", subtitle: "留给尚未完成之事的地方", duration: "4 分钟",
      scenes: [
        { eyebrow: "后面的房间", title: "已经放满的架子", body: "KURU打开后面的房间，架子上摆满了小盒子。它们并不危险，只是还没有等到合适的时机。", choices: {
          sort: { label: "为每个盒子腾出位置", response: "KURU慢慢整理。每个盒子都有了位置，即使只是暂时的。" },
          open: { label: "一起打开一个盒子", response: "里面是一只纸船。它等待的是一条河，而不是一个答案。" },
          share: { label: "问问哪个盒子想有人陪", response: "一个盒子轻轻敲了敲。它不需要被修好，只是想有人陪着。" }
        }},
        { eyebrow: "标签机", title: "不是每件事都需要期限", body: "这里有“很快”“以后”和“这不是我该背负的”三种标签。还有一个盒子，什么标签都没有。", choices: {
          later: { label: "暂时贴上“以后”", response: "盒子放松下来。“以后”原来是一个真实的位置，不是失败。" },
          mine: { label: "问问它是否属于这里", response: "盒子有些惊讶。它一直被从一个房间搬到另一个房间，却没人问过它。" },
          near: { label: "把它放在暖灯旁边", response: "盒子不必开口。被好好照看就已经足够。" }
        }},
        { eyebrow: "清晨的门", title: "最后留下一件小事", body: "清晨第一道淡淡的光出现了。KURU可以带走一件小东西，也可以让房间保持原样。", choices: {
          carry: { label: "带一个小盒子走进清晨", response: "KURU只选了一个盒子，而不是整排架子。新的一天可以从一件事开始。" },
          leave: { label: "让架子保持原样", response: "门打开之前，不必把所有事情都完成。" },
          wave: { label: "向每个盒子道一声晚安", response: "盒子们似乎不再那么孤单。KURU关掉了灯。" }
        }}
      ],
      endings: {
        tenderness: { title: "陪伴盒子", treat: "一只可以坐下两个人的小盒子", description: "KURU在灯旁留出一个温暖的位置。有些东西不必独自承担。", shareLine: "今晚，我为陪伴留出了一点空间。" },
        curiosity: { title: "纸船", treat: "驶向一个小小明天的船", description: "纸船遇见一缕细细的晨光。它不必知道整条河，只要找到出发的地方。", shareLine: "今晚，我允许一件小事在不知道全程时先开始。" },
        patience: { title: "安静的架子", treat: "一个可以慢慢等待的地方", description: "盒子仍然在那里，却不再像一张失败清单。它们只是有自己的时间。", shareLine: "今晚，我允许未完成的事拥有自己的时间。" }
      }
    }
  },
  "zh-TW": {
    "tomorrow-cloud": {
      title: "明日雲朵", subtitle: "夜深之後，一件小事也會顯得很大", duration: "3 分鐘",
      scenes: [
        { eyebrow: "夜窗邊", title: "帶著長長清單的雲", body: "這朵雲只有茶杯那麼大，卻帶來一張很長的清單。藍色墨水暈成細細的河流。KURU望向窗邊空著的架子。", choices: {
          hold: { label: "輕輕托住雲朵", response: "KURU用兩隻爪子托住雲朵。它不再發抖，身上也漸漸有了暖意。" },
          ask: { label: "問問它在保護什麼", response: "一顆小星星從清單後探出頭來。原來雲朵一直在替它擋風。" },
          shelf: { label: "在安靜的架子上騰出位置", response: "KURU清出一小塊地方。雲朵終於長長地舒了一口氣。" }
        }},
        { eyebrow: "紙階梯", title: "有一行字仍在發光", body: "清單上的字大多已經淡去，只有一行還亮著：「明天記得這件事。」KURU分不清它是提醒，還是披著提醒外衣的擔憂。", choices: {
          fold: { label: "把這行字摺進信封", response: "字句被妥善收好。它們沒有消失，只是不再佔滿整片天空。" },
          listen: { label: "聽聽小星星的聲音", response: "小星星輕輕眨了一下眼。被記住，並不等於必須馬上解決。" },
          turn: { label: "把紙轉向月亮", response: "月光下，那行字顯得小了一些。原來寫字的人用力太大了。" }
        }},
        { eyebrow: "最後一聲鈴", title: "雲朵準備休息了", body: "車站的鈴響了一聲。雲朵已經輕了許多。KURU可以把剩下的部分做成一份小小的夢點心。", choices: {
          warm: { label: "放在兩隻爪子間暖一暖", response: "一團柔和的金色光芒在雲朵中央亮了起來。" },
          name: { label: "給它取一個溫柔的名字", response: "它不再叫「所有事情」，而叫「有一件事，明天再說」。" },
          rest: { label: "不貼標籤，讓它休息", response: "雲朵蜷在架子上。終於沒有人要求它解釋自己。" }
        }}
      ],
      endings: {
        tenderness: { title: "暖暖的小布袋", treat: "一口月光般的溫暖", description: "KURU把雲朵摺成柔軟的燕麥色小布袋。一個小小的念頭可以在裡面安心待到天亮。", shareLine: "今晚，我為一件小小的煩惱找到了更柔軟的位置。" },
        curiosity: { title: "小小燈籠", treat: "一顆可以自由呼吸的星星", description: "藏起來的小星星變成一盞燈籠。它照不亮整條路，卻能讓下一步更容易看清。", shareLine: "今晚，我在一件普通的煩惱裡找到了一點光。" },
        patience: { title: "月亮信封", treat: "留給明天的一封信", description: "雲朵變成信封，安靜地留在架子上。明天可以打開它，今晚不必。", shareLine: "今晚，我把一件尚未完成的事放在安全的地方，留給明天。" }
      }
    },
    "sour-star": {
      title: "酸澀的小星星", subtitle: "忘記了如何發光的星星", duration: "3 分鐘",
      scenes: [
        { eyebrow: "茶水間", title: "一顆很酸的小星星", body: "KURU從茶葉罐裡捧出一顆星星。它帶著檸檬皮的酸味，已經為所有人發光太久，忘記了如何休息。", choices: {
          sip: { label: "給它一杯溫牛奶", response: "星星小心地喝了一口，光芒變得柔和，像隔著窗簾的燈。" },
          why: { label: "問問它上次休息是什麼時候", response: "星星數著自己尖角上的夜晚，數著數著就笑了。" },
          wait: { label: "安靜地坐在它身邊", response: "有一會兒，沒有人要求星星閃耀。房間彷彿變寬了。" }
        }},
        { eyebrow: "糖罐抽屜", title: "屬於自己的亮度", body: "抽屜裡有一粒蜂蜜碎、一張空白標籤和一只小鈴鐺。星星可以選擇帶什麼進入下一個夜晚。", choices: {
          honey: { label: "和它分享蜂蜜碎", response: "星星發現，一點點甜就足夠照亮一個晚上。" },
          blank: { label: "讓標籤保持空白", response: "星星喜歡不用解釋自己的光。" },
          bell: { label: "把鈴鐺留到以後", response: "鈴鐺可以等星星準備好了再響，而不是聽從天空的催促。" }
        }},
        { eyebrow: "窗邊座位", title: "小一點的光也很好", body: "星星爬上窗台。月亮並不急著照亮一切。KURU等著星星選出自己喜歡的亮度。", choices: {
          glow: { label: "讓它輕輕發光", response: "星星變成一粒溫暖的光點，安靜地陪在身邊。" },
          wander: { label: "讓它去黑暗裡探索", response: "星星發現了一片由空隙組成的新星座。" },
          pause: { label: "讓它暫時熄滅一會兒", response: "黑暗很溫柔。星星再次亮起時，仍然是它自己。" }
        }}
      ],
      endings: {
        tenderness: { title: "蜂蜜星星", treat: "可以分享的一點甜", description: "KURU做出一顆蜂蜜星星，散發穩定而柔和的暖光。放在窗台上剛剛好。", shareLine: "今晚，我允許一盞小小的燈光就足夠了。" },
        curiosity: { title: "新的星座", treat: "由安靜空隙組成的地圖", description: "星星找到了一種從未被命名的圖案。不同的發光方式，也屬於同一片天空。", shareLine: "今晚，我在事物之間的空隙裡發現了新的形狀。" },
        patience: { title: "休息鈴鐺", treat: "準備好時才會響的鈴鐺", description: "KURU把鈴鐺掛在窗邊。星星想要陪伴時就搖一搖，保持安靜也可以。", shareLine: "今晚，我想起休息也是節奏的一部分。" }
      }
    },
    "quiet-shelf": {
      title: "安靜的架子", subtitle: "留給尚未完成之事的地方", duration: "4 分鐘",
      scenes: [
        { eyebrow: "後面的房間", title: "已經放滿的架子", body: "KURU打開後面的房間，架子上擺滿了小盒子。它們並不危險，只是還沒有等到合適的時機。", choices: {
          sort: { label: "為每個盒子騰出位置", response: "KURU慢慢整理。每個盒子都有了位置，即使只是暫時的。" },
          open: { label: "一起打開一個盒子", response: "裡面是一艘紙船。它等待的是一條河，而不是一個答案。" },
          share: { label: "問問哪個盒子想有人陪", response: "一個盒子輕輕敲了敲。它不需要被修好，只是想有人陪著。" }
        }},
        { eyebrow: "標籤機", title: "不是每件事都需要期限", body: "這裡有「很快」、「以後」和「這不是我該背負的」三種標籤。還有一個盒子，什麼標籤都沒有。", choices: {
          later: { label: "暫時貼上「以後」", response: "盒子放鬆下來。「以後」原來是一個真實的位置，不是失敗。" },
          mine: { label: "問問它是否屬於這裡", response: "盒子有些驚訝。它一直被從一個房間搬到另一個房間，卻沒人問過它。" },
          near: { label: "把它放在暖燈旁邊", response: "盒子不必開口。被好好照看就已經足夠。" }
        }},
        { eyebrow: "清晨的門", title: "最後留下一件小事", body: "清晨第一道淡淡的光出現了。KURU可以帶走一件小東西，也可以讓房間保持原樣。", choices: {
          carry: { label: "帶一個小盒子走進清晨", response: "KURU只選了一個盒子，而不是整排架子。新的一天可以從一件事開始。" },
          leave: { label: "讓架子保持原樣", response: "門打開之前，不必把所有事情都完成。" },
          wave: { label: "向每個盒子道一聲晚安", response: "盒子們似乎不再那麼孤單。KURU關掉了燈。" }
        }}
      ],
      endings: {
        tenderness: { title: "陪伴盒子", treat: "一只可以坐下兩個人的小盒子", description: "KURU在燈旁留出一個溫暖的位置。有些東西不必獨自承擔。", shareLine: "今晚，我為陪伴留出了一點空間。" },
        curiosity: { title: "紙船", treat: "駛向一個小小明天的船", description: "紙船遇見一縷細細的晨光。它不必知道整條河，只要找到出發的地方。", shareLine: "今晚，我允許一件小事在不知道全程時先開始。" },
        patience: { title: "安靜的架子", treat: "一個可以慢慢等待的地方", description: "盒子仍然在那裡，卻不再像一張失敗清單。它們只是有自己的時間。", shareLine: "今晚，我允許未完成的事擁有自己的時間。" }
      }
    }
  },
  "ja-JP": {
    "tomorrow-cloud": {
      title: "あしたの雲", subtitle: "夜が深いと、小さなことも大きく見える", duration: "約3分",
      scenes: [
        { eyebrow: "夜の窓辺", title: "長いリストを持つ雲", body: "雲はティーカップほどの大きさなのに、とても長いリストを抱えていました。青いインクが小さな川のようににじんでいます。KURUは窓辺の空いた棚を見ました。", choices: {
          hold: { label: "雲をそっと抱える", response: "KURUが両手で雲を包むと、震えがゆっくり止まり、少し温かくなりました。" },
          ask: { label: "何を守っているのか聞く", response: "リストの後ろから小さな星が顔を出しました。雲は風から星を守っていたのです。" },
          shelf: { label: "静かな棚に場所を作る", response: "KURUが小さな場所を空けると、雲はやっと息を吐きました。" }
        }},
        { eyebrow: "紙の階段", title: "ひとつの行だけ光っている", body: "リストのほとんどは薄くなりました。それでも「明日、これを覚えておいて」という一行だけが光っています。KURUには、それが予定なのか、心配なのかわかりません。", choices: {
          fold: { label: "その一行を封筒に折りたたむ", response: "言葉は消えずに、空いっぱいを占めなくなりました。" },
          listen: { label: "小さな星の声を聞く", response: "星が静かに一度まばたきしました。覚えていることと、解決することは同じではありません。" },
          turn: { label: "紙を月のほうへ向ける", response: "月明かりの下で、その一行は少し小さく見えました。" }
        }},
        { eyebrow: "最後のベル", title: "雲は休む準備ができた", body: "駅のベルが一度鳴りました。雲はずいぶん軽くなっています。KURUは残ったものを小さな夢のおやつにできます。", choices: {
          warm: { label: "両手の間で温める", response: "雲の真ん中に、やわらかな金色の光が灯りました。" },
          name: { label: "やさしい名前をつける", response: "雲は「全部」ではなく、「ひとつだけ、また明日」と呼ばれるようになりました。" },
          rest: { label: "名前をつけずに休ませる", response: "雲は棚の上で丸くなりました。もう説明を求める人はいません。" }
        }}
      ],
      endings: {
        tenderness: { title: "あたたかな小袋", treat: "月明かりのぬくもり", description: "KURUは雲をやわらかな小袋に折りました。小さな考えを、朝まで安心して休ませられます。", shareLine: "今夜、小さな心配にやさしい居場所を作りました。" },
        curiosity: { title: "小さなランタン", treat: "息をする余白のある星", description: "隠れていた星は小さなランタンになりました。道全部ではなく、次の一歩を照らします。", shareLine: "今夜、ありふれた心配の中に小さな光を見つけました。" },
        patience: { title: "月の封筒", treat: "明日への手紙", description: "雲は封筒になり、静かな棚に置かれました。開くのは明日でいいのです。", shareLine: "今夜、終わっていないことを明日のためにそっと置きました。" }
      }
    },
    "sour-star": {
      title: "すっぱい星", subtitle: "輝き方を忘れてしまった星", duration: "約3分",
      scenes: [
        { eyebrow: "お茶の部屋", title: "とてもすっぱい星", body: "KURUは茶缶から星を取り出しました。レモンの皮のようにすっぱく、みんなのために長く輝きすぎて、休み方を忘れていました。", choices: {
          sip: { label: "温かいミルクをすすめる", response: "星が一口飲むと、光はカーテン越しのランプのようにやわらぎました。" },
          why: { label: "最後に休んだ日を聞く", response: "星は尖った先で夜を数え、途中でわからなくなって笑いました。" },
          wait: { label: "黙って隣に座る", response: "しばらく誰も星に輝くことを求めませんでした。部屋が広く感じられます。" }
        }},
        { eyebrow: "砂糖の引き出し", title: "自分らしい明るさ", body: "引き出しには蜂蜜のかけら、白紙のラベル、小さなベルがあります。星は次の夜へ持っていくものを選べます。", choices: {
          honey: { label: "蜂蜜を分け合う", response: "星は、小さな甘さだけで一晩を過ごせると知りました。" },
          blank: { label: "ラベルを空白のままにする", response: "星は自分の光を説明しなくていいことが気に入りました。" },
          bell: { label: "ベルはあとで使う", response: "ベルは空に急かされるのではなく、星の準備ができたら鳴ります。" }
        }},
        { eyebrow: "窓辺の席", title: "小さな光でもいい", body: "星は窓辺の席に登りました。月は誰かより明るくなろうとしていません。KURUは星が好きな光を選ぶのを待ちます。", choices: {
          glow: { label: "そっと光らせる", response: "星はそばに置いておける、温かな小さな光になりました。" },
          wander: { label: "暗闇を探検させる", response: "星は、ものとものの隙間でできた新しい星座を見つけました。" },
          pause: { label: "少しだけ消してみる", response: "暗闇はやさしいものでした。星はまた自分のまま戻ってきます。" }
        }}
      ],
      endings: {
        tenderness: { title: "蜂蜜の星", treat: "分け合える小さな甘さ", description: "KURUはやさしく温かな蜂蜜の星を作りました。窓辺に置くにはちょうどいい明るさです。", shareLine: "今夜、小さな光だけで十分だと思えました。" },
        curiosity: { title: "新しい星座", treat: "静かな隙間の地図", description: "星はまだ名前のない模様を見つけました。違う輝き方も、同じ空の一部です。", shareLine: "今夜、ものとものの隙間に新しい形を見つけました。" },
        patience: { title: "おやすみベル", treat: "準備ができたら鳴るベル", description: "KURUはベルを窓辺に掛けました。誰かがほしいときに鳴らせばいい。静かなままでも大丈夫です。", shareLine: "今夜、休むこともリズムの一部だと思い出しました。" }
      }
    },
    "quiet-shelf": {
      title: "静かな棚", subtitle: "まだ終わっていないものの居場所", duration: "約4分",
      scenes: [
        { eyebrow: "奥の部屋", title: "いっぱいになった棚", body: "KURUが奥の部屋を開けると、小さな箱が棚いっぱいに並んでいました。危険なものではありません。ただ、ちょうどいい時を待っています。", choices: {
          sort: { label: "箱ひとつずつに場所を作る", response: "KURUはゆっくり動きました。仮の場所でも、箱には居場所ができました。" },
          open: { label: "一緒に箱をひとつ開ける", response: "中には紙の船がありました。答えではなく、川を待っていたのです。" },
          share: { label: "誰かといたい箱を聞く", response: "ひとつの箱が小さくノックしました。直してほしいのではなく、そばにいてほしいのです。" }
        }},
        { eyebrow: "ラベルメーカー", title: "すべてに期限はいらない", body: "「すぐ」「あとで」「私が背負うことではない」というラベルがあります。ひとつだけ、何も貼られていない箱がありました。", choices: {
          later: { label: "ひとまず「あとで」を選ぶ", response: "箱はほっとしました。「あとで」は失敗ではなく、本当にある場所でした。" },
          mine: { label: "ここに置くものか聞く", response: "箱は驚きました。誰にも聞かれず、部屋から部屋へ運ばれていたのです。" },
          near: { label: "温かなランプのそばに置く", response: "箱は話さなくても大丈夫。大切に置いてもらえるだけで十分です。" }
        }},
        { eyebrow: "朝のドア", title: "最後にひとつ残すもの", body: "朝の淡い光が差し込みます。KURUは小さな箱をひとつ持っていくことも、部屋をそのままにすることもできます。", choices: {
          carry: { label: "小さな箱を朝へ連れていく", response: "KURUは棚全部ではなく、箱をひとつ選びました。新しい日はひとつのことから始められます。" },
          leave: { label: "棚をそのままにする", response: "ドアが開く前に、すべてを終わらせなくてもいいのです。" },
          wave: { label: "箱ひとつずつにおやすみを言う", response: "箱たちは少し寂しくなくなったようです。KURUはランプを消しました。" }
        }}
      ],
      endings: {
        tenderness: { title: "ふたりの箱", treat: "ふたり座れる小さな箱", description: "KURUはランプのそばに温かな場所を残しました。ひとりで抱えなくていいこともあります。", shareLine: "今夜、誰かといるための小さな場所を残しました。" },
        curiosity: { title: "紙の船", treat: "小さな明日へ向かう船", description: "紙の船は朝の光を見つけました。川全体を知らなくても、出発する場所があれば十分です。", shareLine: "今夜、道のすべてを知らなくても、小さな一歩を始めていいと思えました。" },
        patience: { title: "静かな棚", treat: "待つことのできる場所", description: "箱はまだそこにあります。でも、失敗のリストには見えません。それぞれの時間を持つものになりました。", shareLine: "今夜、終わっていないものにも、それぞれの時間を許しました。" }
      }
    }
  },
  "ko-KR": {
    "tomorrow-cloud": {
      title: "내일의 구름", subtitle: "밤이 깊으면 작은 일도 크게 느껴져요", duration: "약 3분",
      scenes: [
        { eyebrow: "밤의 창가", title: "긴 목록을 가져온 구름", body: "구름은 찻잔만큼 작지만 아주 긴 목록을 들고 왔어요. 파란 잉크가 작은 강처럼 번졌죠. KURU는 창가의 빈 선반을 바라봤어요.", choices: {
          hold: { label: "구름을 다정하게 안아 주기", response: "KURU가 두 손으로 구름을 감싸자 떨림이 잦아들고 온기가 돌아왔어요." },
          ask: { label: "무엇을 지키고 있는지 묻기", response: "목록 뒤에서 작은 별이 얼굴을 내밀었어요. 구름은 바람으로부터 별을 지켜 주고 있었어요." },
          shelf: { label: "조용한 선반에 자리를 만들기", response: "KURU가 작은 자리를 비워 주자 구름은 길게 숨을 내쉬었어요." }
        }},
        { eyebrow: "종이 계단", title: "한 줄만 계속 빛나요", body: "목록의 글씨는 대부분 희미해졌어요. 하지만 “내일 이 일을 기억해 줘”라는 한 줄은 여전히 빛났죠. KURU는 그것이 알림인지 걱정인지 알 수 없었어요.", choices: {
          fold: { label: "그 문장을 봉투에 접어 넣기", response: "말은 사라지지 않았어요. 다만 하늘 전체를 차지하지 않게 되었죠." },
          listen: { label: "작은 별의 이야기를 듣기", response: "별이 조용히 한 번 깜박였어요. 기억하는 것과 해결하는 것은 같은 일이 아니에요." },
          turn: { label: "종이를 달빛 쪽으로 돌리기", response: "달빛 아래에서 그 문장은 조금 작아 보였어요." }
        }},
        { eyebrow: "마지막 종소리", title: "구름은 쉴 준비가 됐어요", body: "역의 종이 한 번 울렸어요. 구름은 한결 가벼워졌죠. KURU는 남은 것을 작은 꿈 간식으로 만들 수 있어요.", choices: {
          warm: { label: "두 손 사이에서 따뜻하게 데우기", response: "구름 한가운데 부드러운 금빛이 피어났어요." },
          name: { label: "더 다정한 이름 붙이기", response: "구름은 더 이상 “모든 것”이 아니에요. “한 가지, 내일 다시”가 되었죠." },
          rest: { label: "이름표 없이 쉬게 두기", response: "구름은 선반 위에서 몸을 말았어요. 이제 설명하라고 하는 사람은 없어요." }
        }}
      ],
      endings: {
        tenderness: { title: "따뜻한 작은 주머니", treat: "달빛 같은 온기 한 줌", description: "KURU는 구름을 부드러운 작은 주머니로 접었어요. 작은 생각 하나가 아침까지 편히 쉴 수 있어요.", shareLine: "오늘 밤, 작은 걱정에게 더 부드러운 자리를 내어 주었어요." },
        curiosity: { title: "작은 등불", treat: "숨 쉴 틈이 있는 별", description: "숨어 있던 별은 작은 등불이 되었어요. 길 전체가 아니라 다음 한 걸음을 비춰 줘요.", shareLine: "오늘 밤, 평범한 걱정 속에서 작은 빛을 발견했어요." },
        patience: { title: "달빛 봉투", treat: "내일을 위한 편지", description: "구름은 봉투가 되어 조용한 선반에 놓였어요. 여는 일은 내일 해도 괜찮아요.", shareLine: "오늘 밤, 끝내지 못한 일을 안전한 곳에 두고 내일로 남겨 두었어요." }
      }
    },
    "sour-star": {
      title: "새콤한 별", subtitle: "빛나는 법을 잊어버린 별", duration: "약 3분",
      scenes: [
        { eyebrow: "차를 마시는 방", title: "아주 새콤한 별", body: "KURU는 찻통에서 별 하나를 꺼냈어요. 레몬 껍질처럼 새콤한 별은 모두를 위해 너무 오래 빛나느라 쉬는 법을 잊었어요.", choices: {
          sip: { label: "따뜻한 우유 건네기", response: "별이 조심스럽게 한 모금 마시자 빛이 커튼 뒤의 등불처럼 부드러워졌어요." },
          why: { label: "마지막으로 쉰 날을 묻기", response: "별은 뾰족한 끝으로 밤을 세다가 숫자를 잊고 웃었어요." },
          wait: { label: "말없이 곁에 앉기", response: "잠시 동안 아무도 별에게 반짝이라고 하지 않았어요. 방이 더 넓어진 것 같았죠." }
        }},
        { eyebrow: "설탕 서랍", title: "나만의 밝기", body: "서랍에는 꿀 부스러기, 빈 이름표, 작은 종이 있어요. 별은 다음 밤에 무엇을 가져갈지 고를 수 있어요.", choices: {
          honey: { label: "꿀 부스러기 나누기", response: "별은 작은 달콤함 하나로도 저녁을 보낼 수 있다는 걸 알게 되었어요." },
          blank: { label: "이름표를 비워 두기", response: "별은 자기 빛을 설명하지 않아도 되는 게 좋았어요." },
          bell: { label: "종은 나중에 쓰기", response: "종은 하늘이 재촉할 때가 아니라 별이 준비되었을 때 울려요." }
        }},
        { eyebrow: "창가 자리", title: "작은 빛도 괜찮아요", body: "별은 창가 자리에 올라갔어요. 달은 누구보다 밝아지려고 하지 않아요. KURU는 별이 편한 빛을 고르도록 기다려요.", choices: {
          glow: { label: "은은하게 빛나게 두기", response: "별은 곁에 두기 좋은 따뜻한 작은 빛이 되었어요." },
          wander: { label: "어둠을 탐험하게 두기", response: "별은 사물 사이의 여백으로 이루어진 새로운 별자리를 찾았어요." },
          pause: { label: "잠깐 꺼져 있게 두기", response: "어둠은 다정했어요. 별은 다시 자기 모습으로 돌아왔어요." }
        }}
      ],
      endings: {
        tenderness: { title: "꿀 별", treat: "함께 나누는 작은 달콤함", description: "KURU는 부드럽고 따뜻한 꿀 별을 만들었어요. 창가에 두기에 딱 알맞은 빛이에요.", shareLine: "오늘 밤, 작은 빛 하나면 충분하다고 느꼈어요." },
        curiosity: { title: "새로운 별자리", treat: "고요한 틈으로 만든 지도", description: "별은 아직 이름 붙지 않은 무늬를 찾았어요. 다른 방식으로 빛나도 같은 하늘에 속해요.", shareLine: "오늘 밤, 사물 사이의 틈에서 새로운 모양을 발견했어요." },
        patience: { title: "쉬는 종", treat: "준비되면 울리는 작은 종", description: "KURU는 종을 창가에 걸었어요. 별이 누군가를 원할 때 울리면 돼요. 조용히 있어도 괜찮아요.", shareLine: "오늘 밤, 쉼도 리듬의 일부라는 걸 기억했어요." }
      }
    },
    "quiet-shelf": {
      title: "조용한 선반", subtitle: "아직 끝나지 않은 것들을 위한 자리", duration: "약 4분",
      scenes: [
        { eyebrow: "안쪽 방", title: "더는 자리가 없는 선반", body: "KURU가 안쪽 방을 열자 작은 상자들이 선반을 가득 채우고 있었어요. 위험한 것은 없어요. 그저 알맞은 때를 기다리는 것들이에요.", choices: {
          sort: { label: "상자마다 자리를 마련하기", response: "KURU는 천천히 움직였어요. 임시 자리라도 모든 상자에게 자리가 생겼죠." },
          open: { label: "상자 하나를 함께 열기", response: "안에는 종이배가 있었어요. 답이 아니라 강을 기다리고 있었죠." },
          share: { label: "누가 곁을 원할지 묻기", response: "상자 하나가 작게 두드렸어요. 고쳐 달라는 게 아니라 곁에 있어 달라는 뜻이에요." }
        }},
        { eyebrow: "이름표 만드는 곳", title: "모든 일에 마감이 필요한 건 아니에요", body: "“곧”, “나중에”, “내가 짊어질 일이 아니야”라는 이름표가 있어요. 이름표가 하나도 없는 상자도 있죠.", choices: {
          later: { label: "일단 “나중에”를 고르기", response: "상자는 안심했어요. “나중에”는 실패가 아니라 실제로 존재하는 자리였어요." },
          mine: { label: "여기에 있어도 되는지 묻기", response: "상자는 놀랐어요. 누구도 묻지 않은 채 방에서 방으로 옮겨 다녔거든요." },
          near: { label: "따뜻한 등불 옆에 두기", response: "상자는 말하지 않아도 괜찮아요. 잘 보살펴 주는 것만으로 충분해요." }
        }},
        { eyebrow: "아침의 문", title: "마지막으로 남길 한 가지", body: "아침의 옅은 빛이 들어와요. KURU는 작은 상자 하나를 가져가거나 방을 그대로 둘 수 있어요.", choices: {
          carry: { label: "작은 상자 하나를 아침으로 가져가기", response: "KURU는 선반 전체가 아니라 상자 하나를 골랐어요. 새로운 하루는 한 가지 일부터 시작할 수 있어요." },
          leave: { label: "선반을 그대로 두기", response: "문이 열리기 전에 모든 일을 끝낼 필요는 없어요." },
          wave: { label: "모든 상자에 잘 자라고 인사하기", response: "상자들이 조금 덜 외로워 보여요. KURU는 불을 껐어요." }
        }}
      ],
      endings: {
        tenderness: { title: "함께하는 상자", treat: "두 사람이 앉을 수 있는 작은 상자", description: "KURU는 등불 옆에 따뜻한 자리를 남겨 두었어요. 혼자 짊어지지 않아도 되는 일도 있어요.", shareLine: "오늘 밤, 누군가와 함께할 작은 자리를 남겨 두었어요." },
        curiosity: { title: "종이배", treat: "작은 내일로 향하는 배", description: "종이배는 아침 햇살 한 줄기를 만났어요. 강 전체를 몰라도 출발할 곳만 있으면 돼요.", shareLine: "오늘 밤, 길 전체를 몰라도 작은 시작을 해도 된다고 느꼈어요." },
        patience: { title: "조용한 선반", treat: "기다릴 수 있는 자리", description: "상자들은 여전히 그곳에 있어요. 하지만 실패의 목록처럼 보이지 않아요. 각자의 시간이 있을 뿐이에요.", shareLine: "오늘 밤, 끝나지 않은 일에도 각자의 시간이 있음을 허락했어요." }
      }
    }
  }
};

export function getStoryCopy(locale: string, chapterId: string): LocalizedChapter {
  return storyCopy[locale]?.[chapterId] ?? storyCopy["en-US"][chapterId];
}

export function getEndingTrait(chapterId: string, endingId: string): Trait {
  const chapter = storyCopy["en-US"][chapterId];
  if (!chapter) return "tenderness";
  return (Object.keys(chapter.endings) as Trait[]).find((trait) => {
    const ids: Record<string, Record<Trait, string>> = {
      "tomorrow-cloud": { tenderness: "warm-pouch", curiosity: "little-lantern", patience: "moon-envelope" },
      "sour-star": { tenderness: "honey-star", curiosity: "new-constellation", patience: "resting-bell" },
      "quiet-shelf": { tenderness: "company-box", curiosity: "paper-boat", patience: "quiet-shelf-treat" }
    };
    return ids[chapterId]?.[trait] === endingId;
  }) ?? "tenderness";
}
