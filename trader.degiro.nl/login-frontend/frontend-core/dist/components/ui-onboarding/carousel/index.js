import * as React from 'react';
import InnerHtml from '../../ui-common/inner-html';
import { activeSlide, activeSliderNavigationItem, slide, slideDescription, slideImg, layout, sliderNavigation, sliderNavigationItem, slideTitle } from './carousel.css';
const { useState, useRef, useEffect, useCallback } = React;
const addActiveClassToSlide = (el) => {
    if (el) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.classList.add(activeSlide);
            });
        });
    }
};
const Carousel = ({ slides }) => {
    const touchStartDataRef = useRef(null);
    const [slideIndex, setSlideIndex] = useState(0);
    const currentSlide = slides[slideIndex];
    const lastSlideIndex = slides.length - 1;
    const onTouchStart = useCallback((event) => {
        const { touches } = event;
        const touchData = touches && touches[0];
        if (touchData) {
            touchStartDataRef.current = { clientX: touchData.clientX, clientY: touchData.clientY };
        }
    }, []);
    const onTouchEnd = useCallback((event) => {
        const touches = event.changedTouches;
        const touchEndData = touches && touches[0];
        const { current: touchStartData } = touchStartDataRef;
        if (!touchEndData || !touchStartData) {
            return;
        }
        // reset values
        touchStartDataRef.current = null;
        const touchEndX = touchEndData.clientX;
        const touchEndY = touchEndData.clientY;
        const xDiff = touchStartData.clientX - touchEndX;
        const yDiff = touchStartData.clientY - touchEndY;
        const absXDiff = Math.abs(xDiff);
        const isHorizontalSwipe = absXDiff > Math.abs(yDiff);
        /**
         * Conditions:
         *  - it's a horizontal swipe from Left to Right
         *  - movement distance is bigger than threshold
         */
        if (isHorizontalSwipe && absXDiff > 40) {
            setSlideIndex((currentSlideIndex) => {
                const slideIndex = currentSlideIndex + (xDiff > 0 ? 1 : -1);
                if (slideIndex >= 0 && slideIndex <= lastSlideIndex) {
                    return slideIndex;
                }
                return 0;
            });
        }
    }, [lastSlideIndex]);
    useEffect(() => setSlideIndex(0), [slides]);
    return (React.createElement("div", { className: layout, onTouchStart: onTouchStart, onTouchEnd: onTouchEnd },
        React.createElement("article", { className: slide, "data-name": "slide", "data-index": slideIndex, key: `slide${slideIndex}`, ref: addActiveClassToSlide },
            React.createElement("img", { "data-name": "slideImg", width: 224, height: 160, className: slideImg, src: currentSlide.imgUrl, alt: "" }),
            React.createElement("h2", { "data-name": "slideTitle", className: slideTitle }, currentSlide.title),
            React.createElement(InnerHtml, { "data-name": "slideDescription", className: slideDescription }, currentSlide.description)),
        React.createElement("div", { className: sliderNavigation }, slides.map((slide, index) => {
            const isActive = index === slideIndex;
            return (React.createElement("button", { type: "button", "data-name": "sliderNavigationItem", "aria-label": slide.title, title: slide.title, onClick: isActive ? undefined : setSlideIndex.bind(null, index), className: `${sliderNavigationItem} ${isActive ? activeSliderNavigationItem : ''}`, key: `sliderNavigationItem${index}` }));
        }))));
};
export default React.memo(Carousel);
//# sourceMappingURL=index.js.map