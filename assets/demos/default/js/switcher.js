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
    let modernNavEl = null;
    
    // Determine if it is a subpage (non-homepage)
    const isHomepage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       window.location.pathname.endsWith('4grass_clone') || 
                       window.location.pathname.endsWith('4grass_clone/');
                       
    if (!isHomepage) {
        if (document.body) {
            document.body.classList.add('subpage-mode');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('subpage-mode');
            });
        }
    }
    
    function setMode(isModern) {
        const searchElements = document.querySelectorAll('.c-search-toggler, .c-search-toggler-wrapper, .fa-search');
        const oldNav = document.querySelector('nav.c-mega-menu');
        
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
            
            // Handle subpage quick actions
            if (!isHomepage) {
                const articleBody = document.querySelector('.c-content-blog-post-1');
                if (articleBody && !document.getElementById('modern-quick-actions')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.id = 'modern-quick-actions';
                    actionsDiv.className = 'modern-quick-actions';
                    
                    const links = {
                        boat: relPathPrefix + 'page_orcaid_46D15FDB_3D6C_4610_A068_A49022CD1728.html',
                        traffic: relPathPrefix + 'page_orcaid_CD284169_C7FC_411A_8894_36B507BAA53E.html'
                    };
                    
                    actionsDiv.innerHTML = `
                        <a href="${links.boat}">🟢 規劃行程：觀光船票價與時刻表 ➔</a>
                        <a href="${links.traffic}">🧭 交通指引：如何前往四草大眾廟 ➔</a>
                    `;
                    articleBody.appendChild(actionsDiv);
                }
                const actionsBlock = document.getElementById('modern-quick-actions');
                if (actionsBlock) {
                    actionsBlock.style.removeProperty('display');
                }
            }
            
            // Handle Menu Switch: Hide Old and Show New Modern Menu
            if (oldNav) {
                oldNav.style.setProperty('display', 'none', 'important');
                
                // Build modern menu if not already created
                if (!modernNavEl) {
                    modernNavEl = document.createElement('nav');
                    modernNavEl.id = 'modern-ux-nav';
                    modernNavEl.className = 'c-mega-menu c-pull-right c-mega-menu-dark c-mega-menu-dark-mobile c-theme c-fonts-uppercase c-fonts-bold';
                    
                    const links = {
                        home: relPathPrefix + 'index.html',
                        news: relPathPrefix + 'list_orcaid_F0525BB5_8C58_481B_B71F_3D2409460752.html',
                        media: relPathPrefix + 'link_orcaid_2CED06F8_F216_45EB_BF1C_2BD35821C7EA.html',
                        boat: relPathPrefix + 'page_orcaid_46D15FDB_3D6C_4610_A068_A49022CD1728.html',
                        tunnel: relPathPrefix + 'page_orcaid_303DC2B3_C13A_4185_9871_6D98870888A4.html',
                        sea: relPathPrefix + 'page_orcaid_9B9070FE_1149_4182_9F6B_D0C18F05A58F.html',
                        intro: relPathPrefix + 'page_orcaid_4A6AD7B4_EF0D_4B72_B701_E088F7E2F025.html',
                        customs: relPathPrefix + 'page_orcaid_93CDDC49_BA37_4DC9_B6D4_FD3A63AA448F.html',
                        spots: relPathPrefix + 'page_orcaid_408DE08D_DFA9_475E_AE22_9AFD9A6BB46E.html',
                        legend: relPathPrefix + 'movielist_orcaid_89F7EAAA_F0F3_4768_BE10_6A8EF1288167.html',
                        patrol: relPathPrefix + 'page_orcaid_2675A7B9_42B4_4032_BD8B_F685B43FE2A4.html',
                        events: relPathPrefix + 'page_orcaid_04D98386_4EE2_4A80_B760_6427A4CA003B.html',
                        gallery: relPathPrefix + 'photolist_orcaid_42FC0A37_E26B_4186_A8CD_71736CE7AD24.html',
                        traffic: relPathPrefix + 'page_orcaid_CD284169_C7FC_411A_8894_36B507BAA53E.html',
                        contact: relPathPrefix + 'page_orcaid_D4443F3B_2C81_46DE_86EB_BDEB44A51784.html',
                        committee: relPathPrefix + 'page_orcaid_DCF421C2_4867_4145_AFAC_B015EFEE595A.html'
                    };
                    
                    modernNavEl.innerHTML = `
                        <ul class='nav navbar-nav c-theme-nav'>
                            <!-- 1. 最新消息 -->
                            <li class='c-menu-type-classic'>
                                <a href='javascript:;' class='c-link dropdown-toggle c-toggler'>最新消息<span class='c-arrow'></span></a>
                                <ul class='dropdown-menu c-menu-type-classic c-pull-left'>
                                    <li><a href='${links.news}'>最新消息/活動</a></li>
                                    <li><a href='${links.media}'>媒體報導</a></li>
                                </ul>
                            </li>
                            
                            <!-- 2. 乘船與參拜 -->
                            <li class='c-menu-type-classic'>
                                <a href='javascript:;' class='c-link dropdown-toggle c-toggler'>乘船與參拜<span class='c-arrow'></span></a>
                                <ul class='dropdown-menu c-menu-type-classic c-pull-left'>
                                    <li><a href='${links.boat}'>觀光船資訊 - 綠色隧道/台江內海票價與時刻</a></li>
                                    <li><a href='${links.intro}'>廟宇導覽與地圖</a></li>
                                    <li><a href='${links.customs}'>拜拜與筊杯籤詩習俗</a></li>
                                    <li><a href='${links.spots}'>周邊景點推薦</a></li>
                                </ul>
                            </li>
                            
                            <!-- 3. 大眾廟傳奇 -->
                            <li class='c-menu-type-classic'>
                                <a href='javascript:;' class='c-link dropdown-toggle c-toggler'>大眾廟傳奇<span class='c-arrow'></span></a>
                                <ul class='dropdown-menu c-menu-type-classic c-pull-left'>
                                    <li><a href='${links.legend}'>鎮海大元帥典故與影片</a></li>
                                    <li><a href='${links.patrol}'>出巡十六寮文化</a></li>
                                </ul>
                            </li>
                            
                            <!-- 4. 精彩相簿 -->
                            <li><a href='${links.gallery}' class='c-link'>精彩相簿</a></li>
                            
                            <!-- 5. 聯絡與交通 -->
                            <li class='c-menu-type-classic'>
                                <a href='javascript:;' class='c-link dropdown-toggle c-toggler'>聯絡與交通<span class='c-arrow'></span></a>
                                <ul class='dropdown-menu c-menu-type-classic c-pull-left'>
                                    <li><a href='${links.traffic}'>交通指引</a></li>
                                    <li><a href='${links.contact}'>聯絡我們</a></li>
                                    <li><a href='${links.committee}'>委員會介紹</a></li>
                                </ul>
                            </li>
                        </ul>
                    `;
                    
                    // Bind mobile submenu toggle events
                    modernNavEl.querySelectorAll('a.c-toggler').forEach(toggler => {
                        toggler.addEventListener('click', (e) => {
                            if (window.innerWidth < 992) {
                                e.preventDefault();
                                e.stopPropagation();
                                const parentLi = toggler.closest('li');
                                const dropdownMenu = parentLi.querySelector('.dropdown-menu');
                                if (dropdownMenu) {
                                    const isOpen = dropdownMenu.style.display === 'block';
                                    dropdownMenu.style.display = isOpen ? 'none' : 'block';
                                    
                                    const arrow = parentLi.querySelector('.c-arrow');
                                    if (arrow) {
                                        arrow.classList.toggle('c-active');
                                    }
                                }
                            }
                        });
                    });
                    
                    // Insert next to oldNav
                    oldNav.parentNode.insertBefore(modernNavEl, oldNav.nextSibling);
                }
                modernNavEl.style.removeProperty('display');
            }
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
            
            // Hide subpage quick actions
            const actionsBlock = document.getElementById('modern-quick-actions');
            if (actionsBlock) {
                actionsBlock.style.setProperty('display', 'none', 'important');
            }
            
            // Restore Old Menu, Hide Modern Menu
            if (oldNav) {
                oldNav.style.removeProperty('display');
            }
            if (modernNavEl) {
                modernNavEl.style.setProperty('display', 'none', 'important');
            }
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
