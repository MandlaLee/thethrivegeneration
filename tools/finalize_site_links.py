from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

root = Path('.')
old = '<div><h3>Ministries</h3><a href="unithrive.html">UniThrive</a><a href="kingship-worship.html">Kingship Worship</a><a href="choir-members.html">Choir Members</a><a href="thrive-in-two.html">Thrive In Two</a><a href="prayer-ministry.html">The Prayer Ministry</a></div>'
new = '<div><h3>Ministries</h3><a href="unithrive.html">UniThrive</a><a href="kingship-worship.html">Kingship Worship</a><a href="choir-members.html">Choir Members</a><a href="thrive-in-two.html">Thrive In Two</a><a href="prayer-ministry.html">The Prayer Ministry</a><a href="open-hands.html">Open Hands</a></div>'

changed = 0
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    updated = text.replace(old, new)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        changed += 1
if changed != 30:
    raise SystemExit(f'Expected 30 footer updates, got {changed}')

pages = {p.name: p for p in root.glob('*.html')}
links = {name: [] for name in pages}
anchors = {name: set() for name in pages}
broken, missing = [], []

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.hrefs.append(attrs['href'])

parsers = {}
for name, path in pages.items():
    parser = Parser()
    parser.feed(path.read_text(encoding='utf-8'))
    parsers[name] = parser
    anchors[name] = parser.ids

for name, parser in parsers.items():
    for href in parser.hrefs:
        if not href:
            continue
        if href.startswith('#'):
            if href[1:] and href[1:] not in anchors[name]:
                missing.append((name, name, href[1:]))
            continue
        if href.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:')):
            continue
        parsed = urlsplit(href)
        target = unquote(Path(parsed.path).name)
        if not target.endswith('.html'):
            continue
        if target not in pages:
            broken.append((name, href))
            continue
        links[name].append(target)
        if parsed.fragment and parsed.fragment not in anchors[target]:
            missing.append((name, target, parsed.fragment))

js = '\n'.join(p.read_text(encoding='utf-8', errors='ignore') for p in root.rglob('*.js'))
if 'event.html' in js:
    links['events.html'].append('event.html')
if 'thrive-in-two-booking.html' in js:
    links['thrive-in-two.html'].append('thrive-in-two-booking.html')

reachable = set()
stack = ['index.html']
while stack:
    page = stack.pop()
    if page in reachable:
        continue
    reachable.add(page)
    stack.extend(target for target in links.get(page, []) if target not in reachable)

orphaned = sorted(set(pages) - reachable - {'404.html'})
inbound = {name: set() for name in pages}
for source, targets in links.items():
    for target in targets:
        inbound[target].add(source)
weak = {page: len(inbound[page]) for page in ('new-here.html', 'choir-members.html') if len(inbound[page]) < 2}

print(f'HTML pages: {len(pages)}')
print(f'Reachable from homepage: {len(reachable)}')
print(f'Orphaned pages: {orphaned}')
print(f'Broken internal links: {broken}')
print(f'Missing anchors: {missing}')
print(f'Weak routes: {weak}')
print(f'Open Hands inbound sources: {len(inbound["open-hands.html"])}')

if orphaned or broken or missing or weak:
    raise SystemExit('Final connectivity audit failed')
print('FINAL CONNECTIVITY AUDIT PASSED')
