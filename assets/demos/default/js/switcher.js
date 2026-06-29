// Floating Style Switcher Widget for local demo comparison
(function() {
    // 1. Create link element for modern-ux.css
    const linkEl = document.createElement('link');
    linkEl.id = 'modern-ux-stylesheet';
    linkEl.rel = 'stylesheet';
    
    // Calculate path depth dynamically to support subfolders
    let relPathPrefix = './';
    const cloneIdx = window.location.pathname.indexOf('4grass_clone/');
    if (cloneIdx !== -1) {
        const subPath = window.location.pathname.substring(cloneIdx + '4grass_clone/'.length);
        const slashes = (subPath.match(/\//g) || []).length;
        relPathPrefix = '../'.repeat(slashes);
    }
    
    linkEl.href = relPathPrefix + 'assets/demos/default/css/modern-ux.css';
    
    // 2. Create Floating Toggle Widget
    const widget = document.createElement('div');
    widget.id = 'ux-switcher-widget';
    widget.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 99999;
        background: #ffffff;
        border: 1px solid rgba(46, 89, 39, 0.2);
        box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        border-radius: 50px;
        padding: 8px 8px 8px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Noto Sans TC', system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #2b2b2b;
        user-select: none;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    `;
    
    const textLabel = document.createElement('span');
    textLabel.id = 'ux-switcher-label';
    textLabel.innerText = '原始四草樣式';
    widget.appendChild(textLabel);
    
    const toggleBtn = document.createElement('button');
    toggleBtn.style.cssText = `
        background: #e2e8f0;
        border: none;
        width: 50px;
        height: 26px;
        border-radius: 20px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
        display: flex;
        align-items: center;
        outline: none;
    `;
    
    const toggleBall = document.createElement('span');
    toggleBall.style.cssText = `
        width: 20px;
        height: 20px;
        background: #ffffff;
        border-radius: 50%;
        position: absolute;
        left: 3px;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    `;
    toggleBtn.appendChild(toggleBall);
    widget.appendChild(toggleBtn);
    
    // Add hover effect
    widget.addEventListener('mouseenter', () => {
        widget.style.transform = 'scale(1.03)';
        widget.style.boxShadow = '0 12px 35px rgba(46, 89, 39, 0.18)';
    });
    widget.addEventListener('mouseleave', () => {
        widget.style.transform = 'scale(1)';
        widget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
    });
    
    // Add to DOM when page loads
    if (document.body) {
        document.body.appendChild(widget);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(widget);
        });
    }
    
    // 3. State Management
    function setMode(isModern) {
        const searchElements = document.querySelectorAll('.c-search-toggler, .c-search-toggler-wrapper, .fa-search');
        if (isModern) {
            if (!document.getElementById('modern-ux-stylesheet')) {
                document.head.appendChild(linkEl);
            }
            document.body.classList.add('modern-ux-mode');
            toggleBtn.style.background = '#2e5927';
            toggleBall.style.left = '27px';
            textLabel.innerHTML = '✨ 體驗：小野日系禪風 UX';
            textLabel.style.color = '#2e5927';
            localStorage.setItem('ux-mode-modern', 'true');
            
            // Force hide search icons using JS to prevent theme CSS overrides
            searchElements.forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        } else {
            const stylesheet = document.getElementById('modern-ux-stylesheet');
            if (stylesheet) {
                stylesheet.remove();
            }
            document.body.classList.remove('modern-ux-mode');
            toggleBtn.style.background = '#e2e8f0';
            toggleBall.style.left = '3px';
            textLabel.innerHTML = '原始四草樣式';
            textLabel.style.color = '#2b2b2b';
            localStorage.setItem('ux-mode-modern', 'false');
            
            // Restore search icons
            searchElements.forEach(el => {
                el.style.removeProperty('display');
            });
        }
    }
    
    // Toggle Event
    toggleBtn.addEventListener('click', () => {
        const isCurrentlyModern = document.body.classList.contains('modern-ux-mode');
        setMode(!isCurrentlyModern);
    });
    
    // Read initial state
    const savedState = localStorage.getItem('ux-mode-modern');
    if (savedState === 'true') {
        setMode(true);
    } else {
        setMode(false);
    }
})();
