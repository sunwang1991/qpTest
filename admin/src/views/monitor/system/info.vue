<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <Monitor style="width: 1em; height: 1em; vertical-align: middle" />
            <strong style="vertical-align: middle; margin-left: 4px">
              项目信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">项目名称</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.project">
                      {{ server.project.name }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">项目版本</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.project">
                      {{ server.project.version }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">项目环境</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.project">
                      {{ server.project.env }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">项目路径</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.project">
                      {{ server.project.appDir }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <CoffeeCup
              style="width: 1em; height: 1em; vertical-align: middle"
            />
            <strong style="vertical-align: middle; margin-left: 4px">
              系统信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">系统平台</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.platform }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">平台版本</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.platformVersion }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">系统OS</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.os }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">系统架构</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.arch }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">架构版本</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.archVersion }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">系统运行</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ loadUpTime(server.system.bootTime) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">程序环境</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.runVersion }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">程序架构</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.runArch }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">程序运行</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ loadUpTime(server.system.runTime) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">主机名称</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.hostname }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">主机用户目录</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.homeDir }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">程序PID</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.system">
                      {{ server.system.processId }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="el-table__cell is-leaf">
              <strong class="cell">项目路径</strong>
              <div class="cell" v-if="server.system">
                {{ server.system.cmd }}
              </div>
            </div>
            <div class="el-table__cell is-leaf">
              <strong class="cell">执行命令</strong>
              <div class="cell" v-if="server.system">
                {{ server.system.execCommand }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <Cpu style="width: 1em; height: 1em; vertical-align: middle" />
            <strong style="vertical-align: middle; margin-left: 4px">
              CPU信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">型号</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.model }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">速率Hz</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.speed }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">核心数</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.core }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">使用率(%)</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.coreUsed }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <Tickets style="width: 1em; height: 1em; vertical-align: middle" />
            <strong style="vertical-align: middle; margin-left: 4px">
              内存信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">总内存</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.totalmem }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">剩余内存</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.freemem }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">使用率(%)</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.usage }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">进程总内存</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.rss }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">堆的总大小</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.heapTotal }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">堆已分配</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.heapUsed }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">链接库占用</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ server.memory.external }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <Monitor style="width: 1em; height: 1em; vertical-align: middle" />
            <strong style="vertical-align: middle; margin-left: 4px">
              时间信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">时间</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.time">
                      {{ server.time.current }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">时区</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.time">
                      {{ server.time.timezone }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">时区名称</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.time">
                      {{ server.time.timezoneName }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <Monitor style="width: 1em; height: 1em; vertical-align: middle" />
            <strong style="vertical-align: middle; margin-left: 4px">
              网络信息
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr v-for="(value, name) in server.network">
                  <td class="el-table__cell is-leaf">
                    <strong class="cell">{{ name }}</strong>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ value }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <MessageBox
              style="width: 1em; height: 1em; vertical-align: middle"
            />
            <strong style="vertical-align: middle; margin-left: 4px">
              磁盘状态
            </strong>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf">
                    <strong class="cell">路径盘符</strong>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <strong class="cell">总大小</strong>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <strong class="cell">剩余大小</strong>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <strong class="cell">已使用大小</strong>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <strong class="cell">空间使用率</strong>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.disk">
                <tr v-for="(sysFile, index) in server.disk" :key="index">
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.target }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.size }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.avail }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.used }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      :class="{ 'text-danger': sysFile.used > 80 }"
                    >
                      {{ sysFile.used }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getSystemInfo } from '@/api/monitor/system';

const server = ref([]);
const { proxy } = getCurrentInstance();

/**运行时长（秒）转换 */
function loadUpTime(uptime) {
  if (typeof uptime === 'string') {
    return uptime;
  }
  if (uptime <= 0) {
    return '-';
  }
  let days = Math.floor(uptime / 86400);
  let hours = Math.floor((uptime % 86400) / 3600);
  let minutes = Math.floor((uptime % 3600) / 60);
  let seconds = uptime % 60;
  let strArr = [];
  if (days !== 0) {
    strArr.push(`${days}天`);
  }
  if (hours !== 0) {
    strArr.push(`${hours}小时`);
  }
  if (minutes !== 0) {
    strArr.push(`${minutes}分钟`);
  }
  strArr.push(`${seconds}秒`);
  return strArr.join(' ');
}

function getList() {
  proxy.$modal.loading('正在加载服务监控数据，请稍候！');
  getSystemInfo().then(response => {
    server.value = response.data;
    // CPU信息
    let cpu = response.data.cpu;
    cpu.coreUsed = cpu.coreUsed.map(item => item).join(' / ');
    server.value.cpu = cpu;

    proxy.$modal.closeLoading();
  });
}

getList();
</script>
