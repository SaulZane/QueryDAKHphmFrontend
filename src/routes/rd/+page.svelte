<script>
    import { onMount } from 'svelte';
    import { getVerificationCode } from '$lib/api';

    let verificationCode = '';
    let error = '';

    async function fetchVerificationCode() {
        try {
            verificationCode = await getVerificationCode();
        } catch (err) {
            error = '获取验证码失败: ' + err.message;
        }
    }

    onMount(() => {
        fetchVerificationCode();
    });
</script>

<div class="container">
    {#if error}
        <p class="error">{error}</p>
    {:else}
        <div class="code-display">
            <h2>授权码</h2>
            <div class="code">{verificationCode}</div>
        </div>
    {/if}
    
</div>
<div class="fixed-bottom text-center mb-2">
    <small class="text-muted">
        <b style="color: red;">重要安全提示：授权码仅可向已授权使用该网站人员提供。向非授权人员泄露授权码行为为严重违反数据安全行为，网站作者对泄露授权码产生的安全事件不负责，其责任由泄露授权码人员承担！网站查询全部有日志审计记录，请按需使用！</b>
      
  </div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
    }

    .code-display {
        text-align: center;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .code {
        font-size: 3rem;
        font-weight: bold;
        letter-spacing: 4px;
        margin: 1rem 0;
    }



    .error {
        color: red;
        text-align: center;
    }
</style> 