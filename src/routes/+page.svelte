<script>
    import { queryVehicleInfo } from '$lib/api';

    let sfzmhm = '';
    let input_code = '';
    let queryResult = null;
    let error = null;

    async function handleQuery() {
        try {
            error = null;
            queryResult = await queryVehicleInfo(sfzmhm, input_code);
        } catch (err) {
            error = "系统异常，请联系张硕";
            queryResult = null;
        }
    }
</script>

<div class="container-fluid mt-5">
    <div class="d-flex justify-content-center align-items-center gap-3">
        <label for="sfzmhm" class="mb-0">身份证明号码</label>
        <input 
            type="text" 
            class="form-control" 
            style="width: 200px;"
            id="sfzmhm" 
            bind:value={sfzmhm}
        >
        <label for="input_code" class="mb-0">授权码</label>
        <input 
            type="text" 
            class="form-control" 
            style="width: 100px;"
            id="input_code" 
            bind:value={input_code}
        >
        <button 
            class="btn btn-primary" 
            on:click={handleQuery}
        >
            查询
        </button>
    </div>

    {#if error}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-danger" role="alert">
                {error}
            </span>
        </div>
    {/if}

    {#if queryResult && queryResult.status === "success" && queryResult.data === "验证码错误"}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-warning" role="alert">
                验证码错误，请重新输入！
            </span>
        </div>
    {:else if queryResult && queryResult.status === "success" && queryResult.data === "null"}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-success" role="alert">
                名下无车辆
            </span>
        </div>
    {:else if queryResult && queryResult.data && Array.isArray(queryResult.data)}
        <div class="d-flex justify-content-center mt-4">
            <div class="table-responsive">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <tr>
                            <th class="fw-bold text-center">号牌种类</th>
                            <th class="fw-bold text-center">号牌号码</th>
                            <th class="fw-bold text-center">所有人</th>
                            <th class="fw-bold text-center">车辆识别代号</th>
                            <th class="fw-bold text-center">抵押标记</th>
                            <th class="fw-bold text-center">状态</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        {#each queryResult.data as item}
                            <tr class="align-middle">
                                <td class="text-center">{item.hpzl}</td>
                                <td class="text-center">{item.hphm}</td>
                                <td class="text-center">{item.syr}</td>
                                <td class="text-center">{item.clsbdh}</td>
                                <td class="text-center">{item.dybj}</td>
                                <td class="text-center">{item.zt}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
