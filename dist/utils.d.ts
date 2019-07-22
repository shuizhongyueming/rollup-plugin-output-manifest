export declare function readJSON<T = object>(path: string, option?: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
}): Promise<T>;
