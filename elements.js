/* 《氧心殿》元素資料：活性順序以講義 p.5 為準
   K > Na > Ca > Mg > Al > C > Zn > Fe > Sn > Pb > H > Cu > Hg > Ag > Au
   rank 越小＝活性越大（越容易搶到氧＝越容易得寵） */
'use strict';
const ELEMENTS = {
  K:  { zh:'鉀', tier:'strong', color:'#a855f7', ox:'K₂O',   oxName:'氧化鉀', trait:'全宮最強、最暴烈，碰到水就會失控。平時被關在「煤油閣」裡（鉀存放在煤油中）。' },
  Na: { zh:'鈉', tier:'strong', color:'#facc15', ox:'Na₂O',  oxName:'氧化鈉', trait:'一點就燃、性子最急，燃燒時發出黃色火焰。也怕水，住在「油燈房」。' },
  Ca: { zh:'鈣', tier:'strong', color:'#dc6b4a', ox:'CaO',   oxName:'氧化鈣', trait:'熱情豪爽，燃燒時是磚紅色的火焰，最受百姓喜愛。' },
  Mg: { zh:'鎂', tier:'strong', color:'#e5e7eb', ox:'MgO',   oxName:'氧化鎂', trait:'一亮相就是刺眼的白光；連在二氧化碳裡都能繼續燒。' },
  Al: { zh:'鋁', tier:'strong', color:'#93c5fd', ox:'Al₂O₃', oxName:'氧化鋁', trait:'外表冷淡（身上有一層保護膜），其實非常活潑。' },
  C:  { zh:'碳', tier:'mid',    color:'#3f3f46', ox:'CO₂',   oxName:'二氧化碳', trait:'黑衣謀士，活性中等卻最會搶人：能從鋅、鐵、銅手上搶走氧。燃燒發紅光。' },
  Zn: { zh:'鋅', tier:'mid',    color:'#a5c8e4', ox:'ZnO',   oxName:'氧化鋅', trait:'低調穩重，夾在碳和鐵中間，是最難判斷的「卡位者」。' },
  Fe: { zh:'鐵', tier:'mid',    color:'#8b5e4a', ox:'Fe₂O₃', oxName:'氧化鐵', trait:'將門之後，個性剛硬；但時間久了會生鏽，紅褐色是{她}的心事。' },
  Sn: { zh:'錫', tier:'mid',    color:'#cbd5e1', ox:'SnO',   oxName:'氧化錫', trait:'溫和的老好人，每一派都想拉攏，常被夾在中間。' },
  Pb: { zh:'鉛', tier:'mid',    color:'#64748b', ox:'PbO',   oxName:'氧化鉛', trait:'沉重寡言、心事重重，而且——有毒。' },
  H:  { zh:'氫', tier:'weak',   color:'#bae6fd', ox:'H₂O',   oxName:'水',     trait:'年紀最小、最輕盈、出身最低，卻能從銅手上搶走氧。' },
  Cu: { zh:'銅', tier:'weak',   color:'#c2713d', ox:'CuO',   oxName:'氧化銅', trait:'溫婉不爭。加熱後會變黑，常被人嘲笑、被人搶走。' },
  Hg: { zh:'汞', tier:'weak',   color:'#b8c4d6', ox:'HgO',   oxName:'氧化汞', trait:'美麗、熱心、捉摸不定（唯一的液態金屬），而且——有毒。' },
  Ag: { zh:'銀', tier:'weak',   color:'#e2e8f0', ox:'Ag₂O',  oxName:'氧化銀', trait:'清冷優雅、月光一般。看穿了很多事，卻很少說出口。' },
  Au: { zh:'金', tier:'weak',   color:'#eab308', ox:'Au₂O',  oxName:'氧化金', trait:'最安定的人：從不爭，也永不失色。' },
};
const ORDER = ['K','Na','Ca','Mg','Al','C','Zn','Fe','Sn','Pb','H','Cu','Hg','Ag','Au'];
ORDER.forEach((k, i) => { ELEMENTS[k].rank = i; ELEMENTS[k].key = k; });
/* a 能不能從 b 的氧化物中搶走氧（a 比 b 活潑才行） */
function canSteal(a, b){ return ELEMENTS[a].rank < ELEMENTS[b].rank; }
const TIER_NAME = { strong:'強勢派', mid:'中間派', weak:'安定派' };
if (typeof module !== 'undefined') module.exports = { ELEMENTS, ORDER, canSteal, TIER_NAME };
