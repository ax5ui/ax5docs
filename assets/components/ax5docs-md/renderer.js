exports.render = function (input, out) {
    var _s = "", s, _out, HTML, CSS, JS;
    var md = require('markdown-it')({
        html: true,
        linkify: true,
        typographer: true
    }).use(require('markdown-it-video', { // <-- this use(package_name) is required
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 },
        vine: { width: 600, height: 600, embed: 'simple' },
        prezi: { width: 550, height: 400 }
    }));

    var strip_indent = require('strip-indent');
    var fs = require('fs'), readFileData;

    if (input.file) { // readme file 처리
        readFileData = fs.readFileSync(input.file, 'utf8');
        _s = md.render(readFileData).replace(/<pre><code class="(.*)">/g, function (match, str) {
            return '<pre class="prettyprint linenums ' + str.replace("language", "lang") + '"><code>';
        });
    }
    else {
        _out = {
            w: function (text) {
                _s = md.render(strip_indent(text)).replace(/<pre><code class="(.*)">/g, function (match, str) {
                    return '<pre class="prettyprint linenums ' + str.replace("language", "lang") + '"><code>';
                });
            }
        };

        if (input.renderBody) {
            input.renderBody(_out);
        }
    }

    out.write(_s);
};