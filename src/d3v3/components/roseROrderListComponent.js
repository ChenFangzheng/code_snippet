import './roseROrderListComponent.scss';
import d3 from 'd3';
import $ from 'jquery';

const sData = [
    { name: "溪秀苑社区", num: 93986, percent: 85 },
    { name: "假日风景社区", num: 79723, percent: 79 },
    { name: "水语花城", num: 50913, percent: 60 },
    { name: "祁庄村", num: 32142, percent: 40 },
    { name: "雷庄村", num: 10923, percent: 22 }
];

export class RoseROrderList {
    constructor(containerId, title) {
        this.containerId = containerId;
        this.title = title;
        this.circleCenter = { x: 50, y: 50 }
        this.svg = null;
        this.colors = [
            ['rgba(248,160,54,0.7)', 'rgba(248,160,54,0)'],
            ['rgba(1,255,255,0.7)', 'rgba(1,255,255,0)',],
            ['rgba(67,186,254,0.7)', 'rgba(67,186,254,0)'],
            ['rgba(80,200,136,0.7)', 'rgba(80,200,136,0)'],
            ['rgba(234,233,232,0.7)', 'rgba(234,233,232,0)']
        ]
    }

    getItemListHtml(data) {
        let items = data.map((item, i) => {
            return `<li>
                        <span class='order'>${i + 1}</span>
                        <span class='name'>${item.name}</span>
                        <span class='num'>${item.num}个</span>
                    </li>`;
        });

        let wrapperHtml = `<h3>${this.title}</h3>
                            <div class='roseRightOrderList'>
                                <ul>
                                    ${items.join("")}
                                </ul>
                                <div class='svgWrapper'></div>
                            </div>`;

        return wrapperHtml;
    }

    renderList(data = sData) {
        let $container = $(`#${this.containerId}`);
        $container.html(this.getItemListHtml(data));

        this.svg = d3.select($container.find('.svgWrapper')[0])
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%");

        this.drawTitleAndCircle();
        this.drawArchs(data)
    }

    drawArchs(data) {
        let arcG = this.svg.append('g')
            .attr('transform', `translate(121, 160)`);

        let bins = [
            [135, 150],
            [120, 135],
            [100, 110],
            [80, 90],
            [70, 80]
        ];

        data.sort((a, b) => {
            return b.percent - a.percent;
        })

        data.forEach((item, i) => {
            let angleStep = -0.13 * Math.PI;
            let xScale = d3.scale.linear().domain([0, 100]).range(bins[i]);
            this.drawArch(arcG, i, xScale(item.percent), item.percent, this.colors[i][0], this.colors[i][1],
                angleStep * i, angleStep * (i + 1));
        });
        this.drawTitleAndCircle();
    }

    drawArch(parentG, id, r, percentage, startColor, stopColor, startAngle, endAngle) {
        let arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(r)
            .startAngle(startAngle)
            .endAngle(endAngle);

        let radialGradient = this.svg.append("defs")
            .append("linearGradient")
            .attr("id", `liner-gradient${id}`)
            .attr("x1", `${(endAngle) * 100 / Math.PI}%`)
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        radialGradient.append("stop")
            .attr('offset', '0%')
            .attr('stop-color', startColor);

        radialGradient.append("stop")
            .attr("offset", '100%')
            .attr('stop-color', stopColor)

        parentG.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("id", id)
            .style('fill', `url(#liner-gradient${id})`);

        let angle = startAngle + endAngle;
        parentG.append('text')
            .text(percentage + '%')
            .attr('class', 'pct')
            .attr('x', r * Math.sin(angle / 2) - 25)
            .attr('y', angle / 2 < 1.5 ? - r * Math.cos(angle / 2) : -r * Math.cos(angle / 2) + 10);
    }

    drawTitleAndCircle() {
        let circleG = this.svg.append('g')
            .attr("transform", "translate(70,110)");
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 34)
            .attr('class', 'inner');
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 43)
            .attr('class', 'outter');
        circleG.append('text')
            .attr('class', 'circleText')
            .text("异常状态")
            .attr('transform', 'translate(19,56)');

    }
}