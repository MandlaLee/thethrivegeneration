from pathlib import Path
import re

pages = sorted(Path('.').glob('*.html'))
failures = []

for path in pages:
    text = path.read_text(encoding='utf-8')

    required = [
        '<script src="assets/js/navigation.js"></script>',
        '<script src="assets/js/main.js"></script>',
    ]

    for script in required:
        src = re.search(r'src="([^"]+)"', script).group(1)
        if src not in text:
            marker = re.search(r'<a\b[^>]*class="[^"]*whatsapp-float[^"]*"', text, re.I)
            if marker:
                text = text[:marker.start()] + script + text[marker.start():]
            else:
                text = text.replace('</body>', script + '</body>', 1)

    path.write_text(text, encoding='utf-8')

for path in pages:
    text = path.read_text(encoding='utf-8')
    for src in ('assets/js/navigation.js', 'assets/js/main.js'):
        count = len(re.findall(rf'<script\b[^>]*src="{re.escape(src)}"[^>]*></script>', text, re.I))
        if count != 1:
            failures.append(f'{path.name}: {src} appears {count} times')

print(f'Audited header behaviour on {len(pages)} pages.')
print('Failures:', failures or 'None')
if failures:
    raise SystemExit('Header script audit failed')
