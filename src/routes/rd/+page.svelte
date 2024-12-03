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
        color: #333;
    }



    .error {
        color: red;
        text-align: center;
    }
</style> 