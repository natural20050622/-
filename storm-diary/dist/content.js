export const vocabulary = {
  typhoon:['颱風','A strong storm with powerful winds.'], earthquake:['地震','A sudden shaking of the ground.'], prepare:['準備','Get ready for something.'], several:['數個的','More than two, but not many.'], clouds:['雲','Water drops floating in the sky.'], dozen:['一打（十二個）','Half a dozen means six.'], shaking:['搖晃','Moving back and forth.'], flooded:['淹沒','Covered with water.'], apartment:['公寓','A home in a building.'], drawer:['抽屜','A sliding box in a desk.'], cookies:['餅乾','Small, sweet baked snacks.'], angry:['生氣的','Feeling strong displeasure.'], abroad:['在國外','In or to another country.'], ourselves:['我們自己','The reflexive pronoun for we.'], shouting:['大聲呼喊','Speaking very loudly.'], shelves:['架子（複數）','Flat boards for holding things.'], serious:['嚴重的','Bad or needing attention.'], dangerous:['危險的','Likely to cause harm.'], scared:['害怕的','Feeling afraid.'], yourself:['你自己','The singular reflexive pronoun for you.'], myself:['我自己','The reflexive pronoun for I.'], covered:['遮住；覆蓋','Put something over something else.'], moment:['時刻','A short point in time.'], scene:['場景','A place or part of a story.']
};
export const chapters = {
  typhoon: {
    number:'01', title:'颱風教會我的事', scene:'風雨將至的午後', kicker:"ADAM'S APARTMENT", location:"TAIWAN · ADAM'S APARTMENT", weather:'☂ 颱風接近中', note:'有時候，讀懂一句提醒，<br>就能改變接下來的故事。',
    missions:[
      {id:'message',label:'Bella 的提醒',object:'手機',icon:'✉',time:'MONDAY · 星期一',title:'一則沒有被放在心上的訊息',point:[-2.35,1.35,1.1],camera:[7,7,9],
        text:['“Typhoon Mulan will hit land on Wednesday, Adam! You should prepare yourself. Make sure to get enough food and water for the next several days.”','When my friend Bella told me this on Monday, I wasn’t worried.'],
        zh:'「Adam，木蘭颱風星期三會登陸！你應該做好準備。確保準備好接下來幾天份的食物和水。」當我的朋友 Bella 在星期一這樣告訴我時，我並不擔心。',source:'閱讀課文 p.197 · 第一段',
        questions:[{kind:'找出證據',prompt:'Bella 提醒 Adam 準備什麼？',options:['接下來幾天的食物與水','前往國外旅行的機票','當晚去餐廳的訂位'],answer:0,evidence:0,explain:'Bella 說 “enough food and water for the next several days”。several days 是數天，不只是當天。'}, {kind:'反身代名詞',prompt:'Bella 對 Adam 一個人說：You should prepare ____.',options:['yourself','yourselves','myself'],answer:0,explain:'這裡的 you 指 Adam 一個人，所以使用 yourself。對多個人說話時才用 yourselves。'}]},
      {id:'supplies',label:'購物袋裡的線索',object:'購物袋',icon:'▱',time:'TUESDAY · 星期二',title:'他真的準備好了嗎？',point:[2.2,1.6,-1.3],camera:[8,6,8],
        text:['Even on Tuesday, when I saw dark clouds growing bigger in the gray sky, I still didn’t care.','“It can’t be that dangerous,” I told myself. I only bought some coffee and half a dozen eggs at the store.'],
        zh:'就算到了星期二，當我看見灰色天空中的烏雲越來越大時，我還是毫不在意。「不會那麼危險吧。」我對自己說。我只在商店買了一些咖啡和半打雞蛋。',source:'閱讀課文 p.197 · 第一段',
        questions:[{kind:'閱讀推論',prompt:'哪一項最能說明 Adam 輕忽了 Bella 的提醒？',options:['他買了足夠數天的食物和水','他只買了咖啡與六顆蛋','他請 Bella 幫忙準備物資'],answer:1,evidence:1,explain:'“only bought some coffee and half a dozen eggs” 是文字證據；half a dozen 就是六個。他的準備與 Bella 的提醒有落差。'},{kind:'感官動詞',prompt:'I saw dark clouds ____ bigger in the gray sky. 依課文強調正在發生的變化。',options:['grew','to grow','growing'],answer:2,explain:'感官動詞 saw＋受詞 dark clouds＋現在分詞 growing，描述看到雲正在變大。此句型也可接原形動詞，但本題依課文使用 growing。'}]},
      {id:'window',label:'窗外的風雨',object:'窗戶',icon:'≋',time:'WEDNESDAY · 星期三',title:'窗戶開始不停搖晃',point:[-1.6,2.9,-2.8],camera:[6,6,10],
        text:['On Wednesday afternoon, the typhoon was getting close! Then, it started to rain. I was scared when I heard the wind shaking my windows!','It was a long night. The heavy rain and strong winds didn’t stop.'],
        zh:'星期三下午，颱風漸漸接近了！接著開始下雨。當我聽見風把窗戶吹得不停震動時，我非常害怕！那是一個漫長的夜晚，大雨和強風一直沒有停歇。',source:'閱讀課文 p.197 · 第二段',
        questions:[{kind:'找出證據',prompt:'哪一句直接說明 Adam 為什麼害怕？',options:['It was a long night.','The typhoon was getting close!','I was scared when I heard the wind shaking my windows!'],answer:2,evidence:0,explain:'when 引出他害怕的情境：他聽見強風吹得窗戶搖晃。'},{kind:'感官動詞',prompt:'依教材感官動詞句型，選出正確的句子。',options:['I heard the wind shaking my windows.','I heard the wind to shake my windows.','I heard the wind shook my windows.'],answer:0,explain:'heard＋受詞 the wind＋現在分詞 shaking。感官動詞的這個句型不接 to shake 或過去式 shook。'}]},
      {id:'drawer',label:'最後的餅乾',object:'抽屜',icon:'▤',time:'THURSDAY · 星期四',title:'抽屜裡，剩下了什麼？',point:[2.25,1.1,1.6],camera:[8,6,8],
        text:['The next morning, I woke up and saw a terrible sight! To my surprise, the rain flooded the streets. What was worse, the power went out, and the restaurants near my apartment did not open.','I was on my own, and I had nothing to eat except some cookies in my drawer! I was not only hungry but also quite angry at myself for not listening to Bella! What a fool I was!'],
        zh:'隔天早上，我醒來看見可怕的景象！讓我驚訝的是，雨水淹沒了街道。更糟的是停電了，公寓附近的餐廳也沒有營業。我只能靠自己，除了抽屜裡幾片餅乾之外，沒有東西可吃！我不只餓，也對自己沒有聽 Bella 的話感到生氣。我真是個傻瓜！',source:'閱讀課文 p.197 · 第二段（依故事時間分段）',
        questions:[{kind:'因果理解',prompt:'Adam 最後為什麼對自己生氣？',options:['Bella 沒有提醒他','他沒聽 Bella 的勸告，也沒準備足夠食物','他的家人把餅乾吃完了'],answer:1,evidence:1,explain:'課文直接寫 “angry at myself for not listening to Bella”。餐廳沒開和停電，讓準備不足的後果變得明顯。'},{kind:'連接句型',prompt:'I was not only hungry ____ quite angry at myself.',options:['and only','but also','or also'],answer:1,explain:'not only… but also… 表示「不但……而且……」，這裡連接 hungry 和 quite angry 兩個形容詞片語。'}]}
    ]
  },
  earthquake:{
    number:'02',title:'那一刻，地板搖晃了',scene:'午餐時，一陣意外的搖晃',kicker:"BELLA'S MEMORY / BANGKOK",location:"BANGKOK · A FAMILY LUNCH",weather:'◉ 午後 1:00',note:'看見、聽見、感覺到。<br>讓英文連上你的感官。',
    missions:[
      {id:'family',label:'一起旅行的家人',object:'行李箱',icon:'▣',time:'BEFORE · 地震發生前',title:'她是一個人旅行嗎？',point:[-2.7,1.1,1.8],camera:[8,7,9],
        text:['Scott: Were you there by yourself?','Bella: Nope. I was there with my family. It was our first trip abroad together, and we were really enjoying ourselves.'],
        zh:'Scott：妳是一個人在那裡嗎？Bella：不是，我和我的家人在那裡。那是我們第一次一起出國旅行，而且我們真的玩得很開心。',source:'對話課文 p.192',
        questions:[{kind:'找出證據',prompt:'哪一項符合 Bella 的旅行情況？',options:['她獨自在曼谷','她和 Scott 一起出國','她和家人第一次一起出國'],answer:2,evidence:1,explain:'Bella 說 “with my family” 和 “our first trip abroad together”，可確認旅行同伴與「第一次」兩個資訊。'},{kind:'反身代名詞',prompt:'We were really enjoying ____.',options:['themselves','ourselves','yourselves'],answer:1,explain:'主詞是 we，反身代名詞用 ourselves。enjoy ourselves 表示「我們玩得很開心」。'}]},
      {id:'floor',label:'腳下的搖晃',object:'餐桌',icon:'≋',time:'1 P.M. · 午餐時刻',title:'先感覺到，接著聽見',point:[0,1.75,.4],camera:[7,6,9],
        text:['Bella: Well, the big one happened at about 1 p.m. We were having lunch right at that moment.','At first, I felt the floor shaking. Before I could say anything, I heard my brother shouting, “Earthquake! Earthquake!”'],
        zh:'Bella：那場大地震大約發生在下午一點，當時我們正在吃午餐。起初，我感覺到地板在搖晃。還沒來得及說話，就聽到哥哥大喊：「地震！地震！」',source:'對話課文 p.192',
        questions:[{kind:'時間順序',prompt:'依 Bella 的描述，哪一個順序正確？',options:['先感覺地板搖晃，接著聽到哥哥呼喊','先看到盤子掉落，接著開始吃午餐','先聽到 Scott 呼喊，接著出國旅行'],answer:0,evidence:1,explain:'At first 先引出地板搖晃，接著是 “I heard my brother shouting”。呼喊的人是哥哥，不是 Scott。'},{kind:'感官動詞',prompt:'I felt the floor ____. 選出符合本課句型的形式。',options:['to shake','shook','shaking'],answer:2,explain:'felt＋受詞 the floor＋現在分詞 shaking，表示感覺到地板正在搖晃。'}]},
      {id:'shelter',label:'桌下的那一刻',object:'桌下',icon:'⌂',time:'DURING · 地震當下',title:'燈光熄滅之前',point:[-.8,.65,1.8],camera:[7,5.5,10],
        text:['Bella: The floor was shaking not only back and forth but also up and down. We quickly hid under the table and covered our heads with our hands.','Then all the lights went out, and we heard someone shouting outside.'],
        zh:'Bella：地板不只前後搖晃，還上下震動。我們迅速躲到桌子底下，並用雙手遮住頭部。然後所有的燈都熄滅了，我們聽到有人在外面大聲叫喊。',source:'對話課文續頁 · 課文情境重現',
        questions:[{kind:'找出證據',prompt:'課文中，Bella 一家人躲在哪裡？',options:['電梯裡','桌子底下','餐具架旁'],answer:1,evidence:0,explain:'文字證據是 “hid under the table”。這項任務是在理解故事中的行動。'},{kind:'連接句型',prompt:'The floor was shaking not only back and forth ____ up and down.',options:['but also','because','so'],answer:0,explain:'not only… but also… 連接 back and forth（前後）與 up and down（上下），補充兩種搖晃方向。'}]},
      {id:'dishes',label:'掉落的盤子',object:'餐具架',icon:'◴',time:'AFTER · 回想發生的事',title:'一段她不想再演出的情節',point:[2.5,2.35,-2.1],camera:[8,6,8],
        text:['Bella: Even worse, we saw some dishes fall off the shelves. They broke into many pieces, and one piece cut my arm and knee. Luckily, it was nothing serious.','Scott: Man, that sounds like a scene from a movie.','Bella: Well, I don’t want to be the leading actress in a real-life earthquake ever again.'],
        zh:'Bella：更糟的是，我們看到一些盤子從架子上掉下來，摔成很多碎片，其中一片割傷我的手臂和膝蓋。幸好並不嚴重。Scott：那聽起來像電影情節。Bella：我可不想在真實生活中，再次成為地震事件的女主角。',source:'對話課文續頁',
        questions:[{kind:'閱讀理解',prompt:'關於 Bella 的受傷情形，哪一項正確？',options:['她被盤子碎片割傷，但並不嚴重','她沒有受任何傷','Scott 被餐桌割傷'],answer:0,evidence:0,explain:'“one piece cut my arm and knee” 說明傷勢來源；“nothing serious” 說明並不嚴重。'},{kind:'感官動詞',prompt:'We saw some dishes ____ off the shelves. 依課文選出正確形式。',options:['fell','to fall','fall'],answer:2,explain:'saw＋受詞 some dishes＋原形動詞 fall，描述看見盤子掉落的動作。感官動詞也可接 V-ing，但不能在這裡用 fell 或 to fall。'}]}
    ]
  }
};
