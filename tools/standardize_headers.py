from pathlib import Path
from html.parser import HTMLParser
import re

ROOT = Path('.')
PAGES = sorted(ROOT.glob('*.html'))

ACTIVE_FOR = {
    'index.html': 'index.html',
    'about.html': 'about.html',
    'culture.html': 'about.html',
    'leadership.html': 'about.html',
    'testimonies.html': 'about.html',
    'vision-mission.html': 'about.html',
    'events.html': 'events.html',
    'event.html': 'events.html',
    'contact.html': 'contact.html',
    'give.html': 'give.html',
    'open-hands.html': 'give.html',
    'partner.html': 'give.html',
}

ANNOUNCEMENT = '''<div class="announcement-bar" data-announcement="">
<div class="container announcement-inner">
<p><strong>Launching September 2026</strong> <span>Location to be announced soon.</span></p>
<a href="auditions.html">Kingship Worship auditions are ongoing</a>
<button aria-label="Close announcement" class="announcement-close" data-announcement-close="" type="button">×</button>
</div>
</div>'''


def nav_link(page: str, href: str, label: str, extra_class: str = '') -> str:
    classes = []
    if extra_class:
        classes.append(extra_class)
    if ACTIVE_FOR.get(page) == href:
        classes.append('active')
    class_attr = f' class="{" ".join(classes)}"' if classes else ''
    return f'<a{class_attr} href="{href}">{label}</a>'


def canonical_header(page: str) -> str:
    return f'''<header class="site-header" data-header="">
<div class="container header-inner">
<a aria-label="Kingship Christian Centre home" class="brand" href="index.html">
<img alt="Kingship Christian Centre logo" class="site-logo" sizes="52px" src="assets/images/branding/kingship-header-logo.webp" srcset="assets/images/branding/kingship-header-logo.webp 800w, assets/images/branding/kingship-header-logo-1200.webp 1200w"/>
<span class="brand-copy"><strong>KINGSHIP</strong><small>CHRISTIAN CENTRE</small></span>
</a>
<button aria-controls="primary-navigation" aria-expanded="false" class="nav-toggle" data-nav-toggle="" type="button">
<span></span><span></span><span></span><span class="sr-only">Open navigation</span>
</button>
<nav aria-label="Primary navigation" class="primary-nav" data-nav="" id="primary-navigation">
{nav_link(page, 'index.html', 'Home')}
{nav_link(page, 'about.html', 'About')}
<div class="nav-dropdown" data-dropdown="">
<button aria-expanded="false" data-dropdown-toggle="" type="button">The Thrive Generation <span aria-hidden="true">⌄</span></button>
<div class="dropdown-menu">
<a href="unithrive.html"><strong>UniThrive</strong><span>Campus ministry</span></a>
<a href="prayer-ministry.html"><strong>The Prayer Ministry</strong><span>Prayer, revival and intercession</span></a>
<a href="thrive-in-two.html"><strong>Thrive In Two</strong><span>Marriage and relationships</span></a>
<a href="kingship-worship.html"><strong>Kingship Worship</strong><span>Worship and creative ministry</span></a>
</div>
</div>
{nav_link(page, 'events.html', 'Events')}
{nav_link(page, 'contact.html', 'Contact')}
{nav_link(page, 'give.html', 'Give', 'give-link')}
</nav>
</div>
</header>'''


HEADER_RE = re.compile(r'<header\b[^>]*class="[^"]*site-header[^"]*"[^>]*>.*?</header>', re.I | re.S)
ANNOUNCEMENT_RE = re.compile(r'<div\b[^>]*class="[^"]*announcement-bar[^"]*"[^>]*>.*?</div>\s*</div>', re.I | re.S)

for path in PAGES:
    text = path.read_text(encoding='utf-8')
    header = canonical_header(path.name)

    if HEADER_RE.search(text):
        text = HEADER_RE.sub(header, text, count=1)
    else:
        body = re.search(r'<body[^>]*>', text, re.I)
        if not body:
            raise SystemExit(f'{path.name}: missing body tag')
        text = text[:body.end()] + '\n' + header + text[body.end():]

    if ANNOUNCEMENT_RE.search(text):
        text = ANNOUNCEMENT_RE.sub(ANNOUNCEMENT, text, count=1)
    else:
        match = HEADER_RE.search(text)
        text = text[:match.start()] + ANNOUNCEMENT + '\n' + text[match.start():]

    if len(HEADER_RE.findall(text)) != 1:
        raise SystemExit(f'{path.name}: header replacement failed')
    if len(ANNOUNCEMENT_RE.findall(text)) != 1:
        raise SystemExit(f'{path.name}: announcement replacement failed')

    path.write_text(text, encoding='utf-8')

# Keep the 404 page compatible with the global header/footer.
legal_css = ROOT / 'assets/css/legal.css'
css = legal_css.read_text(encoding='utf-8')
compat = '.error-page.error-page-with-footer{display:block}.error-page.error-page-with-footer .error-shell{min-height:72vh;display:grid;align-content:center;margin-inline:auto;padding:70px 0}'
if compat not in css:
    css += compat
    legal_css.write_text(css, encoding='utf-8')

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headers = 0
        self.announcements = 0
        self.navs = 0
        self.logos = 0
        self.hrefs = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set(attrs.get('class', '').split())
        if tag == 'header' and 'site-header' in classes:
            self.headers += 1
        if tag == 'div' and 'announcement-bar' in classes:
            self.announcements += 1
        if tag == 'nav' and attrs.get('id') == 'primary-navigation':
            self.navs += 1
        if tag == 'img' and 'site-logo' in classes:
            self.logos += 1
        if tag == 'a' and attrs.get('href'):
            self.hrefs.add(attrs['href'])

required = {
    'index.html', 'about.html', 'unithrive.html', 'prayer-ministry.html',
    'thrive-in-two.html', 'kingship-worship.html', 'events.html',
    'contact.html', 'give.html', 'auditions.html'
}
failures = []
for path in PAGES:
    parser = AuditParser()
    parser.feed(path.read_text(encoding='utf-8'))
    if parser.headers != 1:
        failures.append(f'{path.name}: {parser.headers} site headers')
    if parser.announcements != 1:
        failures.append(f'{path.name}: {parser.announcements} announcement bars')
    if parser.navs != 1:
        failures.append(f'{path.name}: {parser.navs} primary navs')
    if parser.logos != 1:
        failures.append(f'{path.name}: {parser.logos} header logos')
    missing = sorted(required - parser.hrefs)
    if missing:
        failures.append(f'{path.name}: missing routes {missing}')

print(f'Audited {len(PAGES)} HTML pages.')
print('Failures:', failures or 'None')
if failures:
    raise SystemExit('Header consistency audit failed')
