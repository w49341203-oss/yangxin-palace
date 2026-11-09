/* 《氧心殿》題圖：全部用程式畫（SVG），顏色、表格才會精準 */
'use strict';
function flameSvg(c1, c2, label){
  return `<svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" width="220" height="240">
  <defs><radialGradient id="fg${label}" cx="50%" cy="65%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${c1}"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient></defs>
  <rect width="220" height="240" rx="16" fill="#14121c"/>
  <ellipse cx="110" cy="120" rx="80" ry="100" fill="url(#fg${label})"/>
  <path d="M110 40 C140 90 150 120 135 160 C128 180 92 180 85 160 C72 125 95 100 110 40Z" fill="${c1}" opacity=".9"/>
  <path d="M110 95 C122 120 124 140 116 158 C112 166 104 166 100 158 C95 140 100 120 110 95Z" fill="#fff" opacity=".8"/>
  <rect x="70" y="190" width="80" height="18" rx="6" fill="#5b4636"/>
  <text x="110" y="230" text-anchor="middle" fill="#bbb" font-size="14">${label}</text></svg>`;
}
function tableSvg(title, rows, cols, cells){
  const cw = 70, rh = 40, x0 = 70, y0 = 44;
  const W = x0 + cw * cols.length + 10, H = y0 + rh * rows.length + 10;
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="sans-serif">
  <rect width="${W}" height="${H}" rx="12" fill="#fdf8ec"/>
  <text x="${W/2}" y="20" text-anchor="middle" font-size="15" fill="#7c2d12" font-weight="700">${title}</text>`;
  cols.forEach((c, j) => { s += `<rect x="${x0 + j*cw}" y="${y0-20}" width="${cw}" height="${rh-12}" fill="#1e3a8a"/><text x="${x0 + j*cw + cw/2}" y="${y0-1}" text-anchor="middle" fill="#fff" font-size="16">${c}</text>`; });
  rows.forEach((r, i) => {
    const y = y0 + 8 + i*rh;
    s += `<rect x="10" y="${y}" width="${x0-10}" height="${rh}" fill="#e5e7eb" stroke="#999"/><text x="${10 + (x0-10)/2}" y="${y+26}" text-anchor="middle" font-size="18" fill="#111">${r}</text>`;
    cols.forEach((c, j) => {
      const v = cells[i][j];
      const col = v === '+' ? '#15803d' : v === '-' ? '#b91c1c' : '#555';
      s += `<rect x="${x0 + j*cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#999"/><text x="${x0 + j*cw + cw/2}" y="${y+27}" text-anchor="middle" font-size="22" font-weight="700" fill="${col}">${v === '-' ? '－' : v === '+' ? '＋' : v}</text>`;
    });
  });
  return s + '</svg>';
}
const FIGS = {
  flame_Na: flameSvg('#facc15', '#f59e0b', '見駕的火焰'),
  flame_S: flameSvg('#7c6cf0', '#4338ca', '見駕的火焰'),
  flame_Mg: flameSvg('#ffffff', '#e0f2fe', '見駕的光'),
  flame_C: flameSvg('#dc2626', '#7f1d1d', '見駕的光'),
  litmus_base: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" width="300" height="200" font-family="sans-serif">
    <rect width="300" height="200" rx="14" fill="#fdf8ec"/>
    <path d="M60 60 h80 l-10 110 h-60z" fill="#e0f2fe" stroke="#64748b" stroke-width="3"/>
    <path d="M66 100 h68 l-6 68 h-56z" fill="#fef3c7" opacity=".9"/>
    <text x="100" y="40" text-anchor="middle" font-size="15" fill="#7c2d12">鈉宮的茶</text>
    <rect x="190" y="50" width="26" height="110" fill="#ef4444"/><rect x="190" y="110" width="26" height="50" fill="#ef4444"/>
    <text x="203" y="180" text-anchor="middle" font-size="13" fill="#333">紅色石蕊試紙</text>
    <text x="250" y="110" text-anchor="middle" font-size="26" fill="#333">？</text></svg>`,
  eq_H2CuO: `<svg viewBox="0 0 420 90" xmlns="http://www.w3.org/2000/svg" width="420" height="90" font-family="sans-serif">
    <rect width="420" height="90" rx="12" fill="#fdf8ec"/>
    <text x="210" y="55" text-anchor="middle" font-size="30" fill="#111">H₂ ＋ CuO → Cu ＋ H₂O</text></svg>`,
  table_main: tableSvg('宮鬥結果表', ['甲','乙','丙','丁'], ['甲O₂','乙O','丙₂O','丁₂O₃'],
    [['X','-','-','+'],['+','X','-','+'],['+','+','X','+'],['-','-','-','X']]),
  table_xyzw: tableSvg('暗帳', ['X','Y','Z','W'], ['XO','YO','ZO','WO'],
    [['X','-','+','-'],['+','X','+','+'],['-','-','X','-'],['+','-','+','X']]),
  iodine: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" width="320" height="200" font-family="sans-serif">
    <rect width="320" height="200" rx="14" fill="#fdf8ec"/>
    <path d="M40 50 h90 l-8 120 h-74z" fill="#b45309" opacity=".85" stroke="#64748b" stroke-width="3"/>
    <path d="M190 50 h90 l-8 120 h-74z" fill="#f5deb3" opacity=".7" stroke="#64748b" stroke-width="3"/>
    <rect x="228" y="20" width="10" height="140" fill="#fefce8" stroke="#a3a3a3" transform="rotate(8 233 90)"/>
    <text x="85" y="190" text-anchor="middle" font-size="14" fill="#333">對照組（碘液）</text>
    <text x="235" y="190" text-anchor="middle" font-size="14" fill="#333">泡了竹筷</text></svg>`,
};
if (typeof module !== 'undefined') module.exports = { FIGS, tableSvg };
