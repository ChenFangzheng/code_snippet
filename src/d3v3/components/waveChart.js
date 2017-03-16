import './waveChart.scss';
import d3 from 'd3';

const sampleData = {
    "year": 2016,
    "month": 1,
    "purchase": [
        "401.60",
        "418.00",
        "403.10",
        "436.00",
        "407.70",
        "427.80",
        "505.80",
        "406.10",
        "457.30",
        "404.30",
        "337.80",
        "402.50",
        "357.80",
        "346.90",
        "451.60",
        "224.70",
        "432.70",
        "405.90",
        "307.00",
        "409.20",
        "401.60",
        "388.00",
        "409.70",
        "437.40",
        "401.50",
        "494.00",
        "421.50",
        "400.60",
        "462.50",
        "475.50"
    ],
    "selling": [
        "461.60",
        "458.00",
        "453.10",
        "496.00",
        "447.70",
        "477.80",
        "505.80",
        "496.10",
        "477.30",
        "434.30",
        "437.80",
        "462.50",
        "457.80",
        "446.90",
        "491.60",
        "424.70",
        "472.70",
        "505.90",
        "507.00",
        "449.20",
        "461.60",
        "488.00",
        "449.70",
        "477.40",
        "481.50",
        "494.00",
        "461.50",
        "450.60",
        "482.50",
        "415.50"
    ]
};

export default class WaveChart {
    constructor(containerId, padding = { left: 20, right: 40, top: 20, bottom: 10 }) {
        this.containerId = containerId;
        this.padding = padding;
        let containerEle = document.getElementById(this.containerId);

        // 设置SVG的宽高
        this.height = containerEle.clientHeight;
        this.width = containerEle.clientWidth;
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%");

        this.circleSettings = { r: 7, color: 'rgb(146,62,204)' };
        this.rectSettings = { w: 6, h: 16, color: 'rgb(145,113,238)' };

        // 用于生成开关按钮上的三角形
        this.poly = [
            { x: this.padding.left + 44, y: this.height - this.padding.bottom - 144 },
            { x: this.padding.left + 44, y: this.height - this.padding.bottom - 128 },
            { x: this.padding.left + 60, y: this.height - this.padding.bottom - 136 }
        ];
        this.switchIsOpen = false;
        this.duration = 100;
        this.delay = 1000;
        this.dataLength = 31;
        this.data = null;
        this.timer = null;
        this.mSymbol = 0;
    }

    // 构建表头的按钮, Legend 年份
    buildChartHeader(year) {
        let headerG = this.svg.append('g')
            .attr('class', "chartHeader")
            .attr('transform', 'translate(0, -12)');

        const circles = [
            { cx: this.padding.left + 50, cy: this.height - this.padding.bottom - 136, color: 'rgba(146,62,204, 0.3)', r: 28, class: 'bCircle' },
            { cx: this.padding.left + 50, cy: this.height - this.padding.bottom - 136, color: 'rgb(146,62,204)', r: 20, class: 'sCircle' },
            { cx: this.padding.left + 16, cy: this.height - this.padding.bottom - 86, color: 'rgb(146,62,204)', r: 7, class: 'outLegend' }
        ];

        const texts = [
            { x: this.padding.left + 12 + this.rectSettings.w + 12, y: this.height - this.padding.bottom - 80, text: '卖出量', class: 'outLegendTxt' },
            { x: this.padding.left + 12 + this.rectSettings.w + 12, y: this.height - this.padding.bottom - 42, text: '买入量', class: 'inLegendTxt' },
            { x: this.padding.left, y: this.height - this.padding.bottom, text: `${year}年`, class: 'yearText' }
        ];

        headerG.selectAll('circle')
            .data(circles)
            .enter()
            .append('circle')
            .attr('class', d => d.class)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('r', d => d.r)
            .style('fill', d => d.color);

        headerG.selectAll('text')
            .data(texts)
            .enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('class', d => d.class)
            .text(d => d.text);

        headerG.append('rect')
            .attr('class', 'inLegend')
            .attr('x', this.padding.left + 12)
            .attr('y', this.height - this.padding.bottom - 56)
            .attr('width', this.rectSettings.w)
            .attr('height', this.rectSettings.h)
            .style('fill', this.rectSettings.color);

        headerG.selectAll('polygon')
            .data([this.poly])
            .enter()
            .append('polygon')
            .attr('points', function (d) {
                return d.map(function (d) {
                    return [d.x, d.y].join(",");
                }).join(" ");
            })
            .attr('class', 'switchBtn')
            .on('click', () => {
                this.switchBtnStyle(this.switchIsOpen);
                this.switchIsOpen = !this.switchIsOpen;
            });

    }

    // 按钮样式切换
    switchBtnStyle(switchIsOpen) {
        let headerG = this.svg.select(".chartHeader");
        headerG.selectAll('.switchBtn').remove();

        if (!this.switchIsOpen) {
            this.loopPlay();
        }
        else {
            this.stopPlay();
        }

        if (!switchIsOpen) {
            headerG.append('rect')
                .attr('x', this.padding.left + 43)
                .attr('y', this.height - this.padding.bottom - 143)
                .attr('height', 13)
                .attr('width', 13)
                .attr('class', 'switchBtn')
                .on('click', () => {
                    this.switchBtnStyle(this.switchIsOpen);
                    this.switchIsOpen = !this.switchIsOpen;
                });

        } else {
            headerG.selectAll('polygon')
                .data([this.poly])
                .enter()
                .append('polygon')
                .attr('points', function (d) {
                    return d.map(function (d) {
                        return [d.x, d.y].join(",");
                    }).join(" ");
                })
                .attr('class', 'switchBtn')
                .on('click', () => {
                    this.switchBtnStyle(this.switchIsOpen);
                    this.switchIsOpen = !this.switchIsOpen;
                });
        }
    }

    getDaysInMonth(year, month) {
        month -= 1;
        // Since no month has fewer than 28 days
        var date = new Date(year, month, 1);
        var days = [];
        console.log('month', month, 'date.getMonth()', date.getMonth())
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    // 构建x轴日期
    createDateAxis(year, month) {
        let marginLeft = this.getCoorX(this.dataLength, 0);
        let dayG = this.svg.append('g').attr("transform", `translate(${marginLeft}, ${this.height - this.padding.bottom})`);
        let monthG = this.svg.append('g').attr("transform", `translate(${marginLeft}, ${this.height - this.padding.bottom - 16})`);

        let dayLength = this.getDaysInMonth(year, month).length;
        let dayTexts = Object.keys(Array.apply(null, { length: dayLength })).map(num => num = 1 + parseInt(num));
        let monthTexts = Object.keys(Array.apply(null, { length: dayLength })).map(() => `${month}月`);

        for (let index = 0; index < this.dataLength - dayLength; index++) {
            dayTexts.push(index + 1);
            monthTexts.push(`${month + 1}月`)
        }

        dayG.selectAll('text')
            .data(dayTexts)
            .enter()
            .append('text')
            .attr('x', (d, i) => this.getCoorX(this.dataLength, i))
            .attr('y', 0)
            .attr('class', 'dayTexts')
            .text(d => d);
        monthG.selectAll('text')
            .data(monthTexts)
            .enter()
            .append('text')
            .attr('x', (d, i) => this.getCoorX(this.dataLength, i))
            .attr('y', 0)
            .attr('class', 'monthTexts')
            .text(d => d);
    }

    // 构建坐标系, 并将数据标志显示在初始状态
    createDataLineAndSymbol(mSymbol) {
        let marginLeft = this.getCoorX(this.dataLength, 0);
        let lineDataG = this.svg.append('g').attr('class', 'lineDataG').attr("transform", `translate(${marginLeft + 10}, -53)`);
        const data = Object.keys(Array.apply(null, { length: 31 })).map(num => 0);

        // 数据线
        lineDataG.selectAll('line')
            .data(data)
            .enter()
            .append('line')
            .attr('class', 'dataLine')
            .attr('x1', (d, i) => this.getCoorX(this.dataLength, i))
            .attr('y1', (d, i) => this.height - this.padding.bottom)
            .attr('x2', (d, i) => this.getCoorX(this.dataLength, i))
            .attr('y2', (d, i) => this.height - this.padding.bottom - 100);

        // 买入量量矩形
        lineDataG.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'inDataRect')
            .attr('x', (d, i) => this.getCoorX(this.dataLength, i) - this.rectSettings.w / 2)
            .attr('y', (d, i) => this.height - this.padding.bottom - this.rectSettings.h / 2)
            .attr('width', this.rectSettings.w)
            .attr('height', this.rectSettings.h)
            .style('fill', this.rectSettings.color);

        // 卖出量圆点
        lineDataG.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'outDataCircle')
            .attr('cx', (d, i) => this.getCoorX(this.dataLength, i))
            .attr('cy', (d, i) => this.height - this.padding.bottom)
            .attr('r', this.circleSettings.r)
            .attr('fill', this.circleSettings.color);

        this.setDataVisablity(mSymbol);
    }

    getCoorX(dataLength, positionIndex) {
        let xScale = d3.scale.ordinal()
            .domain(d3.range(dataLength))
            .rangeRoundBands([this.padding.left + 36, this.width - this.padding.right - 100]);

        return xScale(positionIndex);
    }

    resetData() {
        let lineDataG = this.svg.select('.lineDataG');

        lineDataG.selectAll('circle')
            .attr('cy', this.height - this.padding.bottom);

        lineDataG.selectAll('rect')
            .attr('y', this.height - this.padding.bottom - this.rectSettings.h / 2);

        let lines = lineDataG.selectAll('.outDataLine');

        if (!!lines[0][0]) {
            lines.remove();
        }
    }

    // 绑定数据源
    bindingData(data, mSymbol) {

        this.resetData();

        let outData = data.selling.map(item => isNaN(parseFloat(item)) ? 0 : parseFloat(item).toFixed(3));
        //[111, 121, 121, 311, 214, 431, 111, 121, 121, 311, 214, 431, 111, 121, 121, 311, 214, 431, 111, 121, 121, 311, 214, 431, 111, 121, 121, 311, 214, 431, 80];
        let inData = data.purchase.map(item => isNaN(parseFloat(item)) ? 0 : parseFloat(item).toFixed(3));
        //[80, 100, 90, 280, 150, 260, 80, 100, 90, 280, 150, 260, 80, 100, 90, 280, 150, 260, 80, 100, 90, 280, 150, 260, 80, 100, 90, 280, 150, 260, 120];

        let allData = inData.concat(outData);

        // Y轴比例尺
        let yScale = d3.scale.linear()
            .domain([d3.min(allData), d3.max(allData)])
            .range([this.height - this.padding.bottom - this.rectSettings.h / 2, this.height - this.padding.bottom - 100]);

        let lineDataG = this.svg.select('.lineDataG');

        // 卖出量之间连线
        let points = outData.map((d, i) => {
            return {
                x: this.getCoorX(this.dataLength, i),
                y: yScale(d)
            }
        });

        let outLines = [];

        for (let index = 0; index < points.length - 1; index++) {
            outLines.push({
                x1: points[index].x,
                y1: points[index].y,
                x2: points[index + 1].x,
                y2: points[index + 1].y
            });
        }

        lineDataG.selectAll('.outDataLine')
            .data(outLines)
            .enter()
            .append('line')
            .attr('class', 'outDataLine')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x1)
            .attr('y2', d => d.y1)
            .transition()
            .delay((d, i) => this.delay * (1 + i))
            .duration(this.duration)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2);

        // 卖出量圆
        lineDataG.selectAll('circle')
            .on('click', (d, i) => {
                this.showCurrentDayTip(points[i].x, mSymbol, [outData[i], inData[i]], 0);
            })
            .data(outData)
            .transition()
            .delay((d, i) => i * this.delay)
            .duration(this.duration)
            .ease("linear")
            .attr('cy', d => yScale(d));

        // 买入量矩形
        lineDataG.selectAll('rect')
            .on('click', (d, i) => {
                this.showCurrentDayTip(points[i].x, mSymbol, [outData[i], inData[i]], 0);
            })
            .data(inData)
            .transition()
            .delay((d, i) => i * this.delay + 500)
            .duration(this.duration)
            .ease("linear")
            .attr('y', d => yScale(d));

        // this.showCurrentDayTip(points[0].x, mSymbol, [outData[0], inData[0]]);

        for (let index = 0; index < points.length; index++) {

            this.showCurrentDayTip(points[index].x, mSymbol, [outData[index], inData[index]], this.delay * index);
        }
    }

    /**
     * 设置tip的位置 
     * coorX: tooltip的x轴坐标
     * mSymbol: 数据显示标记 0 for all, 1 for out, 2 for in
     * values: 要显示的数据(当买入,卖出都显示时为两个元素,只显示一个时有一个元素)
     * transtionDelay: 图标播放动画时,tooltop移动的等待时间
     * reRender: 是否需要重新绘制tooltip, 当要显示的数据有变化时需重新绘制tooltip
     */
    showCurrentDayTip(coorX, mSymbol, values, transtionDelay, reRender = false) {
        let curPositionG = this.svg.select('.curDayTip');

        if (!!curPositionG[0][0] && !reRender) {
            curPositionG.transition()
                .attr('transform', `translate(${coorX - 13},0)`)
                .delay(transtionDelay + 200)
                .duration(this.duration)
                .each("end", () => {
                    switch (mSymbol) {
                        case 1:
                        case 2:
                            curPositionG.select('#singleValue')
                                .text(`${values[0]}亿`);
                            break;
                        default:
                            curPositionG.select('#outValue')
                                .text(`卖出量: ${values[0]}亿`);
                            curPositionG.select('#inValue')
                                .text(`买入量: ${values[1]}亿`);
                            break;

                    }
                });

        }
        else {

            if (reRender) {
                this.svg.selectAll('.curDayTip').remove();
            }

            curPositionG = this.svg.append('g')
                .attr('class', 'curDayTip')
                .attr('transform', `translate(${coorX - 13}, 0)`);
            let image = require('../../images/tip.png');
            // 添加tip背景
            let tipBg = curPositionG.append("image");
            tipBg.attr("xlink:href", image)
                .attr("class", "tipBg")
                .attr("width", "152")
                .attr("height", "78");
            let text = curPositionG.append("text")
                .attr("text-anchor", "start")
                .attr("class", "currentText")
                .attr('x', 42)
                .attr('y', 16)
                .append("tspan").text("今日交易额");

            switch (mSymbol) {
                case 1:
                case 2:
                    curPositionG.select(".currentText")
                        .append("tspan")
                        .attr('id', 'singleValue')
                        .text(`${values[0]}亿`)
                        .attr("class", "currentValue")
                        .attr("x", 10)
                        .attr("dy", "1.2em");
                    break;
                default:
                    curPositionG.select(".currentText")
                        .append("tspan")
                        .attr('id', 'outValue')
                        .text(`卖出量: ${values[0]}`)
                        .attr("class", "currentValues")
                        .attr("x", "12")
                        .attr("dy", "1.2em");
                    curPositionG.select(".currentText")
                        .append("tspan")
                        .attr('id', 'inValue')
                        .text(`买入量: ${values[1]}`)
                        .attr("class", "currentValues")
                        .attr("x", "12")
                        .attr("dy", "1.2em");
                    break;
            }
        }
    }

    // 0 for all, 1 for out, 2 for in
    setDataVisablity(mSymbol) {
        switch (mSymbol) {
            case 1:
                this.setOpacity("outDataCircle", 1);
                this.setOpacity("outLegend", 1);
                this.setOpacity("outLegendTxt", 1);
                this.setOpacity("inLegendTxt", 0);
                this.setOpacity("inDataRect", 0);
                this.setOpacity("inLegend", 0);
                break;
            case 2:
                this.setOpacity("outDataCircle", 0);
                this.setOpacity("outLegend", 0);
                this.setOpacity("outLegendTxt", 0);
                this.setOpacity("inLegendTxt", 1);
                this.setOpacity("inDataRect", 1);
                this.setOpacity("inLegend", 1);
                break;
            default:
                this.setOpacity("outDataCircle", 1);
                this.setOpacity("outLegend", 1);
                this.setOpacity("outLegendTxt", 1);
                this.setOpacity("inLegendTxt", 1);
                this.setOpacity("inDataRect", 1);
                this.setOpacity("inLegend", 1);
        }
    }

    setOpacity(className, opacity) {
        this.svg.selectAll(`.${className}`)
            .transition()
            .duration(this.duration)
            .attr('opacity', opacity);
    }

    // 供外部调用绘制方法
    render(data, mSymbol = 0) {
        if (!data) {
            this.data = sampleData;
        }
        else {
            this.data = data;
        }

        this.mSymbol = mSymbol;
        this.buildChartHeader(this.data.year);
        this.createDateAxis(this.data.year, this.data.month);
        this.createDataLineAndSymbol(this.mSymbol);
        this.bindingData(this.data, this.mSymbol);
    }

    loopPlay() {
        this.timer = setInterval(() => {
            this.bindingData(this.data, this.mSymbol);
        }, this.dataLength * this.delay);
    }

    stopPlay() {
        clearInterval(this.timer);
    }

    //  供外部调用 0 for all, 1 for out, 2 for in
    changeDataShow(mSymbol) {
        this.setDataVisablity(mSymbol);
        this.showCurrentDayTip(this.getCoorX(31, 0), mSymbol, [1234.789, 212.121], 0, true);
        this.bindingData(this.data, mSymbol);
    }
}