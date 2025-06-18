"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemInfoService = void 0;
const node_os_1 = require("node:os");
const core_1 = require("@midwayjs/core");
const diskinfo_1 = require("@dropb/diskinfo");
const data_1 = require("../../../framework/utils/date/data");
const parse_1 = require("../../../framework/utils/parse/parse");
/**服务器系统相关信息 服务层处理 */
let SystemInfoService = exports.SystemInfoService = class SystemInfoService {
    /**内置的信息服务，提供基础的项目数据 */
    midwayInformationService;
    /**主框架中的 app 对象 */
    app;
    /**程序项目信息 */
    projectInfo() {
        const pkg = this.midwayInformationService.getPkg();
        return {
            appDir: this.app.getAppDir(),
            env: this.app.getEnv(),
            name: pkg.name || '-',
            version: pkg.version || '-',
        };
    }
    /**系统信息 */
    systemInfo() {
        const runTime = this.app.getAttr('runTime');
        return {
            platform: (0, node_os_1.platform)(),
            platformVersion: (0, node_os_1.type)(),
            arch: (0, node_os_1.arch)(),
            archVersion: (0, node_os_1.release)(),
            os: (0, node_os_1.version)(),
            hostname: (0, node_os_1.hostname)(),
            bootTime: Math.ceil((0, node_os_1.uptime)()),
            processId: process.pid,
            runArch: process.arch,
            runVersion: process.version,
            runTime: Math.ceil((Date.now() - runTime) / 1000),
            homeDir: (0, node_os_1.homedir)(),
            cmd: process.cwd(),
            execCommand: [].concat(process.argv, process.execArgv).join(' '),
        };
    }
    /**系统时间信息 */
    timeInfo() {
        const now = new Date();
        const t = now.toString().split(' ');
        // 获取当前时间
        const current = (0, data_1.parseDateToStr)(now);
        // 获取时区
        let timezone = '';
        // 获取时区名称
        let timezoneName = '';
        if (t.length >= 7) {
            timezone = t[5];
            timezoneName = t.slice(6).join(' ').replace(/\(/g, '').replace(/\)/g, '');
        }
        return { current, timezone, timezoneName };
    }
    /**内存信息 */
    memoryInfo() {
        const memory = process.memoryUsage();
        const total = (0, node_os_1.totalmem)();
        const free = (0, node_os_1.freemem)();
        return {
            usage: ((1 - free / total) * 100).toFixed(2),
            freemem: (0, parse_1.parseBit)(free),
            totalmem: (0, parse_1.parseBit)(total),
            rss: (0, parse_1.parseBit)(memory.rss),
            heapTotal: (0, parse_1.parseBit)(memory.heapTotal),
            heapUsed: (0, parse_1.parseBit)(memory.heapUsed),
            external: (0, parse_1.parseBit)(memory.external), // 外部内存大小（非堆）
        };
    }
    /**CPU信息 */
    cpuInfo() {
        let model = '-';
        let speed = '-';
        let core = 0;
        const cpuInfo = (0, node_os_1.cpus)();
        if (cpuInfo.length > 0 && cpuInfo[0]) {
            core = cpuInfo.length;
            speed = `${cpuInfo[0].speed}MHz`;
            model = cpuInfo[0].model.trim();
        }
        const used = [];
        for (const item of cpuInfo) {
            const v = item.times;
            const value = v.idle + v.user + v.nice + v.sys + v.irq;
            used.push(Number((1 - v.idle / value) * 100).toFixed(2));
        }
        return {
            model: model,
            speed: speed,
            core: core,
            coreUsed: used,
        };
    }
    /**网络信息 */
    networkInfo() {
        const ipAdders = {};
        const interfaces = (0, node_os_1.networkInterfaces)();
        for (const v of Object.keys(interfaces)) {
            let name = v;
            if (name[name.length - 1] === '0') {
                name = name.slice(0, -1);
                name = name.trim();
            }
            // ignore localhost
            if (name.startsWith('lo') ||
                name.startsWith('veth') ||
                name.startsWith('Loopback')) {
                continue;
            }
            const arr = [];
            const addrs = interfaces[v];
            for (const v of addrs) {
                if (v.family === 'IPv6' && v.address.includes('::')) {
                    arr.push('IPv6 ' + v.address);
                }
                if (v.family === 'IPv4' && v.address.includes('.')) {
                    arr.push('IPv4 ' + v.address);
                }
            }
            ipAdders[v] = arr.join(' / ');
        }
        return ipAdders;
    }
    /**磁盘信息 */
    async diskInfo() {
        const disks = await (0, diskinfo_1.diskinfo)();
        const diskInfos = disks.map(disk => {
            return {
                size: (0, parse_1.parseBit)(disk.size),
                used: (0, parse_1.parseBit)(disk.used),
                avail: (0, parse_1.parseBit)(disk.avail),
                percent: disk.pcent,
                target: disk.target,
            };
        });
        return diskInfos;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", core_1.MidwayInformationService)
], SystemInfoService.prototype, "midwayInformationService", void 0);
__decorate([
    (0, core_1.App)('koa'),
    __metadata("design:type", Object)
], SystemInfoService.prototype, "app", void 0);
exports.SystemInfoService = SystemInfoService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SystemInfoService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtX2luZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tb25pdG9yL3NlcnZpY2Uvc3lzdGVtX2luZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBYWlCO0FBRWpCLHlDQU13QjtBQUV4Qiw4Q0FBMkM7QUFFM0MsNkRBQW9FO0FBQ3BFLGdFQUFnRTtBQUVoRSxxQkFBcUI7QUFHZCxJQUFNLGlCQUFpQiwrQkFBdkIsTUFBTSxpQkFBaUI7SUFDNUIsdUJBQXVCO0lBRWYsd0JBQXdCLENBQTJCO0lBRTNELGtCQUFrQjtJQUVWLEdBQUcsQ0FBYztJQUV6QixZQUFZO0lBQ0wsV0FBVztRQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkQsT0FBTztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtZQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRztZQUNyQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHO1NBQzVCLENBQUM7SUFDSixDQUFDO0lBRUQsVUFBVTtJQUNILFVBQVU7UUFDZixNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLElBQUEsa0JBQVEsR0FBRTtZQUNwQixlQUFlLEVBQUUsSUFBQSxjQUFJLEdBQUU7WUFDdkIsSUFBSSxFQUFFLElBQUEsY0FBSSxHQUFFO1lBQ1osV0FBVyxFQUFFLElBQUEsaUJBQU8sR0FBRTtZQUN0QixFQUFFLEVBQUUsSUFBQSxpQkFBTyxHQUFFO1lBQ2IsUUFBUSxFQUFFLElBQUEsa0JBQVEsR0FBRTtZQUNw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