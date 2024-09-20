import api from './api';
import {students} from "../models/students";

export const login = async (username: string, password: string) => {
    try {
        const responsePromise:RES<Login> = api.post('/user/login', {
            userAccount:username,
            userPassword:password
        });
        const response = await responsePromise;
        if (response.code === 0) {
            console.log('登录成功');
            console.log('Token:', response.data.token);
            console.log('Refresh Token:', response.data.refreshToken);
            localStorage.setItem('token', response.data.token); // 保存 token 到 localStorage
            return response.data;
        } else {
            console.log('登录失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};


export const getCurrent = async ():Promise<Current | null> => {
    try {
        const response: result<Current> = await api.get('/user/current');
        if (response.code === 0) {
            console.log('获取用户数据成功');
            return response.data;
        } else {
            console.log('获取用户数据失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};

/*
*
* 获取学生列表
* */
export const getStudents = async (
    params: {
        page?: number,
        profession?: string,
        size?: number,
        studentGrade?: string,
        studentName?: string,
        gender?: number
    }
): Promise<students[] | null> => {
    try {
        const response: result<resultData<students>> = await api.get('/students/search', {
            params,
        });
        if (response.code === 0) {
            console.log('获取学生列表成功');
            return response.data.list;
        } else {
            console.log('获取学生列表失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
//获取照片列表
export const searchPhotoAlbum = async (
    params: {
        category?: string,
        name?: string,
        page?: number,
        size?: number
    }
): Promise<photoAlbum[] | null> => {
    try {
        const response: result<resultData<photoAlbum>> = await api.get('/photoAlbum/search', {
            params,
        });
        if (response.code === 0) {
            console.log('获取相册列表成功');
            return response.data.list;
        } else {
            console.log('获取相册列表失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
//上传图片
export const uploadImage = async (file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response:result<any> = await api.post('/photoAlbum/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.code === 0) {
            console.log('图片上传成功');
            return response.data;
        } else {
            console.log('图片上传失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
/*
*
* 修改用户信息
* */

export const updateUser = async (userInfo: {
    avatarUrl: string,
    email?: string,
    gender: number,
    id: number,
    phone?: string,
    signature?: string,
    tags?: string,
    username?: string
}): Promise<any> => {
    try {
        const response:result<null> = await api.put('/user/update', userInfo);
        if (response.code === 0) {
            console.log('用户信息更新成功');
            return response;
        } else {
            console.log('用户信息更新失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
//获取相册分类
export const getPhotoAlbumCategories = async (): Promise<any> => {
    try {
        const response: result<any> = await api.get('/photoAlbum/categories');
        if (response.code === 0) {
            console.log('获取相册类别成功');
            return response.data;
        } else {
            console.log('获取相册类别失败:', response.message);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};

/*
* 导出学生信息
* */
export const exportStudents = async (tableName: string, defaultFileName: string = 'file.xlsx'): Promise<any> => {
    try {
        const response = await api.get(`/students/export/${tableName}`, { responseType: 'blob' });
        console.log(response);
        if (response.data) {
            const {URL} = window;
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            let fileName = defaultFileName;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, '');
                }
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } else {
            console.error('响应数据为空');
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
// 注册
export const register = async (userAccount: string, userPassword: string, checkPassword: string) => {
    try {
        const response: result<any>  = await api.post('/user/register', {
            userAccount,
            userPassword,
            checkPassword
        });
        if (response.code === 0) {
            console.log('注册成功');
        }
        return response;
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
};
