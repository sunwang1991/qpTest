import request from '@/utils/request';

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query,
  });
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'get',
  });
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: '/monitor/job',
    method: 'post',
    data: data,
  });
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: '/monitor/job',
    method: 'put',
    data: data,
  });
}

// 删除定时任务调度
export function delJob(jobId) {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'delete',
  });
}

// 任务状态修改
export function changeJobStatus(jobId, statusFlag) {
  const data = {
    jobId,
    statusFlag,
  };
  return request({
    url: '/monitor/job/status',
    method: 'put',
    data: data,
  });
}

/**
 * 定时任务立即执行一次
 * @param jobId 任务ID
 * @returns object
 */
export function runJob(jobId) {
  return request({
    url: `/monitor/job/run/${jobId}`,
    method: 'put',
  });
}

/**
 * 重置刷新队列
 * @returns object
 */
export function resetQueueJob() {
  return request({
    url: '/monitor/job/reset',
    method: 'put',
  });
}
