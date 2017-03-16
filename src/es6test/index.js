
import './index.scss';
import topNav from '../components/rightNav';
import TimeLineMonth from '../components/timeLineMonth';

import ControlPanel from './components/controlPanel';

const timeLine = new TimeLineMonth('#timeLine', update);
timeLine.render({ year: 2017, month: 3 });


const cp = new ControlPanel('#controlPanel', {
    start: () => {
        // alert(1);
    },
    stop: () => {

    },
    reset: () => {

    }
})

cp.render();

function update(monthIndex) {

    console.log(monthIndex);
}
const topnav = new topNav("menu", "nav_mn.png");
topnav.render();