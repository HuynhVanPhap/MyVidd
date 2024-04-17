const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
const menu = document.getElementById('menu');

const menuWrapperSize = document.getElementById('menu-wrapper').offsetWidth; // Unchanging area of the screen where the menu is always visible.
const menuSize = document.getElementById('menu').offsetWidth;	// Includes itemsCount * itemSize but also factors in space between items added by flexbox.
const menuInvisibleSize = Math.max(menuSize - menuWrapperSize, 0);	// Fixed portion of scrollable menu that is hidden at all times, or zero if menu fits within container.
const arrowSize = rightArrow.offsetWidth;	// Width of each arrow div. In current design, this equates to 12px. Still computes value even if right arrow is hidden, which it is at time this line is executed.
const menuEndOffset = Math.max(menuInvisibleSize - arrowSize, 0);	// Fixed portion of scrollable menu that is not obscured by an overlapping arrow key, or zero if no arrow keys are needed.

/**
 * @const itemsCount Number of menu items.
 * @const itemSize offsetWidth includes borders and padding but not margins of a menu item (since all the same, choose first one in array). FYI, clientWidth includes padding but NOT borders and margins.
 * @const itemsSpaceBetween Space between menu items is deliberately set to equal menu wrapper padding left/right. In this design it is 20 pixels.
 * @const distanceInPixels Distance to scroll per arrow button click equals width of a menu item plus the space to its right or left. In this design, it is 75 + 20 = 95.
 */
const itemsCount = document.getElementsByClassName('item').length;
const itemSize = document.getElementsByClassName('item')[0].offsetWidth;
const itemsSpaceBetween = (menuSize - (itemsCount * itemSize)) / (itemsCount - 1);
const distanceInPixels = itemSize + itemsSpaceBetween;

const durationInMilliseconds = 500;
let starttime = null;

if (menuInvisibleSize === 0) {
	rightArrow.classList.add("hidden");
}

const getMenuPosition = () => {
	return parseFloat(menu.style.left) || 0;	// First time, left property is not set so initialize to 0.
};

// Get current distance (in pixels) that we have scrolled.
const getScrolledDistance = () => {
	return -1 * getMenuPosition();	// Negate value because this is the only way it will work.
};

// After an arrow key is clicked and menu is animating, check to see where we are and determine which arrow key(s) to show, always resulting in at least one arrow key visible. Also, update data at bottom.
// Notes: o This function is only applicable when all menu items cannot be seen in container at one time and an arrow key is clicked to animate menu. 
//        o If all menu items fit in visible container, UI will be initially rendered without any arrow keys and this function will never be called.
const checkPosition = () => {
	// Calculate where we are right now.
	const menuPosition = getScrolledDistance();
	// console.log(`Menu Position ${menuPosition}`);
	// Determine which arrow key(s) to display based on position.
	if (menuPosition <= arrowSize) {			// SHOW RIGHT ARROW if we are scrolling from far left.
		leftArrow.classList.add("hidden");		// FYI, this will NOT create duplicate hidden class if leftArrow already contains it.	
		rightArrow.classList.remove("hidden");
	} else if (menuPosition < menuEndOffset) {	// SHOW BOTH ARROWS when in the middle of the menu.
		leftArrow.classList.remove("hidden");
		rightArrow.classList.remove("hidden");
	} else if (menuPosition >= menuEndOffset) {	// SHOW LEFT ARROW if we are scrolling as far right as we can go.
		leftArrow.classList.remove("hidden");
		rightArrow.classList.add("hidden");
    }
};

const animateMenu = (timestamp, startingPoint, distance) => {
    const runtime = timestamp - starttime;
    let progress = runtime / durationInMilliseconds;
    progress = Math.min(progress, 1);
	let newValue = (startingPoint + (distance * progress)).toFixed(2) + 'px';
	menu.style.left = newValue;

	if (runtime < durationInMilliseconds) {	// If we still have time remaining...
        requestAnimationFrame(function(timestamp) {	// Request another animation frame and recursively call THIS function.
            animateMenu(timestamp, startingPoint, distance);
        })
    }
	checkPosition();
};

const animationFramesSetup = (timestamp, travelDistanceInPixels) => {
	timestamp = timestamp || new Date().getTime();	// if browser doesn't support requestAnimationFrame, generate our own timestamp using Date.
	starttime = timestamp;
	const startingPoint = getMenuPosition();		// This cannot be defined up top in constants. Need to read current value only during initial setup of arrow button click.
	animateMenu(timestamp, startingPoint, travelDistanceInPixels);
};

rightArrow.addEventListener('click', () => requestAnimationFrame(
	timestamp => animationFramesSetup(timestamp, -1 * distanceInPixels)
));
	
leftArrow.addEventListener('click', () => requestAnimationFrame(
	timestamp => animationFramesSetup(timestamp, distanceInPixels)
));