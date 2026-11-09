/* 《氧心殿》題庫：每一局依亂數（S.seed）重新出題，玩第二次不會一樣。
   ── 兩種題目 ──
   1. 活性類（排順序、會不會反應、推理表、誰說謊…）：每局從 15 個元素隨機挑組合，答案由程式依講義 p.5 活性順序計算。
   2. 觀念類（定義、漂白、抗氧化…）：每題準備 2～4 種問法，每局隨機抽一種。
   題目欄位：type single 單選／multi 複選／order 排順序／match 每列選一個／grid 填＋－表
   answer：single 填正確選項文字；multi、order 填陣列；match 每列 ans；grid ans 陣列。
   fig：題圖代號（figs.js）；figSvg：程式現場畫的題圖。
   題號（q0_1…）與配分固定，所以每一局滿分一樣（550）。
   舊的固定題版本備份在 _測試/questions_v0.2_固定題備份.js */
'use strict';
(function(root){
const isNode = typeof module !== 'undefined';
const EL = isNode ? require('./elements.js') : { ELEMENTS, ORDER };
const E = EL.ELEMENTS, ORD = EL.ORDER;
const FG = isNode ? require('./figs.js') : { tableSvg: (...a) => root.tableSvg(...a) };
const CR = isNode ? require('./core.js') : root.CORE;
const more = (a, b) => E[a].rank < E[b].rank;
const zh = k => E[k].zh;

/* ---- 固定亂數工具 ---- */
/* 先把種子充分攪亂（相鄰的種子才不會出很像的題） */
function mix(x){ x = x >>> 0; x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; }
function rng(seed){ let h = mix(seed) || 1; return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; }
function hashStr(s){ let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
function shuffle(r, a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const sample = (r, a, n) => shuffle(r, a).slice(0, n);
const byAct = arr => arr.slice().sort((a, b) => E[a].rank - E[b].rank);
const seriesText = arr => byAct(arr).map(zh).join('＞');
/* 氧化物化學式：把元素符號換成代號（例：Al₂O₃ → 甲₂O₃） */
const oxWith = (k, sym) => E[k].ox.replace(k, sym);

/* ================== 觀念類：每題多種問法 ================== */
const V = {
q0_1: [
  { type:'single', prompt:'《氧篇》第一條：「與氧結合」就是氧化。第二條說，氧化也可以是——',
    options:['失去電子，價數升高','得到電子，價數降低','失去氧，價數降低','得到質子，價數不變'], answer:'失去電子，價數升高' },
  { type:'single', prompt:'硫女官：「從電子來看，物質發生氧化時——」',
    options:['失去電子，價數升高','得到電子，價數升高','得到電子，價數降低','電子數不變，價數降低'], answer:'失去電子，價數升高' },
  { type:'single', prompt:'硫女官：「下列哪一個『不是』氧化的定義？」',
    options:['失去氧，價數降低','與氧結合','失去電子','價數升高'], answer:'失去氧，價數降低' },
],
q0_2: [
  { type:'single', prompt:'元素燃燒，例如「碳＋氧 → 二氧化碳」，屬於哪一種化學反應？', options:['化合反應','分解反應','置換反應','酸鹼中和'], answer:'化合反應' },
  { type:'single', prompt:'燃燒、生鏽這類「和氧結合」的反應，通常會——', options:['放出熱量','吸收熱量','不吸熱也不放熱','先吸熱再吸更多熱'], answer:'放出熱量' },
  { type:'single', prompt:'「鎂＋氧 → 氧化鎂」：兩種物質結合成一種，這叫做——', options:['化合反應','分解反應','置換反應','物理變化'], answer:'化合反應' },
],
q0_4: [
  { type:'single', prompt:'硫女官：「最後一題。何者『不』屬於氧化反應？」', options:['光合作用','鐵生鏽','呼吸作用','蠟燭燃燒'], answer:'光合作用', hint:'哪一個是「放出」氧氣，而不是和氧結合？' },
  { type:'single', prompt:'硫女官：「最後一題。下列哪一個會『放出』氧氣，而不是和氧結合？」', options:['光合作用','呼吸作用','木炭燃燒','食物腐敗'], answer:'光合作用' },
  { type:'single', prompt:'硫女官：「最後一題。何者不屬於氧化反應？」', options:['光合作用','人體新陳代謝','切開的蘋果變褐色','鐵生鏽'], answer:'光合作用' },
],
q1_4: [
  { type:'single', prompt:'銅被加熱後慢慢變黑。這層黑色的東西是——', options:['氧化銅','碳粉','煤灰','綠色銅鏽'], answer:'氧化銅' },
  { type:'single', prompt:'銅加熱後沒有火焰，只是表面變黑。這代表銅——', options:['和氧結合成黑色的氧化銅','被燒成了碳','沾到了煙灰','變成了別的金屬'], answer:'和氧結合成黑色的氧化銅' },
],
q1_8: [
  { type:'multi', prompt:'有兩{宮}的茶葉泡了半天，茶色都沒出來（氧化物難溶於水）。是哪兩{宮}？',
    options:['鋅{宮}（氧化鋅）','銅{宮}（氧化銅）','鈉{宮}（氧化鈉）','鎂{宮}（氧化鎂）'], answer:['鋅{宮}（氧化鋅）','銅{宮}（氧化銅）'] },
  { type:'multi', prompt:'哪幾{宮}的氧化物「可以」溶在水裡泡成茶？',
    options:['鈉{宮}（氧化鈉）','鎂{宮}（氧化鎂）','鋅{宮}（氧化鋅）','銅{宮}（氧化銅）'], answer:['鈉{宮}（氧化鈉）','鎂{宮}（氧化鎂）'] },
],
q3_3: [
  { type:'single', prompt:'碳也從銅那裡把氧搶走：碳 ＋ 氧化銅 → ？', options:['銅 ＋ 二氧化碳','氧化碳銅','不反應','銅 ＋ 氧'], answer:'銅 ＋ 二氧化碳' },
  { type:'single', prompt:'「碳 ＋ 氧化銅 → 銅 ＋ 二氧化碳」裡，碳擔任什麼角色？', options:['還原劑','氧化劑','產物','催化劑'], answer:'還原劑' },
  { type:'single', prompt:'「碳 ＋ 氧化銅 → 銅 ＋ 二氧化碳」裡，哪一個發生了還原反應（失去氧）？', options:['氧化銅','碳','銅','二氧化碳'], answer:'氧化銅' },
],
q3_4: [
  { type:'single', prompt:'銅去鎂的{宮}裡爭（銅 ＋ 氧化鎂），結果被當眾羞辱。為什麼？',
    options:['銅的活性比鎂小，搶不走氧化鎂裡的氧','銅的活性比鎂大，但鎂不肯','氧化鎂不溶於水','銅沒有被加熱'], answer:'銅的活性比鎂小，搶不走氧化鎂裡的氧' },
  { type:'single', prompt:'銅 ＋ 氧化鎂 會不會反應？',
    options:['不會，鎂比銅活潑','會，產生氧化銅和鎂','會，產生銅鏽','不會，因為兩個都是金屬'], answer:'不會，鎂比銅活潑' },
],
q3_5: [
  { type:'single', prompt:'同一晚，鐵去挑戰碳（鐵 ＋ 二氧化碳）。結果呢？', options:['不會反應，鐵的活性比碳小','會反應，產生氧化鐵和碳','會反應，產生鐵鏽','會爆炸'], answer:'不會反應，鐵的活性比碳小' },
  { type:'single', prompt:'鐵想從碳那裡把氧搶走，失敗了。下列敘述何者正確？', options:['碳比鐵活潑，二氧化碳裡的氧搶不走','鐵比碳活潑，只是沒加熱','二氧化碳是氣體所以搶不到','鐵已經生鏽了'], answer:'碳比鐵活潑，二氧化碳裡的氧搶不走' },
],
q3_6: [
  { type:'single', prompt:'鋅搬進了「硫酸銅{宮}」：鋅 ＋ 硫酸銅 → ？（講義延伸）', options:['硫酸鋅 ＋ 銅','不反應','氧化鋅 ＋ 硫','硫酸 ＋ 鋅銅'], answer:'硫酸鋅 ＋ 銅' },
  { type:'single', prompt:'鋅能把銅從硫酸銅裡「趕出來」（講義延伸），是因為——', options:['鋅的活性比銅大','銅的活性比鋅大','硫酸銅是藍色的','鋅比較重'], answer:'鋅的活性比銅大' },
],
q3_7: [
  { type:'single', prompt:'銅想把[[宮殿||房間]]搶回來：銅 ＋ 硫酸鋅 → ？（講義延伸）', options:['不會反應','硫酸銅 ＋ 鋅','氧化銅 ＋ 硫','銅變成金'], answer:'不會反應' },
  { type:'single', prompt:'把銅片放進硫酸鋅溶液裡，會發生什麼事？（講義延伸）', options:['沒有變化','銅片表面長出鋅','溶液變藍色','銅片溶解消失'], answer:'沒有變化' },
],
q3_8: [
  { type:'single', prompt:'「活性大的把活性小的從化合物中取代出來」——這種反應叫做？', options:['置換反應','化合反應','分解反應','中和反應'], answer:'置換反應' },
  { type:'single', prompt:'下列哪一個是「置換反應」？', options:['碳 ＋ 氧化銅 → 銅 ＋ 二氧化碳','碳 ＋ 氧 → 二氧化碳','水 → 氫 ＋ 氧','冰 → 水'], answer:'碳 ＋ 氧化銅 → 銅 ＋ 二氧化碳' },
],
q4_1: [
  { type:'single', prompt:'鎂在二氧化碳中繼續燃燒：鎂 ＋ 二氧化碳 → ？', options:['氧化鎂 ＋ 碳','不反應','碳酸鎂','氧化鎂 ＋ 氧'], answer:'氧化鎂 ＋ 碳' },
  { type:'single', prompt:'鎂在二氧化碳裡燃燒時，鎂擔任什麼角色？', options:['還原劑','氧化劑','滅火劑','產物'], answer:'還原劑' },
],
q4_2: [
  { type:'single', prompt:'火場地上那片黑色碳粒，是從哪裡來的？', options:['鎂從二氧化碳中搶走氧，留下來的碳','有人帶木炭來縱火','燭臺燒焦的灰','碳{小主}掉的衣角'], answer:'鎂從二氧化碳中搶走氧，留下來的碳' },
  { type:'single', prompt:'為什麼「現場有碳粒」不能證明是碳{小主}縱火？', options:['碳粒是鎂和二氧化碳反應產生的','碳粒是燭火的煙','碳粒本來就在地上','碳不會燃燒'], answer:'碳粒是鎂和二氧化碳反應產生的' },
],
q4_3: [
  { type:'single', prompt:'在「鎂＋二氧化碳」這場反應中，二氧化碳發生了什麼反應？', options:['還原反應','氧化反應','燃燒反應','分解反應'], answer:'還原反應' },
  { type:'single', prompt:'在「鎂＋二氧化碳」這場反應中，誰是氧化劑？', options:['二氧化碳','鎂','氧化鎂','碳'], answer:'二氧化碳' },
  { type:'single', prompt:'在「鎂＋二氧化碳」這場反應中，鎂發生了什麼反應？', options:['氧化反應','還原反應','分解反應','沒有反應'], answer:'氧化反應' },
],
q4_5: [
  { type:'single', prompt:'火越噴越旺！現在該怎麼辦？', options:['改用沙土覆蓋，隔絕空氣','繼續噴二氧化碳','用扇子搧','打開門窗讓風進來'], answer:'改用沙土覆蓋，隔絕空氣' },
  { type:'single', prompt:'鎂燃燒起火時，下列哪個做法最適當？', options:['用沙土覆蓋','用二氧化碳滅火器','打開窗戶通風','在旁邊搧風'], answer:'用沙土覆蓋' },
],
q6_1: [
  { type:'single', prompt:'工匠說：「這些紅褐色的石頭裡有鐵。」金屬礦大多是什麼？', options:['金屬的氧化物','純金屬','金屬和水的混合物','非金屬'], answer:'金屬的氧化物' },
  { type:'single', prompt:'工匠問：「從金屬礦中提煉出金屬，這叫做什麼？」', options:['冶煉','燃燒','漂白','生鏽'], answer:'冶煉' },
],
q6_3: [
  { type:'single', prompt:'小維的維他命 C 先替糕點「接住」了氧。抗氧化劑和食品，誰對氧的活性比較大？', options:['抗氧化劑','食品','一樣大','看溫度'], answer:'抗氧化劑' },
  { type:'single', prompt:'食品裡加抗氧化劑，是為了——', options:['減緩食品發生氧化而變質','讓食品更快熟','讓食品變甜','讓食品變白'], answer:'減緩食品發生氧化而變質' },
],
q6_7: [
  { type:'single', fig:'iodine', prompt:'竹筷泡進碘液後，碘液的顏色變淡了。這代表什麼？', options:['竹筷殘留二氧化硫（亞硫酸鹽）','竹筷很新鮮','竹筷含有澱粉','碘液壞了'], answer:'竹筷殘留二氧化硫（亞硫酸鹽）' },
  { type:'single', fig:'iodine', prompt:'用碘液檢驗竹筷有沒有殘留二氧化硫。如果有殘留，碘液會——', options:['顏色變淡','顏色變更深','變成紅色','冒出泡泡'], answer:'顏色變淡' },
],
q6_8: [
  { type:'single', prompt:'亞硫酸鈉加熱後會以什麼形態揮發？對食材有疑慮時該怎麼做？', options:['以二氧化硫揮發；多用清水浸洗','以氧氣揮發；多用醋浸泡','以氯氣揮發；多用漂白水洗','不會揮發；直接丟掉'], answer:'以二氧化硫揮發；多用清水浸洗' },
  { type:'single', prompt:'擔心食材有亞硫酸鹽殘留時，最簡單的處理方式是？', options:['多用清水浸洗','加漂白水洗','加醋浸泡一天','用酒精擦拭'], answer:'多用清水浸洗' },
],
q6_9: [
  { type:'single', prompt:'御花園裡，{O}問：「人和動物的呼吸作用，產生什麼？」', options:['二氧化碳 ＋ 水 ＋ 能量','氧氣 ＋ 葡萄糖','氧氣 ＋ 水','葡萄糖 ＋ 能量'], answer:'二氧化碳 ＋ 水 ＋ 能量' },
  { type:'single', prompt:'御花園裡，{O}問：「樹木的光合作用，產生什麼？」', options:['氧氣 ＋ 葡萄糖 ＋ 水','二氧化碳 ＋ 水 ＋ 能量','二氧化碳 ＋ 葡萄糖','氧氣 ＋ 二氧化碳'], answer:'氧氣 ＋ 葡萄糖 ＋ 水' },
  { type:'single', prompt:'御花園裡，{O}問：「光合作用需要哪些原料？」', options:['水 ＋ 二氧化碳（加上光能）','氧氣 ＋ 葡萄糖','氧氣 ＋ 水','二氧化碳 ＋ 葡萄糖'], answer:'水 ＋ 二氧化碳（加上光能）' },
],
};

/* match 題：從題目庫抽幾列、列的順序打亂 */
function matchFrom(r, prompt, pool, n, extra){
  return Object.assign({ type:'match', prompt, rows: sample(r, pool, Math.min(n, pool.length)) }, extra || {});
}

/* ================== 每局生成：分組（同一組題目共用同一份亂數，例如「承上題」） ================== */
const GROUPS = [
/* ---- 序章 ---- */
['q0_3', r => {
  const pos = sample(r, ['蠟燭燃燒','鐵生鏽','呼吸作用','切開的蘋果變褐色','木炭燃燒','食物腐敗','人體新陳代謝'], 3 + Math.floor(r() * 2));
  const neg = sample(r, ['冰塊融化','光合作用','水沸騰','糖溶於水','乾冰昇華'], 6 - pos.length);
  return { q0_3: { type:'multi', prompt:'硫女官：「下列哪些屬於氧化反應？全部選出來。」', options: shuffle(r, pos.concat(neg)), answer: pos } };
}],
/* ---- 第一章：燃燒與驗茶 ---- */
['q1_1', r => {
  const F = { Na:['flame_Na','黃色火焰'], Mg:['flame_Mg','強烈的白光'], S:['flame_S','藍紫色火焰'], C:['flame_C','暗暗的紅光'] };
  const NAME = { Na:'鈉', Mg:'鎂', S:'硫', C:'碳', Cu:'銅', Zn:'鋅' };
  const keys = Object.keys(F);
  const a = pick(r, keys);
  const b = pick(r, keys.filter(k => k !== a).concat(['Cu']));
  const q1 = { type:'single', fig: F[a][0], prompt:'殿選後，硫女官考你：「這是誰見駕（燃燒）時的樣子？」', options: keys.map(k => NAME[k]), answer: NAME[a] };
  const descB = b === 'Cu' ? '不發光，只是表面變黑' : F[b][1];
  const q2 = { type:'single', prompt:`硫女官又問：「${NAME[b]}見駕（燃燒）時，是什麼樣子？」`,
    options: shuffle(r, ['黃色火焰','強烈的白光','藍紫色火焰','暗暗的紅光','不發光，只是表面變黑'].filter(x => x !== descB)).slice(0, 3).concat([descB]), answer: descB };
  const P = { Na:'氧化鈉', Mg:'氧化鎂', C:'二氧化碳', S:'二氧化硫', Cu:'氧化銅', Zn:'氧化鋅' };
  const c = pick(r, Object.keys(P));
  const q3 = { type:'single', prompt:`硫女官：「${NAME[c]}燃燒（和氧結合）後，產生什麼？」`,
    options: shuffle(r, Object.values(P).filter(x => x !== P[c])).slice(0, 3).concat([P[c]]), answer: P[c] };
  return { q1_1: q1, q1_2: q2, q1_3: q3 };
}],
['q1_5', (r, st) => {
  // 毒茶受害者（鈉、鉀、鈣、鎂其中一位）的茶：鹼性
  const T = teaVictimOf(st);
  const tea = `${zh(T)}{宮}的茶（${E[T].oxName}溶於水）`;
  const v1 = { type:'single', fig:'litmus_base', prompt:`${tea}讓紅色石蕊試紙怎麼變？`, options:['紅色變藍色','藍色變紅色','不變色','變成無色'], answer:'紅色變藍色' };
  const v2 = { type:'single', fig:'litmus_base', prompt:`${tea}是什麼性質？`, options:['鹼性','酸性','中性','有毒'], answer:'鹼性' };
  const w1 = { type:'single', prompt:`在${tea}裡滴入酚酞，會變成什麼顏色？`, options:['紅色','無色','藍色','黃色'], answer:'紅色' };
  const acid = pick(r, [['碳{宮}','二氧化碳'], ['硫女官','二氧化硫']]);
  const w2 = { type:'single', prompt:`把藍色石蕊試紙放進${acid[0]}的茶（${acid[1]}溶於水），會怎麼變？`, options:['藍色變紅色','紅色變藍色','不變色','變成無色'], answer:'藍色變紅色' };
  const w3 = { type:'single', prompt:`在${acid[0]}的茶（${acid[1]}溶於水）裡滴入酚酞，會是什麼顏色？`, options:['無色','紅色','藍色','黃色'], answer:'無色' };
  const metals = [T].concat(['Na','Mg'].filter(k => k !== T)).slice(0, 2);
  const opts = ['碳{宮}（二氧化碳溶於水）','硫女官的茶（二氧化硫溶於水）'].concat(metals.map(k => `${zh(k)}{宮}（${E[k].oxName}溶於水）`));
  const acidQ = r() < .5;
  const x = { type:'multi', prompt:`驗茶結果：哪幾{宮}的茶是「${acidQ ? '酸性' : '鹼性'}」？`, options: opts,
    answer: acidQ ? opts.slice(0, 2) : opts.slice(2) };
  const m = { type:'match', prompt:'你向眾人說明驗茶的道理：', rows: sample(r, [
    { label:'金屬的氧化物溶於水，呈', opts:['酸性','鹼性'], ans:'鹼性' },
    { label:'非金屬的氧化物溶於水，呈', opts:['酸性','鹼性'], ans:'酸性' },
    { label:'鹼性溶液讓酚酞變成', opts:['紅色','無色'], ans:'紅色' },
    { label:'酸性溶液讓藍色石蕊試紙變成', opts:['紅色','藍色'], ans:'紅色' } ], 3) };
  return { q1_5: pick(r, [v1, v2]), q1_6: pick(r, [w1, w2, w3]), q1_7: x, q1_9: m };
}],
/* ---- 第二章：活性與安定性 ---- */
['q2_1', r => ({ q2_1: matchFrom(r, '{太后}的考題：「得寵」與「守得住」', [
  { label:'活性大的元素，愈容易與氧結合，本身愈', opts:['安定','不安定'], ans:'不安定' },
  { label:'活性大的元素形成的氧化物，愈', opts:['安定','不安定'], ans:'安定' },
  { label:'活性小的元素形成的氧化物，愈', opts:['容易失去氧','不容易失去氧'], ans:'容易失去氧' },
  { label:'活性大的元素，愈', opts:['容易燃燒','不容易燃燒'], ans:'容易燃燒' } ], 2) })],
['q2_2', r => {
  const L = shuffle(r, ['X','Y','Z']);                  // L[0] 最活潑、L[2] 不會燃燒
  const style = pick(r, [['最容易燃燒','較不易燃燒','根本不會燃燒'], ['一點就著、火勢猛烈','要加熱很久才燒起來','怎麼加熱都不燃燒']]);
  const desc = {}; L.forEach((k, i) => desc[k] = style[i]);
  const prompt = `X、Y、Z 三位秀女見駕：X ${desc.X}，Y ${desc.Y}，Z ${desc.Z}。請把活性由大到小排出來。`;
  const ask = pick(r, [['最安定（最不容易失去氧）', L[0]], ['最不安定（最容易失去氧）', L[2]], ['最容易被還原', L[2]]]);
  return { q2_2: { type:'order', prompt, options:['X','Y','Z'], answer: L },
    q2_3: { type:'single', prompt:`承上題，三人的氧化物 XO、YO、ZO 中，哪一個${ask[0]}？`, options:['XO','YO','ZO','三個一樣'], answer: ask[1] + 'O' } };
}],
['q2_4', r => {
  const R = pick(r, ['C','Zn','Fe','Mg','Al','Sn','Pb','Ca']);
  const pool = ORD.filter(k => k !== R && k !== 'H');
  const up = sample(r, pool.filter(k => more(k, R)), 2);
  const down = sample(r, pool.filter(k => more(R, k)), 2);
  const four = shuffle(r, up.concat(down));
  return { q2_4: { type:'multi', prompt:`已知活性：${seriesText(four.concat([R]))}。${zh(R)}可以從哪些人的手上把氧搶走（還原出金屬）？`,
    options: four.map(k => E[k].oxName), answer: down.map(k => E[k].oxName) } };
}],
['q2_5', r => {
  const four = sample(r, ORD.filter(k => k !== 'H'), 4);
  const strong = r() < .65;
  return { q2_5: { type:'single', prompt:`下列四位，誰的「還原力」最${strong ? '強（最能搶走別人的氧）' : '弱（最難搶走別人的氧）'}？`,
    options: four.map(zh), answer: zh(byAct(four)[strong ? 0 : 3]) } };
}],
['q2_6', r => {
  const four = sample(r, ORD.filter(k => k !== 'H'), 4);
  const strong = r() < .65;
  return { q2_6: { type:'single', prompt:`下列氧化物，誰的「氧化力」最${strong ? '強（自己最容易失去氧）' : '弱（最不容易失去氧）'}？`,
    options: four.map(k => E[k].oxName), answer: E[byAct(four)[strong ? 3 : 0]].oxName } };
}],
['q2_7', r => {
  const four = [pick(r, ORD.slice(0, 5)), pick(r, ORD.slice(5, 8)), pick(r, ORD.slice(8, 11)), pick(r, ORD.slice(11))];
  return { q2_7: { type:'order', prompt:'小維想把四位{小主}的活性排一排，請幫她由大到小排好。', options: shuffle(r, four).map(zh), answer: byAct(four).map(zh) } };
}],
/* ---- 第三章：氫奪寵（H₂＋CuO） ---- */
['q3_1', r => {
  const rowsA = [
    { label:'H₂ 發生', opts:['氧化反應','還原反應'], ans:'氧化反應' },
    { label:'CuO 發生', opts:['氧化反應','還原反應'], ans:'還原反應' },
    { label:'「氧化產物」是', opts:['Cu','H₂O'], ans:'H₂O' },
    { label:'「還原產物」是', opts:['Cu','H₂O'], ans:'Cu' } ];
  const rowsB = [
    { label:'氧化劑是', opts:['H₂','CuO'], ans:'CuO' },
    { label:'還原劑是', opts:['H₂','CuO'], ans:'H₂' },
    { label:'還原劑', opts:['得到電子','失去電子'], ans:'失去電子' },
    { label:'氧化劑', opts:['得到電子','失去電子'], ans:'得到電子' },
    { label:'有「氧化力」的是', opts:['H₂','CuO'], ans:'CuO' } ];
  return { q3_1: matchFrom(r, '氫從銅手上搶走了氧：H₂ ＋ CuO → Cu ＋ H₂O', rowsA, 2, { fig:'eq_H2CuO' }),
           q3_2: matchFrom(r, '同一場奪寵，誰扮演什麼角色？', rowsB, 3, { fig:'eq_H2CuO' }) };
}],
/* ---- 第四章 ---- */
['q4_4', r => {
  const hi = sample(r, ['K','Na','Ca','Mg','Al'], 2), lo = sample(r, ['Zn','Fe','Sn','Pb','Cu'], 2);
  const four = shuffle(r, hi.concat(lo));
  return { q4_4: { type:'multi', prompt:`已知活性：${seriesText(four.concat(['C']))}。哪些{宮}著火時「不能」用二氧化碳滅火？`, options: four.map(zh), answer: hi.map(zh) } };
}],
/* ---- 第五章：推理 ---- */
['q5_1', r => {
  const four = sample(r, ORD, 4);
  const labs = ['甲','乙','丙','丁'];
  const cols = four.map((k, i) => oxWith(k, labs[i]));
  const cells = four.map((a, i) => four.map((b, j) => i === j ? 'X' : more(a, b) ? '+' : '-'));
  return { q5_1: { type:'match', figSvg: FG.tableSvg('宮鬥結果表', labs, cols, cells),
    prompt:`密函上的結果表：「＋」代表那一列的人能從那一欄的人手上搶走氧。四位蒙面者各是誰？（${four.slice().sort().join('、')}）`,
    rows: labs.map((l, i) => ({ label:l, opts: four.slice().sort(), ans: four[i] })),
    hint:'看誰全部都搶得贏、誰一個都搶不贏；化學式的下標也是線索。' } };
}],
['q5_2', r => {
  const COLS = [['CO₂','C'],['MgO','Mg'],['Na₂O','Na'],['Fe₂O₃','Fe'],['CaO','Ca'],['Al₂O₃','Al'],['H₂O','H'],['CuO','Cu'],['Ag₂O','Ag']];
  // 挑四列：避開「全部＋」或「全部－」太簡單的（K、Au…）
  const rows = sample(r, ['Na','Ca','Mg','Al','C','Zn','Fe','Sn','Pb','H','Cu','Hg'], 4);
  const out = {};
  rows.forEach((k, i) => {
    out['q5_' + (i + 2)] = { type:'grid', prompt:`重建名冊：${zh(k)}（${k}）能從誰手上搶走氧？點格子切換 ＋（會反應）／－（不會反應）。`,
      row:k, cols: COLS.map(c => c[0]), ans: COLS.map(c => c[1] === k ? 'X' : more(k, c[1]) ? '+' : '-') };
  });
  return out;
}],
['q5_6', r => {
  const L = shuffle(r, ['X','Y','Z','W']);                 // L[0] 最活潑
  const rk = {}; L.forEach((k, i) => rk[k] = i);
  const labs = ['X','Y','Z','W'];
  const cells = labs.map(a => labs.map(b => a === b ? 'X' : rk[a] < rk[b] ? '+' : '-'));
  const fig = FG.tableSvg('暗帳', labs, labs.map(l => l + 'O'), cells);
  const rows = [
    { label:'最容易發生氧化反應的是', opts: labs, ans: L[0] },
    { label:'還原力最強的是', opts: labs, ans: L[0] },
    { label:'最安定的元素是', opts: labs, ans: L[3] },
    { label:'最安定的氧化物是', opts: labs.map(l => l + 'O'), ans: L[0] + 'O' },
    { label:'氧化力最強（最容易失去氧）的是', opts: labs.map(l => l + 'O'), ans: L[3] + 'O' } ];
  return { q5_6: { type:'order', figSvg: fig, prompt:'暗帳上記著 X、Y、Z、W 四人的奪寵紀錄。請把四人的活性由大到小排出來。', options: labs, answer: L },
           q5_7: matchFrom(r, '承上，關於四人和她們的氧化物：', rows, 3, { figSvg: fig }) };
}],
['q5_8', r => {
  const pool = ORD.filter(k => k !== 'H');
  const st = [], used = new Set();
  const pair = () => { let a, b; do { [a, b] = sample(r, pool, 2); } while (used.has(a + b) || used.has(b + a)); used.add(a + b); return [a, b]; };
  for (let i = 0; i < 3; i++) { const [a, b] = pair(); const [w, l] = more(a, b) ? [a, b] : [b, a]; st.push({ t:`「${zh(w)}{小主}從${zh(l)}{小主}手上請走了{O}。」`, lie:false }); }
  { const [a, b] = pair(); const [w, l] = more(a, b) ? [b, a] : [a, b]; st.push({ t:`「${zh(w)}{小主}從${zh(l)}{小主}手上請走了{O}。」`, lie:true }); }
  const order = shuffle(r, st);
  const opts = order.map((s, i) => ['甲','乙','丙','丁'][i] + '：' + s.t);
  return { q5_8: { type:'single', noShuffle:true, prompt:'四位證人各說一句「那晚的奪寵經過」。其中一句不可能發生——說謊的是誰？',
    options: opts, answer: opts[order.findIndex(s => s.lie)], hint:'對照活性順序：K＞Na＞Ca＞Mg＞Al＞C＞Zn＞Fe＞Sn＞Pb＞H＞Cu＞Hg＞Ag＞Au' } };
}],
/* ---- 第六章 ---- */
['q6_2', r => ({ q6_2: matchFrom(r, '冶煉的原理：XO（金屬礦）＋ Y → X ＋ YO', [
  { label:'Y 的活性要比 X', opts:['大','小'], ans:'大' },
  { label:'在這個反應中，Y 擔任', opts:['氧化劑','還原劑'], ans:'還原劑' },
  { label:'金屬礦 XO 發生', opts:['氧化反應','還原反應'], ans:'還原反應' },
  { label:'冶煉時 Y 本身', opts:['被氧化','被還原'], ans:'被氧化' } ], 2) })],
['q6_4', r => {
  const neg = sample(r, ['食鹽','小蘇打','味精','砂糖','醋'], 2);
  const pos = ['胡蘿蔔素','維他命 C','維他命 E'];
  return { q6_4: { type:'multi', prompt:'下列哪些是天然的抗氧化劑？', options: shuffle(r, pos.concat(neg)), answer: pos } };
}],
['q6_5', r => ({
  q6_5: matchFrom(r, '浣衣局的危機：氯系漂白水', [
    { label:'主成分是', opts:['次氯酸鈉','亞硫酸鈉'], ans:'次氯酸鈉' },
    { label:'不可以和哪種清潔劑混用', opts:['酸性','鹼性'], ans:'酸性' },
    { label:'混用會產生有毒的', opts:['氯氣','二氧化硫'], ans:'氯氣' },
    { label:'漂白水具有很強的', opts:['氧化能力','還原能力'], ans:'氧化能力' } ], 3),
  q6_6: matchFrom(r, '兩種漂白比一比：', [
    { label:'氯系漂白水漂白，是利用', opts:['氧化作用','還原作用'], ans:'氧化作用' },
    { label:'氯系漂白後的顏色', opts:['不會恢復','容易恢復'], ans:'不會恢復' },
    { label:'亞硫酸鈉漂白食材，是利用', opts:['氧化作用','還原作用'], ans:'還原作用' },
    { label:'亞硫酸鈉漂白後的顏色', opts:['不會恢復','容易恢復'], ans:'容易恢復' } ], 3),
})],
];

/* 全部題號（固定）＋配分 */
const SLOTS = ['q0_1','q0_2','q0_3','q0_4','q1_1','q1_2','q1_3','q1_4','q1_5','q1_6','q1_7','q1_8','q1_9',
  'q2_1','q2_2','q2_3','q2_4','q2_5','q2_6','q2_7','q3_1','q3_2','q3_3','q3_4','q3_5','q3_6','q3_7','q3_8',
  'q4_1','q4_2','q4_3','q4_4','q4_5','q5_1','q5_2','q5_3','q5_4','q5_5','q5_6','q5_7','q5_8',
  'q6_1','q6_2','q6_3','q6_4','q6_5','q6_6','q6_7','q6_8','q6_9'];
const PTS = { q5_1:20, q5_8:20 };
const MAX_STATIC = SLOTS.reduce((t, k) => t + (PTS[k] || 10), 0);

const teaVictimOf = st => CR.teaVictimOf(st);   // 毒茶受害者（規則在 core.js）

/* 依這一局的 seed 產生全部題目 */
function buildQuestions(st){
  const Q = {};
  for (const [k, list] of Object.entries(V)) Q[k] = JSON.parse(JSON.stringify(pick(rng(hashStr(k) ^ (st.seed >>> 0)), list)));
  for (const [k, fn] of GROUPS) Object.assign(Q, fn(rng((hashStr(k) ^ (st.seed >>> 0) ^ 0x9e3779b9) >>> 0), st));
  for (const k of SLOTS) { if (!Q[k]) throw new Error('題目沒產生：' + k); Q[k].pts = PTS[k] || 10; }
  return Q;
}

const api = { buildQuestions, SLOTS, MAX_STATIC };
if (isNode) module.exports = api; else root.QBANK = api;
})(this);
