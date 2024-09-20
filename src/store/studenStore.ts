import { defineStore } from './index';
import {exportStudents} from '../api/services';
export const useStudentStore = defineStore({
    id: 'StudentStore',
    state: () => ({

    }),
    actions: {
        async handleExport(tableName: string,fileName:string) {
            console.log(fileName)
            const data = await exportStudents(tableName,fileName);
            if (data) {
                // 导出成功，处理返回的数据
            } else {
                // 导出失败，处理错误
            }
        },
    },
});
