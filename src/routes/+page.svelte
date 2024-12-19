<script>
    import 'core-js/stable';
    import 'regenerator-runtime/runtime';
    import { queryVehicleInfo, validateIdCard ,queryClsbdhInfo, queryHistoryInfo } from '$lib/api';
    import { faUser, faUserXmark } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { hpzl, zt, dybj, zrbj } from '$lib/zl';
    import * as XLSX from 'xlsx';
    import GradientBar from '$lib/components/GradientBar.svelte';

    let sfzmhm = '';
    let input_code = '';
    let queryResult = null;
    let error = null;
    let isValidId = 0;
    let clsbdh = '';
    let queryHistoryResult = null;

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
            queryHistoryResult = null;
            
            if (sfzmhm && clsbdh) {
                error = "请勿同时输入身份证号和车架号查询";
                return;
            }
            
            if (!sfzmhm && !clsbdh) {
                error = "请输入身份证号或车架号";
                return;
            }

            if (!input_code) {
                error = "请输入授权码";
                return;
            }

            if (sfzmhm) {
                queryResult = await queryVehicleInfo(sfzmhm, input_code);
            }
            if (clsbdh) {
                queryResult = await queryClsbdhInfo(clsbdh, input_code);
            }
        } catch (err) {
            error = "系统异常，请联系张硕";
            queryResult = null;
        }
    }

    async function handleHistoryQuery() {
        try {
            error = null;
            queryResult = null;
            queryHistoryResult = null;
            
            if (clsbdh) {
                error = "请勿通过车架号方式查询历史车信息，请直接通过身份证号查询。若仍要查询，请使用六合一流水查询功能。";
                return;
            }
            
            if (!sfzmhm) {
                error = "请输入身份证号";
                return;
            }

            if (!input_code) {
                error = "请输入授权码";
                return;
            }

            queryHistoryResult = await queryHistoryInfo(sfzmhm, input_code);
        } catch (err) {
            error = "系统异常，请联系张硕";
            queryHistoryResult = null;
        }
    }

    $: if (sfzmhm.length === 18) {
        validateId();
    } else {
        isValidId = 0;
    }

    function exportToExcel() {
        let excelData;
        let filename;

        if (queryResult?.data && Array.isArray(queryResult.data)) {
            excelData = queryResult.data.map(item => ({
                '号牌种类': hpzl[item.hpzl],
                '号牌号码': item.hphm,
                '所有人': item.syr,
                '车辆识别代号': item.clsbdh,
                '抵押标记': dybj[item.dybj],
                '状态': item.zt ? item.zt.split('').map(letter => zt[letter] || '未知').join('、') : '错误'
            }));
            filename = `${sfzmhm || clsbdh}_名下车辆查询结果.xlsx`;
        } else if (queryHistoryResult && Array.isArray(queryHistoryResult)) {
            excelData = queryHistoryResult.map(item => ({
                '号牌种类': hpzl[item.hpzl],
                '车辆品牌': item.clpp1,
                '转入前号牌': item.zrqhp,
                '转入前所有人': item.zrqsyr,
                '转入后号牌': item.zrhhp,
                '转入后所有人': item.zrhsyr,
                '现号牌号码': item.xhphm,
                '现所有人': item.xsyr,
                '现状态': item.xzt ? item.xzt.split('').map(letter => zt[letter] || '未知').join('、') : '错误',
                '转入标记': item.zrbj,
                '转出地': item.zcd,
                '转入地': item.zrd
            }));
            filename = `${sfzmhm}_历史车辆查询结果.xlsx`;
        } else {
            return;
        }

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "查询结果");
        XLSX.writeFile(wb, filename);
    }
</script>

<GradientBar intervalTime={5000} />

<div class="container-fluid mt-5">
    <h1  style="padding-bottom: 20px;"class="text-center">基本信息查询</h1>
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
            当前车
        </button>
        <button 
            class="btn btn-primary" 
            on:click={handleHistoryQuery}
        >
            历史车
        </button>
        <div style="width: 120px;">
            {#if (queryResult?.data && Array.isArray(queryResult.data)) || (queryHistoryResult && Array.isArray(queryHistoryResult))}
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
    {:else if queryResult?.data === "验证码错误"}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-warning" role="alert">
                授权码错误，请重新输入！
            </span>
        </div>
    {:else if queryResult?.data === "null"}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-info" role="alert">
                查无名下车辆信息
            </span>
        </div>
    {:else if queryHistoryResult === "null"}
        <div class="d-flex justify-content-center mt-3">
            <span class="alert alert-info" role="alert">
                查无历史车辆信息
            </span>
        </div>
    {:else if queryResult?.data && Array.isArray(queryResult.data)}
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
    {:else if queryHistoryResult && Array.isArray(queryHistoryResult)}
        <div class="d-flex justify-content-center mt-4">
            <div class="table-responsive">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <tr>
                            <th class="fw-bold text-center small">号牌种类</th>
                            <th class="fw-bold text-center small">车辆品牌</th>
                            <th class="fw-bold text-center small">转入前号牌</th>
                            <th class="fw-bold text-center small">转入前所有人</th>
                            <th class="fw-bold text-center small">转入后号牌</th>
                            <th class="fw-bold text-center small">转入后所有人</th>
                            <th class="fw-bold text-center small">现号牌号码</th>
                            <th class="fw-bold text-center small">现所有人</th>
                            <th class="fw-bold text-center small">现状态</th>
                            <!-- <th class="fw-bold text-center small">转入标记</th>
                            <th class="fw-bold text-center small">转出地</th> -->
                            <th class="fw-bold text-center small">转入地</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        {#each queryHistoryResult as item}
                            <tr class="align-middle">
                                <td class="text-center small">{hpzl[item.hpzl]}</td>
                                <td class="text-center small">{item.clpp1}</td>
                                <td class="text-center small">{item.zrqhp}</td>
                                <td class="text-center small">{item.zrqsyr}</td>
                                <td class="text-center small">{item.zrhhp}</td>
                                <td class="text-center small">{item.zrhsyr}</td>
                                <td class="text-center small">{item.xhphm}</td>
                                <td class="text-center small">{item.xsyr}</td>
                                <td class="text-center small">
                                    {#if item.xzt}
                                        {item.xzt.split('').map(letter => zt[letter] || '未知').join('、')}
                                    {:else}
                                        错误
                                    {/if}
                                </td>
                                <!-- <td class="text-center small">{zrbj[item.zrbj]}</td>
                                <td class="text-center small">{item.zcd}</td> -->
                                <td class="text-center small">{item.zrd}</td>
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
      &copy;2024 | 此网站仅授权特定授权人员查询使用 | <b style="color: red;">网站查询全部有日志审计记录，请按需使用！</b> | 如遇故障请联系 3079 | 该网站原作者<b>保留所有权利</b>
      <br />
      <b style="color: red;">重要安全提示：授权码仅可向已授权使用该网站人员提供。向非授权人员泄露授权码行为为严重违反数据安全行为，网站作者对泄露授权码产生的安全事件不负责，其责任由泄露授权码人员承担！</b>
      <br />
      <small>编码技术栈 前端：SvelteKit + Bootstrap | 后端：Python + FastAPI | 代码辅助：Cursor | 数据库：SQLlite</small>
  </div>
</div>

