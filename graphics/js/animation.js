'use strict';

// Simple fade out/in animation by using opacity.
function animationSetField(selector, newHTML, callback) {
	$(selector).animate({'opacity': '0'}, 1000, 'linear').promise().done(() => {
		if (newHTML) selector.html(newHTML);
		$(selector).animate({'opacity': '1'}, 1000, 'linear').promise().done(() => {
			if (callback) callback();
		});
	});
}

// Simple fade out for 1s.
function animationFadeOutElement(selector, callback) {
	$(selector).animate({'opacity': '0'}, 1000, 'linear').promise().done(() => {
		if (callback) callback();
	});
}

// Simple fade in for 1s.
function animationFadeInElement(selector, callback) {
	$(selector).animate({'opacity': '1'}, 1000, 'linear').promise().done(() => {
		if (callback) callback();
	});
}

// Simple fade out for X amount of time.
function animationFadeOutElementMS(selector, ms, callback) {
	$(selector).animate({'opacity': '0'}, ms, 'linear').promise().done(() => {
		if (callback) callback();
	});
}

// Simple fade in for X amount of time.
function animationFadeInElementMS(selector, ms, callback) {
	$(selector).animate({'opacity': '1'}, ms, 'linear').promise().done(() => {
		if (callback) callback();
	});
}

// Shorthand function that combines the 2 above functions.
function animationFadeOutInElements(selector1, selector2, callback) {
	animationFadeOutElement(selector1);
	animationFadeInElement(selector2, () => {
		if (callback) callback();
	});
}

// Animation lasts under 1 tick (5s) so no extra callbacks are needed.
function animationUpdateDonationTotal(selector, oldVal, newVal) {
	$(selector)
	.prop('number', oldVal)
	.animateNumber({
		number: newVal,
		numberStep: function(now, tween) {
			var target = $(tween.elem);
			var value = formatDollarAmount(now, true)
			target.html(value);
		}
	}, 4000, 'linear');
}

// Fades out old image, changes to new one, fades in.
function animationChangeSponsorImage(element, assetURL) {
	animationFadeOutElement(element, () => {
		element.css('background-image', 'url("'+assetURL+'")');
		animationFadeInElement(element);
	});
}