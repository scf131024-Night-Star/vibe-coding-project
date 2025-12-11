// script.js (V23：整合开场、跳过、导航切换、实时时间、密语互动)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 元素获取 ---
    const personalLogo = document.getElementById('personal-logo');
    const clubLogo = document.getElementById('club-logo');
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const skipButton = document.getElementById('skip-intro-button'); 
    
    // 导航和内容元素
    const navItems = document.querySelectorAll('#navbar .nav-item');
    const contentSections = document.querySelectorAll('#content-area .main-card-layout');
    
    // 时间显示元素
    const timeDisplay = document.getElementById('real-time-display'); 
    
    // 密语互动元素
    const cipherButton = document.getElementById('cipher-button');
    const contactClueArea = document.getElementById('contact-clue-area');
    const contactInfo = document.getElementById('contact-info');


    // --- 动画时间设置 (秒) ---
    const logoInDuration = 3; 
    const displayWait = 1; 
    const logoOutDuration = 2; 
    const waitBeforeClub = 1; 
    const clubInDuration = 2.5; 
    const startDelay = 0.5; 

    // 计算关键时间点 (总时长单位：毫秒)
    const time_phase1_start = startDelay * 1000;
    const time_phase2_start = time_phase1_start + (logoInDuration + displayWait) * 1000;
    const time_phase3_start = time_phase2_start + logoOutDuration * 1000 + waitBeforeClub * 1000;
    const time_phase4_start = time_phase3_start + clubInDuration * 1000 + 1000;


    // ---------------------------------------------
    // 实时时间更新函数
    // ---------------------------------------------
    const updateTime = () => {
        if (!timeDisplay) return; 

        const now = new Date();
        
        const timeString = now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
        
        const dateString = now.toLocaleDateString('zh-CN', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        
        timeDisplay.innerHTML = `${dateString}<br>${timeString}`;
    };

    updateTime();
    setInterval(updateTime, 1000);


    // ---------------------------------------------
    // 核心函数：立即结束动画并进入主页
    // ---------------------------------------------
    const finishIntro = (event) => {
        if (event) {
            event.preventDefault(); 
        }
        
        personalLogo.style.animation = 'none';
        clubLogo.style.animation = 'none';
        personalLogo.style.opacity = '0'; 
        clubLogo.style.opacity = '0'; 

        introOverlay.style.opacity = '0';
        mainContent.style.opacity = '1';

        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 1000); 
        
        skipButton.removeEventListener('click', finishIntro);
    };

    // 绑定跳过按钮事件
    skipButton.addEventListener('click', finishIntro);

    // ---------------------------------------------
    // 导航栏内容切换逻辑
    // ---------------------------------------------
    const switchContent = (targetId) => {
        
        contentSections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            setTimeout(() => {
                 targetSection.classList.add('active-section');
            }, 50); 
        }
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`#navbar a[data-target="${targetId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    };
    
    // 绑定导航栏点击事件
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = item.getAttribute('data-target'); 
            switchContent(targetId);
            document.getElementById('content-area').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ---------------------------------------------
    // 召唤密语页面交互逻辑 (点击显示联系方式)
    // ---------------------------------------------
    if (cipherButton) {
        // 为了平滑过渡，给线索区域添加一个过渡样式 (CSS里没有，这里用JS临时设置)
        contactClueArea.style.transition = 'opacity 0.5s ease-out'; 
        
        cipherButton.addEventListener('click', () => {
            // 隐藏提示区域
            contactClueArea.style.opacity = '0';
            
            setTimeout(() => {
                contactClueArea.style.display = 'none';
                
                // 显示联系信息区域，并添加淡入效果
                contactInfo.style.opacity = '0';
                contactInfo.style.display = 'block';
                contactInfo.style.transition = 'opacity 0.5s ease-in'; 
                
                setTimeout(() => {
                    contactInfo.style.opacity = '1'; 
                }, 50); 
            }, 500); // 0.5秒后切换
        });
    }


    // ---------------------------------------------
    // 阶段动画执行
    // ---------------------------------------------
    setTimeout(() => {
        if (introOverlay.style.display !== 'none') {
            personalLogo.style.animation = `fadeInSlideUp ${logoInDuration}s ease-out forwards`; 
        }
    }, time_phase1_start); 

    setTimeout(() => {
        if (introOverlay.style.display !== 'none') {
            personalLogo.style.animation = `personalLogoOut ${logoOutDuration}s ease-in-out forwards`;
        }
    }, time_phase2_start);

    setTimeout(() => {
        if (introOverlay.style.display !== 'none') {
            personalLogo.style.animation = 'none';
            personalLogo.style.opacity = '0'; 

            clubLogo.style.animation = `clubLogoIn ${clubInDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`; 
        }
    }, time_phase3_start);

    setTimeout(() => {
        finishIntro(); // 动画自然结束时自动过渡
    }, time_phase4_start);

});