
import './index.scss';
import topNav from '../components/rightNav';
import TimeLineMonth from '../components/timeLineMonth';
import WaveChart from './components/waveChart';

const timeLine = new TimeLineMonth('#timeLine', update);
timeLine.render({ year: 2017, month: 3 });

const waveChart = new WaveChart('waveChart');
waveChart.render();

window.setTest = function () {
    waveChart.changeDataShow(1);
}

function update(monthIndex) {

    console.log(monthIndex);
}

const topnav = new topNav("menu", "nav_ss.png");
topnav.render();