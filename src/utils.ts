import fs from "fs";

export function writeFile(path: string, data: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, { encoding: "utf8" }, e => {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
}

export function readFile(
  path: string,
  option: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
  } = { encoding: "utf-8", flag: "r" }
) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, option, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function readJSON<T>(
  path: string,
  option: {
    encoding?: string | null | undefined;
    flag?: string | undefined;
  } = { encoding: "utf-8", flag: "r" }
) {
  const content = await readFile(path, option);
  const json: T = JSON.parse(content as string);
  return json;
}
