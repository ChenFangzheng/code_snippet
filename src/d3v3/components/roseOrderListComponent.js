import './roseOrderListComponent.scss';
import d3 from 'd3';

const sData = [
    { name: "系统帐号及权限维护", percent: 65 },
    { name: "MOI编码、属性及重点数据维护", percent: 15 },
    { name: "事件类别维护", percent: 10 },
    { name: "时间管理升级", percent: 6 },
    { name: "专用设备", percent: 4 }
];

export class RoseOrderList {
    constructor(containerId, title) {
        this.containerId = containerId;
        this.title = title;
        this.circleCenter = { x: 50, y: 50 }
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%");
        this.colors = [
            ['rgba(248,160,54,0.7)', 'rgba(248,160,54,0)'],
            ['rgba(1,255,255,0.7)', 'rgba(1,255,255,0)',],
            ['rgba(67,186,254,0.7)', 'rgba(67,186,254,0)'],
            ['rgba(80,200,136,0.7)', 'rgba(80,200,136,0)'],
            ['rgba(234,233,232,0.5)', 'rgba(234,233,232,0)']
        ]
    }

    render(data = sData) {

        let orderTxtG = this.svg.append('g')
            .attr('transform', 'translate(230,0)')
            .attr('class', 'list');

        this.addOrderTxt(orderTxtG, data);

        let arcG = this.svg.append('g')
            .attr('transform', `translate(${this.circleCenter.x + 10}, 220)`);

        let bins = [
            [170, 200],
            [150, 170],
            [120, 150],
            [90, 110],
            [70, 90]
        ];

        data.sort((a, b) => {
            return b.percent - a.percent;
        })

        data.forEach((item, i) => {
            let angleStep = 0.13 * Math.PI;
            let xScale = d3.scale.linear().domain([0, 100]).range(bins[i]);
            this.drawArch(arcG, i, xScale(item.percent), item.percent, this.colors[i][0], this.colors[i][1],
                angleStep * i, angleStep * (i + 1));
        });
        this.drawTitleAndCircle();
    }

    drawTitleAndCircle() {
        let circleG = this.svg.append('g')
            .attr("transform", "translate(10,170)");
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 40)
            .attr('class', 'inner');
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 53)
            .attr('class', 'outter');
        circleG.append('text')
            .attr('class', 'title')
            .text(this.title)
            .attr('transform', 'translate(15,56)');

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
            .attr("y2", "85%");

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
            .style('fill', startColor)
            .attr('class', 'pct')
            .attr('x', r * Math.sin(angle / 2))
            .attr('y', angle / 2 < 1.5 ? - r * Math.cos(angle / 2) : -r * Math.cos(angle / 2) + 10);
    }

    getOrderListHtml(data = sData) {
        let items = data.map((item, i) => `<li>
                            <div class='number'><span class='line'></span>No<span>${i + 1}</span>.</div>
                            <div class='name'>${item.name}</div>
                        </li>`);
        let html = `<ul>${items.join("")}</ul>`;

        return html;
    }

    addOrderTxt(parentG, data) {
        let frnObj = parentG.append('foreignObject')
            .attr('width', '170px')
            .attr('height', '300px')
            .append("xhtml:body")
            .html(this.getOrderListHtml(data));
    }
}