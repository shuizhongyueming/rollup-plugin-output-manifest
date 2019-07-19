"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
async function readJSON(path, option = { encoding: "utf-8", flag: "r" }) {
    const content = await fs_1.default.promises.readFile(path, option);
    const json = JSON.parse(content);
    return json;
}
exports.readJSON = readJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBQW9CO0FBRWIsS0FBSyxVQUFVLFFBQVEsQ0FDNUIsSUFBWSxFQUNaLFNBR0ksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7SUFFcEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsTUFBTSxJQUFJLEdBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFpQixDQUFDLENBQUM7SUFDOUMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVkQsNEJBVUMifQ==