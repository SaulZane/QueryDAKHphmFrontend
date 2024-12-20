<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from '$app/environment';
  
    export let intervalTime = 5000; // 时间间隔 (毫秒)
    
    // 初始设置一个默认颜色
    let colors = Array(5).fill('#FFFFFF');
    let interval;
    let themeObserver;
  
    // 生成随机颜色，根据主题调整亮度范围
    const randomColor = () => {
        if (!browser) return '#FFFFFF';
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        
        
            // 深色主题：生成偏暗的随机颜色 (0-128)
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                
    };
  
    // 随机更新所有颜色块
    const updateColors = () => {
        colors = colors.map(() => randomColor());
    };
  
    // 监听主题变化
    function setupThemeObserver() {
        if (!browser) return;
        
        const callback = () => {
            // 主题变化时立即更新颜色
            updateColors();
        };
        
        themeObserver = new MutationObserver(callback);
        themeObserver.observe(document.documentElement, { attributes: true });
    }
  
    onMount(() => {
        // 初始化时生成随机颜色
        updateColors();
        setupThemeObserver();
        interval = setInterval(updateColors, intervalTime);
    });
  
    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
        if (themeObserver) {
            themeObserver.disconnect();
        }
    });
</script>
  
<style>
    .gradient-bar {
        display: flex;
        width: 100%;
        height: 5px;
    }
  
    .color-block {
        flex: 1;
        transition: background-color 3s ease;
    }
</style>
  
<div class="gradient-bar">
    {#each colors as color}
        <div class="color-block" style="background-color: {color};"></div>
    {/each}
</div>
  