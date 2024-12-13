<script>
    import 'core-js/stable';
    import 'regenerator-runtime/runtime';
    import { queryVehicleInfo, validateIdCard ,queryClsbdhInfo } from '$lib/api';
    import { faUser, faUserXmark } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { hpzl, zt, dybj } from '$lib/zl';
    import * as XLSX from 'xlsx';
    import GradientBar from '$lib/components/GradientBar.svelte';

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
            } else {   
                if (sfzmhm) {
                    queryResult = await queryVehicleInfo(sfzmhm, input_code);
                }
                if (clsbdh) {
                    queryResult = await queryClsbdhInfo(clsbdh, input_code);
                }
            }
        } catch (err) {
            error = "系统异常，请联系张硕";
            queryResult = null;
        }
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

<GradientBar intervalTime={5000} />

<div class="container-fluid mt-5">
    <h1  style="padding-bottom: 20px;"class="text-center">档案基本信息查询</h1>
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
        <div style="width: 100px; text-align: center;">
        {#if queryResult && queryResult.data && Array.isArray(queryResult.data) && queryResult.data.length > 0}
            <button 
                class="btn btn-success"
                on:click={exportToExcel}
            >
                导出Excel
            </button>
        {/if}
     </div>
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

      <!-- 底部版权声明 -->
  <div class="fixed-bottom text-center mb-2">
    <small class="text-muted">
      &copy;2024  | 此网站属于业务监督科<b>张硕</b>唯一所有 | 仅授权业务监督科或档案科特定授权人员查询使用 | <b style="color: red;">网站查询全部有日志审计记录，请按需使用！</b> | 如遇故障请联系 13920148266 | <b>保留所有权利</b>
      <br />
      <b style="color: red;">重要安全提示：授权码仅可向已授权使用该网站人员提供。向非授权人员泄露授权码行为为严重违反数据安全行为，网站作者对泄露授权码产生的安全事件不负责，其责任由泄露授权码人员承担！</b>
      <br />
      <small>编码技术栈 前端：SvelteKit + Bootstrap | 后端：Python + FastAPI | 代码辅助：Cursor | 数据库：SQLlite</small>
  </div>
</div>

