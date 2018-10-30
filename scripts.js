// DOM Queries
var body = document.querySelector('body');
var content = document.querySelector('#content');
var mainNav = document.querySelector('#main-nav');
var navHeader = document.querySelector('#nav-header');
document.querySelector('#js-error').style = 'display:none;';


// Navbar-content margin fix
function makeNavMargin() {
	if (window.innerWidth > window.innerHeight && body.clientWidth >= 1280) {
		content.style.marginTop = 0;
	} else {
		content.style.marginTop = mainNav.clientHeight + 'px';
	}
}

makeNavMargin();

window.onresize = makeNavMargin;

navHeader.onmouseover = function() {
	navHeader.innerHTML = 'Software Engineer';
};
navHeader.onmouseout = function() {
	navHeader.innerHTML = 'Krzysztof Biegański';
};

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
defaultPage = 'blog';

function loadContent(name) {
	var request = new XMLHttpRequest();
	request.open('GET', '/content/' + name + '.md', true);
	request.onerror = function() {
		if (name === defaultPage) {
			content.textContent = "Could not load page.";
		} else {
			loadContent(defaultPage);
		}
	};
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			content.innerHTML = marked(preprocess(this.response, 'math', '$'));
			content.querySelectorAll('a').forEach(function(anchor, i) {
				if (!protocolPattern.test(anchor.href)) {
					anchor.href = '?' + address;
				}
       		});
			content.querySelectorAll('.math').forEach(function(span, i) {
				katex.render(span.textContent, span);
       		});
		} else {
			request.onerror();
		}
	};
	request.send();
}

var currentContent = stringAfterLast(window.location.href, '?');
if (currentContent === '') {
    currentContent = defaultPage;
}
loadContent(currentContent);
