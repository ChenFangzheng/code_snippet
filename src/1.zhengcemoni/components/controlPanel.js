import $ from 'jquery';
import './controlPanel.scss';

export default class ControlPanel {

    constructor(container, events) {
        this.container = $(container);
        this.events = events;
        this.isStart = true;
    }

    render() {

        const {events: {start, stop, reset}, container} = this;
        const that = this;
        //pause
        const _html = `
            <ul>
                <li> <img src="${ require("../../images/start.png")}" /> <span>开始</span></li>
                <li><img src="${ require("../../images/stop.png")}" /> <span>停止</span></li>
                <li><img src="${ require("../../images/reset.png")}" /> <span>重置</span></li>
            </ul>
        `;
        const _btnArray = container.html(_html).find('li');

        $(_btnArray[0]).click(function () {
            const self = $(this);
            const img = self.find('img');
            const span = self.find('span');
            const image = that.isStart === true ? require('../../images/pause.png') : require('../../images/start.png');
            img.attr('src', image);
            const text = that.isStart === true ? '暂停' : '开始';
            span.text(text);
            that.isStart = !that.isStart;
            start();
        });
        _btnArray[1].click(stop);
        _btnArray[2].click(reset);

    }

    // start() {

    // }

    // stop() {

    // }

    // reset() {

    // }


}