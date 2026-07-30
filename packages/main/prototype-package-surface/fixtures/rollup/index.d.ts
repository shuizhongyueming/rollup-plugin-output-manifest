export interface Plugin {
  name: string;
}

export interface OutputAsset {
  type: "asset";
  fileName: string;
  name?: string;
}

export interface OutputChunk {
  type: "chunk";
  fileName: string;
  name: string;
  isEntry: boolean;
}
