import './roseOrderListComponent.scss';
import d3 from 'd3';

const sData = [
    { name: "系统帐号及权限维护", percent: 65 },
    { name: "MOI编码、属性及重点数据维护", percent: 15 },
    { name: "事件类别维护", percent: 10 },
    { name: "时间管理升级", percent: 6 },
    { name: "专用设备", percent: 4 },
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
    }

    render() {
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
        let arcG = this.svg.append('g')
            .attr('transform', `translate(${this.circleCenter.x + 10}, 220)`);
        let orderTxtG = this.svg.append('g')
            .attr('transform', 'translate(230,0)')
            .attr('class', 'list');

        this.addOrderTxt(orderTxtG, '法律法规', 1);

        this.drawArch(arcG, 'first', 190, 'rgba(248,160,54,0.7)', 'rgba(248,160,54,0)', 0, 0.13 * Math.PI);
        this.drawArch(arcG, 'second', 160, 'rgba(1,255,255,0.7)', 'rgba(1,255,255,0)', 0.13 * Math.PI, 0.26 * Math.PI);
        this.drawArch(arcG, 'third', 130, 'rgba(67,186,254,0.7)', 'rgba(67,186,254,0)', 0.26 * Math.PI, 0.39 * Math.PI);
        this.drawArch(arcG, 'four', 100, 'rgba(80,200,136,0.7)', 'rgba(80,200,136,0)', 0.39 * Math.PI, 0.52 * Math.PI);
        this.drawArch(arcG, 'five', 70, 'rgba(234,233,232,0.5)', 'rgba(234,233,232,0)', 0.52 * Math.PI, 0.65 * Math.PI);
    }

    drawArch(parentG, id, r, startColor, stopColor, startAngle, endAngle) {
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
            .text('90%')
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

    addOrderTxt(parentG, txt, order) {
        let frnObj = parentG.append('foreignObject')
            .attr('width', '170px')
            .attr('height', '300px')
            .append("xhtml:body")
            .html(this.getOrderListHtml());
    }
}