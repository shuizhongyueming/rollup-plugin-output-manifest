export declare function writeFile(path: string, data: string): Promise<{}>;
export declare function readFile(path: string, option?: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
}): Promise<{}>;
export declare function readJSON<T>(path: string, option?: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
}): Promise<T>;
