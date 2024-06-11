const alarms = {
  ackInfo: '',
  ackTime: '0000-00-00 00:00:00',
  ackUser: '',
  dbPath: '/alarms/current',
  desc: '表示电路故障，断开!故障点编号:1',
  detail: '',
  isAck: false,
  isRecover: false,
  level: '一级',
  levelLabel: '一级',
  picUrl: '',
  recoverTime: '0000-00-00 00:00:00',
  suggest: '',
  tag: '站1.1#.1J1',
  time: '2024-05-21 17:00:35',
  type: 'BiaoShiCircuitBroken',
  typeLabel: 'BiaoShiCircuitBroken',
}

const enhancedAlarms = {
  jsonrpc: '2.0',
  method: 'newDiag',
  params: {
    tree_id: '000002', //故障树id
    name: 'zdj9双牵外锁道岔失表',
    time: '2023-10-13 09:46:48',
    node_id: '22_2', //树的节点id
    state: '1', //故障节点是否被触发
    dc_state: '0',
    loc_param: {
      //触发位置参数
      line_id: '1', //线路id
      station_id: '1', //车站id
      dc_id: '1', //道岔id
      zzj_id: '1', //转辙机id   故障点不属于转辙机则为空串
    },
    data_param: {
      // "state" 为 "1"时的数据参数的值、参考值等（曲线则为时间戳），为"0" 不存在此字段
    },
  },
}
