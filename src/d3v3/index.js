
import './index.scss';
import { RoseROrderList } from './components/roseROrderListComponent';

let orderList = new RoseROrderList('roseR', '服务请求类型Top5');
orderList.renderList();

// import { RoseOrderList } from './components/roseOrderListComponent';

// let orderList = new RoseOrderList('rose', '建议咨询');
// orderList.render();

// import WaveChart from './components/waveChart';

// const waveChart = new WaveChart('waveChart');
// waveChart.render();`