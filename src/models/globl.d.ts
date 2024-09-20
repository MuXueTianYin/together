type RES<T> = Promise<result<T>>
type result<T> = {
    code: number;
    message: string;
    data: T;
    description?:string;
};
type resultData<T>={
    list:T[];
    total:number;
    size:number;
    current:number;
}

