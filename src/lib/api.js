import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8004';

export async function queryVehicleInfo(sfzmhm, input_code) {
    try {
        const response = await axios.post(`${API_BASE_URL}/check`, {
            sfzmhm: sfzmhm,
            input_code: input_code
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('查询失败:', error);
        throw error;
    }
}

export async function queryClsbdhInfo(clsbdh, input_code) {
    try {
        const response = await axios.post(`${API_BASE_URL}/checkclsbdh`, {
            clsbdh: clsbdh,
            input_code: input_code
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('查询失败:', error);
        throw error;
    }
}

export async function getVerificationCode() {
    try {
        const response = await axios.get(`${API_BASE_URL}/rd`);
        if (response.data.status === 'success') {
            return response.data.data;
        } else {
            throw new Error('获取验证码失败');
        }
    } catch (error) {
        console.error('获取验证码失败:', error);
        throw error;
    }
}

export async function validateIdCard(sfzmhm) {
    try {
        const response = await axios.post(`${API_BASE_URL}/validate_code`, {
            sfzmhm: sfzmhm
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('身份证验证失败:', error);
        throw error;
    }
} 
export async function queryHistoryInfo(sfzmhm, input_code) {
    try {
        const response = await axios.post(`${API_BASE_URL}/check_history`, {
            sfzmhm: sfzmhm,
            input_code: input_code
        });
        return response.data.data;
    } catch (error) {
        console.error('历史车查询失败:', error);
        throw error;
    }
}

