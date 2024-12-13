<script>
    import { onMount, onDestroy } from "svelte";
  
    export let intervalTime = 5000; // 时间间隔 (毫秒)
    let colors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]; // 初始颜色
  
    // 生成随机颜色
    const randomColor = () =>
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  
    // 随机更新所有颜色块
    const updateColors = () => {
      colors = colors.map(() => randomColor());
    };
  
    let interval;
  
    // 自动更新颜色
    onMount(() => {
      interval = setInterval(() => {
        updateColors();
      }, intervalTime);
    });
  
    // 清理定时器
    onDestroy(() => {
      clearInterval(interval);
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
  