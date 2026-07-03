document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('dynamic-seniority');
    if (!target) return;

    // Use current date
    const now = new Date();
    const month = now.getMonth(); // 0 = Jan, 5 = Jun, 7 = Aug
    const day = now.getDate();
    const year = now.getFullYear();

    // Graduation year for someone born May 2011 is 2029
    const gradYear = 2029;

    // Check if it's summer (After June 4, Before Aug 16)
    let isSummer = false;
    if ((month === 5 && day > 4) || month === 6 || (month === 7 && day < 16)) {
        isSummer = true;
    }

    // Determine the calendar year in which the current/upcoming academic year ends
    let endYear;
    if (month < 5 || (month === 5 && day <= 4)) {
        // Jan to June 4th belongs to the academic year ending in the current year
        endYear = year;
    } else {
        // June 5th to Dec belongs to the academic year ending next year
        endYear = year + 1;
    }

    // Calculate grade
    let gradeNum = 12 - (gradYear - endYear);
    let gradeStr = "";

    if (gradeNum < 9) {
        gradeStr = "student";
    } else if (gradeNum === 9) {
        gradeStr = "freshman";
    } else if (gradeNum === 10) {
        gradeStr = "sophomore";
    } else if (gradeNum === 11) {
        gradeStr = "junior";
    } else if (gradeNum === 12) {
        gradeStr = "senior";
    } else {
        gradeStr = "alumni";
    }

    let finalStr = gradeStr;
    if (isSummer && gradeNum >= 9 && gradeNum <= 12) {
        finalStr = "rising " + gradeStr;
    }

    // Build the slot machine reel
    const options = ["freshman", "junior", "student", "builder", "senior", "sophomore", "alumni", "researcher"];
    const reelItems = [];
    // Generate 20 random items for the spin effect
    for (let i = 0; i < 20; i++) {
        reelItems.push(options[Math.floor(Math.random() * options.length)]);
    }
    // The final item is the actual grade
    reelItems.push(finalStr);

    let html = '<span class="slot-machine-container">';
    html += '<span class="ticker-light"></span>'; // Glowing LED indicator
    html += '<span class="slot-reel slot-spinning">';
    reelItems.forEach(opt => {
        html += `<span class="slot-item">${opt}</span>`;
    });
    html += '</span></span>';

    // Inject into the target
    target.innerHTML = html;
    
    // We remove the default inline classes since the slot container handles its own styling
    target.classList.remove('decorated-inline', 'cyan');

    // Trigger animations when the section scrolls into view
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        
        // Helper to create slot reels without a light
        function createSlotReel(targetId, finalWord, options, extraClass = "") {
            const el = document.getElementById(targetId);
            if (!el) return null;
            
            const items = [];
            for (let i = 0; i < 15; i++) {
                items.push(options[Math.floor(Math.random() * options.length)]);
            }
            items.push(finalWord);
            
            let html = `<span class="slot-machine-container ${extraClass}" style="display: inline-flex; vertical-align: middle;">`;
            html += '<span class="slot-reel slot-spinning">';
            items.forEach(opt => {
                html += `<span class="slot-item">${opt}</span>`;
            });
            html += '</span></span>';
            
            el.innerHTML = html;
            
            return {
                reel: el.querySelector('.slot-reel'),
                items: items
            };
        }

        const locSlot = createSlotReel('slot-location', 'SAN JOSE, CA', ['NEW YORK, NY', 'LONDON, UK', 'TOKYO, JP', 'AUSTIN, TX', 'SEATTLE, WA', 'CHICAGO, IL'], 'white-pill-slot');
        const tzSlot = createSlotReel('slot-timezone', 'PST', ['EST', 'GMT', 'UTC', 'CST', 'MST', 'JST'], 'white-pill-slot timezone-pill');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the staggered lazy load CSS animations for the grid
                    aboutSection.classList.add('animate-in');
                    observer.unobserve(aboutSection);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });
        observer.observe(aboutSection);

        // Spin the sophomore pill only when it comes into view
        const topObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const reel = target.querySelector('.slot-reel');
                        if (reel) {
                            const offset = (reelItems.length - 1) * -2; // Updated to -2em per item for the pill shape
                            reel.classList.remove('slot-spinning');
                            reel.style.transform = `translateY(${offset}em)`;
                        }
                    }, 200);

                    // Allow JS 3D tilt and turn light green
                    setTimeout(() => {
                        aboutSection.classList.add('animated');
                        const light = target.querySelector('.ticker-light');
                        if (light) {
                            light.classList.add('ready');
                        }
                    }, 1800); // 1.5s transition + 300ms buffer

                    topObserver.unobserve(target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });
        topObserver.observe(target);

        // Spin Location and Time slots independently when THEY come into view
        function spinWhenVisible(slotObj, delay) {
            if (!slotObj || !slotObj.reel) return;
            const slotObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            const offset = (slotObj.items.length - 1) * -2;
                            slotObj.reel.classList.remove('slot-spinning');
                            slotObj.reel.style.transform = `translateY(${offset}em)`;
                        }, delay);
                        slotObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });
            slotObserver.observe(slotObj.reel.parentElement);
        }

        // They are in the same card, so they will intersect together.        // Setup slot animations
        spinWhenVisible(locSlot, 200);
        spinWhenVisible(tzSlot, 400); // Slight delay for the second slot
    }
});

/* Scroll Shadow Logic */
(() => {
    const wrappers = document.querySelectorAll(".scroll-shadow-wrapper");
    wrappers.forEach(wrapper => {
        const list = wrapper.querySelector(".brutalist-list");
        if (!list) return;

        function updateScrollShadows() {
            const atTop = list.scrollTop <= 5;
            const atBottom = list.scrollHeight - list.scrollTop <= list.clientHeight + 5;
            
            if (atTop) {
                wrapper.classList.remove("can-scroll-up");
            } else {
                wrapper.classList.add("can-scroll-up");
            }
            
            if (atBottom || list.scrollHeight <= list.clientHeight) {
                wrapper.classList.remove("can-scroll-down");
            } else {
                wrapper.classList.add("can-scroll-down");
            }
        }
        
        list.addEventListener("scroll", updateScrollShadows);
        // Initial check
        setTimeout(updateScrollShadows, 100);
    });
})();
