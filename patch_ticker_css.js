const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('.ticker-track.reverse')) {
    const reverseCSS = `\n.ticker-track.reverse { animation: tickerScrollReverse 25s linear infinite; }\n@keyframes tickerScrollReverse { 0% { transform: translateX(-33.333333%); } 100% { transform: translateX(0); } }\n`;
    css = css.replace('.ticker-icon {', reverseCSS + '.ticker-icon {');
    fs.writeFileSync('src/index.css', css);
}
