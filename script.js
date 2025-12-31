// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initCountdown();
    initInteractiveCard();
    initThemeToggle();
    initFireworks();
    initAnimations();
    initAudioControls();
    initBalloons();
    initBlessings();
    
    // 自动播放背景音乐（低音量）
    const audio = document.getElementById('newYearSound');
    audio.volume = 0.3;
    audio.play().catch(e => {
        console.log("音频自动播放被阻止，需要用户交互");
        // 显示提示让用户点击页面任意位置开始音乐
        document.body.addEventListener('click', function initAudioOnce() {
            audio.play().then(() => {
                console.log("音乐已开始播放");
            }).catch(err => {
                console.log("音乐播放失败:", err);
            });
            document.body.removeEventListener('click', initAudioOnce);
        }, { once: true });
    });
});

// 初始化倒计时
function initCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // 设置目标时间为明天的00:00:00（新年）
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = tomorrow - now;
        
        if (timeRemaining <= 0) {
            // 新年到了！
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // 触发新年庆祝效果
            celebrateNewYear();
            return;
        }
        
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // 立即更新一次，然后每秒更新
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 初始化互动祝福卡片
function initInteractiveCard() {
    const sendBtn = document.getElementById('sendBtn');
    const friendNameInput = document.getElementById('friendName');
    const customMessageInput = document.getElementById('customMessage');
    const generatedCard = document.getElementById('generatedCard');
    
    sendBtn.addEventListener('click', function() {
        const friendName = friendNameInput.value.trim();
        const customMessage = customMessageInput.value.trim();
        
        if (!friendName) {
            alert('请输入朋友的名字！');
            friendNameInput.focus();
            return;
        }
        
        if (!customMessage) {
            alert('请输入祝福语！');
            customMessageInput.focus();
            return;
        }
        
        // 生成个性化祝福卡片
        const cardHTML = `
            <div class="personal-card">
                <div class="personal-card-header">
                    <i class="fas fa-gift"></i>
                    <h3>给 ${friendName} 的新年祝福</h3>
                </div>
                <div class="personal-card-body">
                    <p class="personal-message">${customMessage}</p>
                    <div class="personal-signature">
                        <p>—— 你的朋友</p>
                        <p class="personal-date">${new Date().toLocaleDateString('zh-CN')}</p>
                    </div>
                </div>
                <div class="personal-card-actions">
                    <button class="copy-btn" onclick="copyToClipboard()">
                        <i class="fas fa-copy"></i> 复制祝福语
                    </button>
                    <button class="share-btn" onclick="shareBlessing()">
                        <i class="fas fa-share-alt"></i> 分享祝福
                    </button>
                </div>
            </div>
        `;
        
        generatedCard.innerHTML = cardHTML;
        generatedCard.classList.add('show');
        
        // 添加一些样式到生成的卡片
        const style = document.createElement('style');
        style.textContent = `
            .personal-card {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .personal-card-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                color: white;
            }
            
            .personal-card-header i {
                font-size: 1.8rem;
            }
            
            .personal-card-header h3 {
                margin: 0;
                font-size: 1.4rem;
            }
            
            .personal-card-body {
                padding: 25px;
            }
            
            .personal-message {
                font-size: 1.1rem;
                line-height: 1.7;
                color: var(--text-color);
                margin-bottom: 20px;
                font-style: italic;
            }
            
            .personal-signature {
                text-align: right;
                color: var(--text-light);
                font-style: italic;
            }
            
            .personal-date {
                font-size: 0.9rem;
                margin-top: 5px;
            }
            
            .personal-card-actions {
                display: flex;
                gap: 15px;
                padding: 0 25px 25px;
            }
            
            .copy-btn, .share-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .copy-btn {
                background: rgba(255, 107, 107, 0.2);
                color: var(--primary-color);
            }
            
            .share-btn {
                background: rgba(78, 205, 196, 0.2);
                color: var(--secondary-color);
            }
            
            .copy-btn:hover, .share-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
        `;
        
        // 移除之前添加的样式（如果有）
        const existingStyle = document.getElementById('personal-card-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'personal-card-styles';
        document.head.appendChild(style);
        
        // 滚动到生成的卡片
        generatedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 触发庆祝效果
        triggerMiniCelebration();
    });
}

// 复制到剪贴板函数
function copyToClipboard() {
    const message = document.querySelector('.personal-message')?.textContent;
    if (message) {
        navigator.clipboard.writeText(message)
            .then(() => {
                alert('祝福语已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动选择文本复制。');
            });
    }
}

// 分享祝福函数
function shareBlessing() {
    const friendName = document.getElementById('friendName').value;
    const message = document.querySelector('.personal-message')?.textContent;
    
    if (navigator.share) {
        navigator.share({
            title: `给 ${friendName} 的新年祝福`,
            text: message,
            url: window.location.href
        })
        .then(() => console.log('分享成功'))
        .catch(error => console.log('分享失败', error));
    } else {
        alert('您的浏览器不支持分享功能，请手动复制链接分享。');
    }
}

// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('newYearTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> 切换主题';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> 切换主题';
            localStorage.setItem('newYearTheme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> 切换主题';
            localStorage.setItem('newYearTheme', 'light');
        }
    });
}

// 初始化烟花效果
function initFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    
    // 只在倒计时接近0时显示烟花
    function checkForFireworks() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeRemaining = tomorrow - now;
        const hoursRemaining = timeRemaining / (1000 * 60 * 60);
        
        // 如果距离新年不到1小时，开始显示烟花
        if (hoursRemaining < 1 && hoursRemaining > 0) {
            createFirework();
        }
    }
    
    // 创建单个烟花
    function createFirework() {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // 随机颜色
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd166', '#9d65ff', '#ff8e8e'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        firework.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 5px;
            height: 5px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 10px ${color};
            animation: explode 1s forwards;
            z-index: 1001;
        `;
        
        fireworksContainer.appendChild(firework);
        
        // 动画结束后移除元素
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }
    
    // 添加烟花动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes explode {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 定期检查是否需要显示烟花
    setInterval(checkForFireworks, 10000);
    
    // 每30秒随机显示一个烟花（为了效果）
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFirework();
        }
    }, 30000);
}

// 初始化音频控制
function initAudioControls() {
    const audioToggle = document.getElementById('audioToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const audio = document.getElementById('newYearSound');
    const icon = audioToggle.querySelector('i');
    
    // 设置初始音量
    audio.volume = volumeSlider.value / 100;
    
    // 音量滑块事件
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
    });
    
    // 静音/取消静音按钮
    audioToggle.addEventListener('click', function() {
        if (audio.muted) {
            audio.muted = false;
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            audioToggle.classList.remove('muted');
        } else {
            audio.muted = true;
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            audioToggle.classList.add('muted');
        }
    });
    
    // 监听音频错误
    audio.addEventListener('error', function() {
        console.error('音频加载失败，使用备用音乐源');
        // 可以在这里添加备用音乐源
    });
}

// 初始化气球动画
function initBalloons() {
    const balloonsContainer = document.getElementById('balloonsContainer');
    const balloonSound = document.getElementById('balloonSound');
    
    // 气球颜色
    const balloonColors = [
        'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
        'linear-gradient(135deg, #4ecdc4, #6ce6de)',
        'linear-gradient(135deg, #ffd166, #ffe28c)',
        'linear-gradient(135deg, #9d65ff, #b28cff)',
        'linear-gradient(135deg, #ff9a6b, #ffb28c)',
        'linear-gradient(135deg, #6bff8e, #8cffb2)'
    ];
    
    // 创建气球
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // 随机位置
        const left = Math.random() * 90 + 5; // 5% 到 95%
        
        // 随机颜色
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        
        // 随机大小
        const size = Math.random() * 30 + 50; // 50px 到 80px
        const height = size * 1.3;
        
        // 随机动画时长
        const duration = Math.random() * 15 + 20; // 20秒 到 35秒
        
        // 随机延迟
        const delay = Math.random() * 5;
        
        balloon.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${height}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        balloonsContainer.appendChild(balloon);
        
        // 气球动画结束后移除
        setTimeout(() => {
            if (balloon.parentNode) {
                // 播放气球爆炸音效
                if (balloonSound) {
                    balloonSound.currentTime = 0;
                    balloonSound.play().catch(e => console.log("音效播放失败"));
                }
                balloon.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    // 初始创建一些气球
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createBalloon(), i * 1000);
    }
    
    // 定期创建新气球
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% 概率创建新气球
            createBalloon();
        }
    }, 3000);
}

// 初始化祝福语弹出
function initBlessings() {
    const blessingsContainer = document.getElementById('blessingsContainer');
    
    // 祝福语库
    const blessings = [
        "新年快乐！🎉",
        "万事如意！✨",
        "身体健康！💪",
        "财源广进！💰",
        "心想事成！🌟",
        "阖家幸福！🏠",
        "事业有成！📈",
        "笑口常开！😊",
        "好运连连！🍀",
        "梦想成真！🎯",
        "平安喜乐！🕊️",
        "友谊长存！🤝",
        "天天开心！😄",
        "步步高升！📊",
        "幸福美满！💖",
        "吉祥如意！🧧",
        "福星高照！⭐",
        "前程似锦！🌈",
        "大吉大利！🍊",
        "年年有余！🐟"
    ];
    
    // 创建祝福语气泡
    function createBlessingBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'blessing-bubble';
        
        // 随机祝福语
        const blessing = blessings[Math.floor(Math.random() * blessings.length)];
        bubble.textContent = blessing;
        
        // 随机位置
        const left = Math.random() * 80 + 10; // 10% 到 90%
        const top = Math.random() * 50 + 30; // 30% 到 80%
        
        // 随机动画时长
        const duration = Math.random() * 3 + 4; // 4秒 到 7秒
        
        // 随机延迟
        const delay = Math.random() * 2;
        
        bubble.style.cssText = `
            left: ${left}%;
            top: ${top}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        blessingsContainer.appendChild(bubble);
        
        // 动画结束后移除
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    // 初始创建一些祝福语
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createBlessingBubble(), i * 800);
    }
    
    // 定期创建新祝福语
    setInterval(() => {
        if (Math.random() > 0.4) { // 60% 概率创建新祝福语
            createBlessingBubble();
        }
    }, 2000);
}

// 初始化动画
function initAnimations() {
    // 为祝福网格项添加交错动画
    const wishItems = document.querySelectorAll('.wish-item');
    wishItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 添加滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有卡片和部分
    const elementsToAnimate = document.querySelectorAll('.card, .interactive-section, .footer');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// 触发小型庆祝效果
function triggerMiniCelebration() {
    // 添加一些庆祝特效
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 50);
    }
    
    // 创建额外气球
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            // 调用气球创建函数
            const balloonsContainer = document.getElementById('balloonsContainer');
            if (balloonsContainer) {
                // 这里需要访问initBalloons中的createBalloon函数
                // 为了简化，我们直接触发气球创建
                const event = new Event('createBalloon');
                document.dispatchEvent(event);
            }
        }, i * 200);
    }
    
    // 创建额外祝福语
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            // 调用祝福语创建函数
            const blessingsContainer = document.getElementById('blessingsContainer');
            if (blessingsContainer) {
                // 这里需要访问initBlessings中的createBlessingBubble函数
                // 为了简化，我们直接触发祝福语创建
                const event = new Event('createBlessing');
                document.dispatchEvent(event);
            }
        }, i * 300);
    }
    
    // 播放庆祝声音（如果有）
    const audio = document.getElementById('newYearSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("音频播放需要用户交互"));
    }
}

// 新年庆祝函数
function celebrateNewYear() {
    // 显示大量烟花
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 100);
    }
    
    // 更新标题
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    
    if (mainTitle && subtitle) {
        mainTitle.textContent = '新年快乐！';
        subtitle.textContent = '新的一年已经开始，祝你万事如意！';
        
        // 添加庆祝动画
        mainTitle.classList.add('animate__animated', 'animate__tada');
        subtitle.classList.add('animate__animated', 'animate__heartBeat');
    }
    
    // 播放庆祝音乐
    const audio = document.getElementById('newYearSound');
    if (audio) {
        audio.volume = 0.5;
        audio.play().catch(e => console.log("音频播放需要用户交互"));
    }
    
    // 显示庆祝消息
    alert('🎉 新年快乐！ 🎉\n愿新的一年带给你健康、幸福和成功！');
}
