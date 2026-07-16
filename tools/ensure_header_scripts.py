from pathlib import Path
import re

pages = sorted(Path('.').glob('*.html'))
failures = []
script_sources = ('assets/js/navigation.js', 'assets/js/main.js')

for path in pages:
    text = path.read_text(encoding='utf-8')

    # Remove every old copy, regardless of attribute order or defer/async usage.
    for src in script_sources:
        pattern = re.compile(
            rf'<script\b(?=[^>]*\bsrc=["\']{re.escape(src)}["\'])[^>]*>\s*</script>',
            re.I,
        )
        text = pattern.sub('', text)

    shared_scripts = (
        '<script defer="" src="assets/js/navigation.js"></script>'
        '<script defer="" src="assets/js/main.js"></script>'
    )
    marker = re.search(r'<a\b[^>]*class="[^"]*whatsapp-float[^"]*"', text, re.I)
    if marker:
        text = text[:marker.start()] + shared_scripts + text[marker.start():]
    elif '</body>' in text:
        text = text.replace('</body>', shared_scripts + '</body>', 1)
    else:
        raise SystemExit(f'{path.name}: missing insertion point for shared scripts')

    path.write_text(text, encoding='utf-8')

for path in pages:
    text = path.read_text(encoding='utf-8')
    for src in script_sources:
        count = len(re.findall(
            rf'<script\b(?=[^>]*\bsrc=["\']{re.escape(src)}["\'])[^>]*>\s*</script>',
            text,
            re.I,
        ))
        if count != 1:
            failures.append(f'{path.name}: {src} appears {count} times')

print(f'Audited header behaviour on {len(pages)} pages.')
print('Failures:', failures or 'None')
if failures:
    raise SystemExit('Header script audit failed')
