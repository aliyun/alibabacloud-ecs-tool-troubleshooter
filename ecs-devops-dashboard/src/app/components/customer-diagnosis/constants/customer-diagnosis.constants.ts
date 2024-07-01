export const statusMapper: { [key: string]: string } = {
  Submitted: '已提交',
  InProgress: '诊断中',
  RateLimit: '诊断流控',
  Finished: '诊断完成',
  Failed: '诊断失败',
}


export const finishedStatus = ['Finished', 'Failed', 'RateLimit']
