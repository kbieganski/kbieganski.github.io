// DOM Queries
var content = $('#content');
var mainNav = $('#main-nav');


// Navbar-content margin fix
function makeNavMargin() {
    content.css('margin-top', mainNav.css('height'));
}

makeNavMargin();

$(window).resize(makeNavMargin);


// Navigation
function stringAfterLast(string, character) {
		for (var i = string.length - 1; i >= 0; i--)
		{
				if (string[i] == character)
				{
            return string.substring(i + 1, string.length);
				}
		}
		return '';
}

function preprocess(input, cssClass, delimiterStart, delimiterEnd = delimiterStart) {
    var start = input.indexOf(delimiterStart);
	var end = 0;
	var output = '';
    while (start != -1) {
		output += input.substr(end, start - end);
        end = input.indexOf(delimiterEnd, start + 1);
        if (end == -1) {
			output += input.substr(start, input.length - start);
            return output;
        }
        var mathTex = input.substr(start + 1, end - start - 1);
		output += '<span class="' + cssClass + '">' + mathTex + '</span>';
        start = input.indexOf(delimiterStart, end + 1);
		end += 1;
    }
	output += input.substr(end, input.length - end);
    return output;
}

protocolPattern = /^\s*[a-z]+\:\/{2,3}.*/i;

function loadContent(name) {
	$.get('content/' + name + '.md', function(data) {
		content.html(marked(preprocess(data, 'math', '$')));
		content.find('a').each(function(i, anchor) {
			var address = $(anchor).attr('href');
			if (!protocolPattern.test(address)) {
				$(anchor).attr('href', '?' + address);
			}
       	});
		content.find('.math').each(function(i, span) {
			katex.render($(span).text(), span);
       	});
    });
}

var currentContent = stringAfterLast(window.location.href, '?');
if (currentContent === '') {
    currentContent = 'blog';
}
loadContent(currentContent);
