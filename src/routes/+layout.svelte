<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  
  let theme = 'auto';
  
  onMount(() => {
    // 导入 Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    
    // 获取保存的主题设置
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
      }
    });
  });

  function setTheme(newTheme) {
    if (!browser) return;
    
    theme = newTheme;
    if (theme === 'auto') {
      // 检查系统主题
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
      }
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }
</script>

<div class="app" data-bs-theme={browser ? undefined : 'light'}>
  <!-- 主题切换按钮 -->
  <div class="theme-switch position-fixed top-0 end-0 m-3">
    <div class="dropdown">
      <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        {#if theme === 'auto'}
          <i class="bi bi-circle-half"></i>
        {:else if theme === 'light'}
          <i class="bi bi-sun-fill"></i>
        {:else}
          <i class="bi bi-moon-fill"></i>
        {/if}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="themeDropdown">
        <li><button class="dropdown-item" on:click={() => setTheme('auto')}>
            <i class="bi bi-circle-half me-2"></i>自动
          </button></li>
        <li><button class="dropdown-item" on:click={() => setTheme('light')}>
          <i class="bi bi-sun-fill me-2"></i>浅色
        </button></li>
        <li><button class="dropdown-item" on:click={() => setTheme('dark')}>
          <i class="bi bi-moon-fill me-2"></i>深色
        </button></li>
        
      </ul>
    </div>
  </div>

  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  
  .app {
    min-height: 100vh;
  }
</style> 