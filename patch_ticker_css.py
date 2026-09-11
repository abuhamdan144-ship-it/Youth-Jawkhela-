import re

with open('src/index.css', 'r') as f:
    css = f.read()

if '.ticker-track.reverse' not in css:
    reverseCSS = """
.ticker-track.reverse { animation: tickerScrollReverse 25s linear infinite; }
@keyframes tickerScrollReverse { 0% { transform: translateX(-33.333333%); } 100% { transform: translateX(0); } }
"""
    css = css.replace('.ticker-icon {', reverseCSS + '.ticker-icon {')
    with open('src/index.css', 'w') as f:
        f.write(css)
