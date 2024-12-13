<script>
    import { queryVehicleInfo, validateIdCard ,queryClsbdhInfo } from '$lib/api';
    import { faUser, faUserXmark } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { hpzl, zt, dybj } from '$lib/zl';
    import * as XLSX from 'xlsx';

    let sfzmhm = '';
    let input_code = '';
    let queryResult = null;
    let error = null;
    let isValidId = 0;
    let clsbdh = '';

    async function validateId() {
        if (sfzmhm.length === 18) {
            try {
                const response = await validateIdCard(sfzmhm);
                isValidId = response;
            } catch (err) {
                console.error('身份证验证失败:', err);
                isValidId = 0;
            }
        } else {
            isValidId = 0;
        }
    }

    async function handleQuery() {
        

        try {
            error = null;
            queryResult = null;
            if (sfzmhm && clsbdh) {
            error = "请勿同时输入身份证号和车架号查询";
            }
            else{   
            if (sfzmhm) {
                queryResult = await queryVehicleInfo(sfzmhm, input_code);
            }
            if (clsbdh) {
                queryResult = await queryClsbdhInfo(clsbdh, input_code);
            }}
        } catch (err) {
            error = "系统异常，请联系张硕";
            queryResult = null;
        }
        input_code='';
       
    }

    $: if (sfzmhm.length === 18) {
        validateId();
    } else {
        isValidId = 0;
    }

    function exportToExcel() {
        if (!queryResult?.data || !Array.isArray(queryResult.data)) return;
        
        // Transform data for Excel
        const excelData = queryResult.data.map(item => ({
            '号牌种类': hpzl[item.hpzl],
            '号牌号码': item.hphm,
            '所有人': item.syr,
            '车辆识别代号': item.clsbdh,
            '抵押标记': dybj[item.dybj],
            '状态': item.zt ? item.zt.split('').map(letter => zt[letter] || '未知').join('、') : '错误'
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "查询结果");

        // Generate filename
        const searchTerm = sfzmhm || clsbdh;
        const filename = `${searchTerm}的查询结果.xlsx`;

        // Export file
        XLSX.writeFile(wb, filename);
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
        <div style="width: 20px; text-align: center;">
            {#if isValidId === 1}
                <Fa icon={faUser} color="green"/>
            {:else if isValidId === 2}
                <Fa icon={faUserXmark} color="red"/>
            {/if}
        </div>
        <label for="clsbdh" class="mb-0">车辆识别代号</label>
        <input 
            type="text" 
            class="form-control" 
            style="width: 300px;"
            id="clsbdh" 
            bind:value={clsbdh}
        >
        <label for="input_code" class="mb-0">授权码</label>
        <input 
            type="password" 
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
        
        {#if queryResult && queryResult.data && Array.isArray(queryResult.data) && queryResult.data.length > 0}
            <button 
                class="btn btn-success" 
                on:click={exportToExcel}
            >
                导出Excel
            </button>
        {/if}
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
                授权码错误，请重新输入！
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
                            <th class="fw-bold text-center">车辆识别代号<small>（部分加密）</small></th>
                            <th class="fw-bold text-center">抵押标记</th>
                            <th class="fw-bold text-center">状态</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        {#each queryResult.data as item}
                            <tr class="align-middle">
                                <td class="text-center">{hpzl[item.hpzl]}</td>
                                <td class="text-center">{item.hphm}</td>
                                <td class="text-center">{item.syr}</td>
                                <td class="text-center">{item.clsbdh.slice(0, 6) + '***' + item.clsbdh.slice(-6)}</td>
                                <td class="text-center">{dybj[item.dybj]}</td>
                                <td class="text-center">
                                    {#if item.zt}
                                        {item.zt.split('').map(letter => zt[letter] || '未知').join('、')}
                                    {:else}
                                        错误
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
