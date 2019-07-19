"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(path, data, { encoding: "utf8" }, e => {
            if (e) {
                reject(e);
            }
            else {
                resolve();
            }
        });
    });
}
exports.writeFile = writeFile;
function readFile(path, option = { encoding: "utf-8", flag: "r" }) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, option, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.readFile = readFile;
async function readJSON(path, option = { encoding: "utf-8", flag: "r" }) {
    const content = await readFile(path, option);
    const json = JSON.parse(content);
    return json;
}
exports.readJSON = readJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBQW9CO0FBRXBCLFNBQWdCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsSUFBWTtJQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLFlBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsRUFBRTtnQkFDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWDtpQkFBTTtnQkFDTCxPQUFPLEVBQUUsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFWRCw4QkFVQztBQUVELFNBQWdCLFFBQVEsQ0FDdEIsSUFBWSxFQUNaLFNBR0ksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7SUFFcEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxZQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2I7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWhCRCw0QkFnQkM7QUFFTSxLQUFLLFVBQVUsUUFBUSxDQUM1QixJQUFZLEVBQ1osU0FHSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUVwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsTUFBTSxJQUFJLEdBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFpQixDQUFDLENBQUM7SUFDOUMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVkQsNEJBVUMifQ==