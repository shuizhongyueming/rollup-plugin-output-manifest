import fs from "fs";

export async function readJSON<T = object>(
  path: string,
  option: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
  } = { encoding: "utf-8", flag: "r" }
) {
  const content = await fs.promises.readFile(path, option);
  const json: T = JSON.parse(content as string);
  return json;
}
