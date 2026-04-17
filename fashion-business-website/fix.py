import glob, os, re
files = glob.glob(r'd:\website\fashion-business-website\*.html')
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<li><a href=\"shop.html\" class=\"nav-link' not in content:
        basename = os.path.basename(file)
        shop_class = 'nav-link active' if basename == 'shop.html' else 'nav-link'
        replacement = r'\1<li><a href="shop.html" class="' + shop_class + r'">Shop</a></li>\n                    '
        new_content, count = re.subn(r'(<li><a href="index\.html" class="nav-link(?: active)?">Home</a></li>\s*)', replacement, content)
        if count > 0:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Updated ' + file)
