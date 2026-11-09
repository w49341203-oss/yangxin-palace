/* 《氧心殿》核心規則（遊戲畫面和自動測試共用同一份，避免兩邊算法不一致） */
'use strict';
(function(root){
const E = (typeof ELEMENTS !== 'undefined') ? ELEMENTS : require('./elements.js').ELEMENTS;
const ORD = (typeof ORDER !== 'undefined') ? ORDER : require('./elements.js').ORDER;
const steal = (a, b) => E[a].rank < E[b].rank;

/* 兩個篇章的稱謂對照：劇情裡寫 {O}、{宮}… 會自動換成對應的詞 */
const TERMS = {
  gong: { 篇:'後宮篇', O:'皇上', O他:'他', 她:'她', 小主:'小主', 宮:'宮', 後宮:'後宮', 太后:'太后', 秀女:'秀女',
          立后:'立后', 皇后:'皇后', 冷宮:'冷宮', 姐妹:'姐妹', 姐姐:'姐姐', 妹妹:'妹妹', 殿選:'殿選', 名帖:'名帖' },
  zhao: { 篇:'招親篇', O:'公主', O他:'她', 她:'他', 小主:'公子', 宮:'館', 後宮:'招親城', 太后:'皇后', 秀女:'求親的公子',
          立后:'擇婿', 皇后:'駙馬', 冷宮:'大牢', 姐妹:'兄弟', 姐姐:'兄長', 妹妹:'賢弟', 殿選:'觀燈擇人', 名帖:'名帖' },
};
/* 位分（0～6） */
const RANKS = {
  gong: ['答應','常在','貴人','嬪','妃','貴妃','皇貴妃'],
  zhao: ['落選邊緣','候補','入圍','前十','前五','前三','首選'],
};
const START_RANK = { strong:3, mid:2, weak:1 };

/* 幕後黑手：每一局從汞、鉛、銀、錫裡隨機抽一位（不會是玩家自己）；同一局固定不變（看 seed）。
   盟友：平常是碳；玩家抽到碳時換成鋅 */
const VILLAIN_POOL = ['Hg','Pb','Ag','Sn'];
const villainOf = st => { const pool = VILLAIN_POOL.filter(k => k !== st.me); return pool[(((st.seed || 1) >>> 0) * 7 + 3) % pool.length]; };
const allyOf = me => me === 'C' ? 'Zn' : 'C';
/* 毒茶風波被誣陷的人：鈉、鉀、鈣、鎂隨機一位（同一局固定；她們的茶都是鹼性） */
const TEA_POOL = ['Na','K','Ca','Mg'];
const teaVictimOf = st => TEA_POOL[((((st.seed || 1) >>> 0) * 13 + 5) >>> 0) % TEA_POOL.length];
/* 烈焰派老大：鉀（玩家是鉀時換成鈉）；金蘭會老大：金／銀／銅裡第一位「不是玩家、也不是犯人」的 */
const fireLeaderOf = st => st.me === 'K' ? 'Na' : 'K';
const goldLeaderOf = st => ['Au','Ag','Cu'].find(k => k !== st.me && k !== villainOf(st));
/* 隨機宮中小事件：整個清單依 seed 洗牌，第 n 個插槽拿第 n 個（同一局不重複） */
function randomEventOf(st, n, pool){
  const r = rng(((st.seed || 1) ^ 0x5bd1e995) >>> 0);
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a[(n - 1) % a.length];
}
/* 出招場合等：依 seed 從清單抽一個（同一局固定） */
const pickBySeed = (st, arr, salt) => arr[((((st.seed || 1) >>> 0) * 31 + salt * 17) >>> 0) % arr.length];

function resolveKey(k, st){
  if (k === 'V') return villainOf(st);
  if (k === 'A') return allyOf(st.me);
  if (k === 'T') return teaVictimOf(st);
  if (k === 'FL') return fireLeaderOf(st);
  if (k === 'GL') return goldLeaderOf(st);
  if (k === 'me') return st.me;
  return k;
}
function nameOf(k, st){
  if (k === st.me) return '你';
  if (!E[k]) return k;
  return E[k].zh + TERMS[st.ver].小主;
}
/* 文字代換：[[後宮篇文字||招親篇文字]]、{N:Na}＝鈉小主（若玩家就是鈉→「你」）、{E:Na}＝鈉、{O}… */
function render(str, st){
  if (str == null) return '';
  const t = TERMS[st.ver] || TERMS.gong;
  return String(str)
    .replace(/\[\[([\s\S]*?)\|\|([\s\S]*?)\]\]/g, (m, a, b) => st.ver === 'zhao' ? b : a)
    .replace(/\{N:(\w+)\}/g, (m, k) => nameOf(resolveKey(k, st), st))
    .replace(/\{E:(\w+)\}/g, (m, k) => { const r = resolveKey(k, st); return E[r] ? E[r].zh : k; })
    .replace(/\{OX:(\w+)\}/g, (m, k) => { const r = resolveKey(k, st); return E[r] ? E[r].oxName : k; })
    .replace(/\{([^{}:]+)\}/g, (m, k) => {
      if (k === 'me') return E[st.me].zh + t.小主;
      if (k === 'meE') return E[st.me].zh;
      if (k === 'rank') return RANKS[st.ver][st.rank] || '';
      if (k === 'name') return st.name || '';
      if (k === 'trait') return render(E[st.me].trait, st);
      if (k === 'tier') return { strong:'強勢派', mid:'中間派', weak:'安定派' }[E[st.me].tier];
      if (t[k] !== undefined) return t[k];
      return m;
    });
}
/* 條件：{me:['Mg']}、{notme:[…]}、{flag:'c1',eq:'A'}、{flag:'c1',in:['A','C']}、{tier:'weak'}、{rankGte:4}、{all:[…]}、{any:[…]} */
function condOk(c, st){
  if (!c) return true;
  if (c.all) return c.all.every(x => condOk(x, st));
  if (c.any) return c.any.some(x => condOk(x, st));
  if (c.me) return c.me.includes(st.me);
  if (c.villain) return c.villain.includes(villainOf(st));
  if (c.isT !== undefined) return (st.me === teaVictimOf(st)) === c.isT;
  if (c.notme) return !c.notme.includes(st.me);
  if (c.tier) return E[st.me].tier === c.tier;
  if (c.rankGte !== undefined) return (st.rank || 0) >= c.rankGte;
  if (c.flag) {
    const v = (st.flags || {})[c.flag];
    if (c.in) return c.in.includes(v);
    if ('eq' in c) return v === c.eq;
    if ('ne' in c) return v !== c.ne;
  }
  return true;
}

/* 固定亂數（同一局同一場出招，對手永遠一樣，重新整理不會變） */
/* 先把種子充分攪亂（相鄰的種子才不會出很像的題） */
function mix(x){ x = x >>> 0; x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; }
function rng(seed){ let h = mix(seed) || 1; return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; }
function pickFrom(arr, r){ return arr[Math.floor(r() * arr.length)]; }

/* 出招的對手：一定有比你強的、比你弱的、和你很接近的（最強／最弱的人例外） */
function duelOpponents(st, n){
  const r = rng((st.seed || 1) * 31 + n * 977);
  const p = E[st.me].rank;
  const others = ORD.filter(k => k !== st.me);
  const near = (lo, hi) => others.filter(k => E[k].rank >= lo && E[k].rank <= hi);
  const picked = [];
  const add = list => { const c = list.filter(k => !picked.includes(k)); if (c.length) picked.push(pickFrom(c, r)); };
  add(near(p - 1, p + 1));                // 很接近的（最難判斷）
  add(near(p - 4, p - 1));                // 比你強的
  add(near(p + 1, p + 4));                // 比你弱的
  while (picked.length < 3) add(others);  // 最強／最弱的人補滿
  // 依活性順序以外的固定亂序排列，不讓位置透露強弱
  return picked.map(k => [k, r()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
}
/* 出招結果 */
function duelOutcome(st, pick){ if (!pick) return 'idle'; return steal(st.me, pick) ? 'win' : 'lose'; }

/* 出招後的動態題（依玩家實際的元素與對手自動出題） */
function dynQuestion(st, n, opps, pick){
  const me = E[st.me];
  let q;
  if (pick) {
    const o = E[pick];
    if (steal(st.me, pick)) {
      const eq = `${me.zh} ＋ ${o.oxName} → ${me.oxName} ＋ ${o.zh}`;
      const asks = [
        { p:'誰是還原劑？', a: me.zh },
        { p:'誰發生了還原反應（失去氧）？', a: o.oxName },
        { p:'誰是氧化劑？', a: o.oxName },
      ][(n - 1) % 3];
      q = { type:'single', prompt:`剛才這場奪寵：${eq}\n${asks.p}`, options:[me.zh, o.oxName, o.zh, me.oxName], answer: asks.a };
    } else {
      q = { type:'single', prompt:`你想從${o.zh}手上搶走氧（${me.zh} ＋ ${o.oxName}），卻失敗了。為什麼？`,
        options:[`${me.zh}的活性比${o.zh}小，搶不走${o.oxName}裡的氧`, `${me.zh}的活性比${o.zh}大，但{O}不肯`, `${o.oxName}會溶於水`, `${me.zh}沒有先被加熱`],
        answer:`${me.zh}的活性比${o.zh}小，搶不走${o.oxName}裡的氧` };
    }
  } else {
    const t = opps[0], o = E[t], can = steal(st.me, t);
    q = { type:'single', prompt:`你按兵不動。事後小維小聲問：「如果剛才去找${o.zh}，搶得過嗎？」`,
      options:[`搶得過，${me.zh}比${o.zh}活潑`, `搶不過，${o.zh}比${me.zh}活潑`, `一定搶得過，{O}只看臉`, `搶不過，因為${o.oxName}會溶於水`],
      answer: can ? `搶得過，${me.zh}比${o.zh}活潑` : `搶不過，${o.zh}比${me.zh}活潑` };
  }
  q.pts = 10; q.dyn = true;
  return q;
}
const DUEL_COUNT = 3;

const api = { fireLeaderOf, goldLeaderOf, randomEventOf, TEA_POOL, teaVictimOf, pickBySeed, VILLAIN_POOL, TERMS, RANKS, START_RANK, villainOf, allyOf, resolveKey, nameOf, render, condOk, rng, duelOpponents, duelOutcome, dynQuestion, DUEL_COUNT, steal };
if (typeof module !== 'undefined') module.exports = api; else root.CORE = api;
})(this);
