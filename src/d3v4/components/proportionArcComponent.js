import './proportionArcComponent.scss';
import * as d3 from '../d3-custom';
// import * as d3 from 'd3';
const colors = [
    'rgb(62, 185,255)',
    'rgb(116,162,255)',
    'rgb(74,245,247)'
];

export class ProportionArc {
    constructor(containerId) {
        this.containerId = containerId;
        this.circle = { cx: -5, cy: 490, bR: 484, sR: 342 };
        this.arcWidth = 20;
        this.angles = {
            start: Math.PI * 27.3 / 180,
            end: Math.PI * 152 / 180
        };

        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('class', 'proporionArch')
            .attr('width', "100%")
            .attr('height', "100%");
    }

    // 根据角度和半径获取分割线端点坐标
    getEndPointCoors(angle, r, justify) {
        let length = r + justify,
            coors = {};

        if (angle < Math.PI / 2) {
            coors = {
                x: length * Math.sin(angle),
                y: this.circle.cy - length * Math.cos(angle)
            }
        } else {
            angle = angle - Math.PI / 2;
            coors = {
                x: length * Math.cos(angle),
                y: this.circle.cy + length * Math.sin(angle)
            }
        }

        return coors;
    }

    // 获取实线坐标数据
    getSolidlineData() {
        let data = [],
            tmpEndCoors;

        for (let key in this.angles) {
            tmpEndCoors = this.getEndPointCoors(this.angles[key], this.circle.bR, 38);
            data.push({
                x1: this.circle.cx, y1: this.circle.cy,
                x2: tmpEndCoors.x, y2: tmpEndCoors.y
            });
        }

        return data;
    }

    // 根据数据获取分割线角度
    getArchEndAngles(data) {
        let endAngles = [],
            angleW = this.angles.end - this.angles.start;

        endAngles.push(this.angles.start + data.tertiary * angleW / 100);

        endAngles.push(this.angles.start + (data.secondary + data['tertiary']) * angleW / 100);

        return endAngles;
    }


    getDashLineEndPoints(data, r, justify) {
        let endAngles = this.getArchEndAngles(data);

        return endAngles.map(endAngle => this.getEndPointCoors(endAngle, r, justify));
    }

    // 获取虚线坐标数据
    getDashedLineData({ former, latest }) {
        let lineData = [],
            fPointsData = this.getDashLineEndPoints(former, this.circle.sR, 20),
            lPointsData = this.getDashLineEndPoints(latest, this.circle.bR, 38),
            allDashLineData = fPointsData.concat(lPointsData);
        for (let point of allDashLineData) {
            lineData.push({
                x1: this.circle.cx, y1: this.circle.cy,
                x2: point.x, y2: point.y
            })
        }
        return lineData;
    }

    tidyDataforArcs(data) {
        let angles = this.getArchEndAngles(data),
            items = [],
            keys = ['tertiary', 'secondary', 'primary'],
            jAngle = Math.PI / 600;
        angles.push(this.angles.start);
        angles.push(this.angles.end);
        angles.sort((a, b) => {
            return a - b;
        });

        for (let i = 0; i < angles.length - 1; i++) {
            items.push({
                start: angles[i] + jAngle,
                end: angles[i + 1] - jAngle,
                pct: data[keys[i]],
                color: colors[i]
            });
        }

        return items;
    }

    render(data) {
        let arcG = this.svg.append('g')
            .attr('transform', `translate(${this.circle.cx},${this.circle.cy})`),
            outerArcs = this.tidyDataforArcs(data.latest),
            innerArcs = this.tidyDataforArcs(data.former);
        this.drawArchWithGradientColor(arcG, "fOutter", this.circle.bR, this.circle.sR,
            'rgba(26, 166,255,0.7)', 'rgba(26, 166,255,0)', outerArcs[0].start, outerArcs[0].end);

        this.drawArchWithGradientColor(arcG, "fInner", this.circle.sR, this.circle.sR - 120,
            'rgba(26, 166,255,0.8)', 'rgba(26, 166,255,0.3)', innerArcs[0].start, innerArcs[0].end);

        outerArcs.forEach(arcItem => {
            this.drawArch(arcG, this.circle.bR, arcItem.pct, arcItem.color, arcItem.start, arcItem.end);
        });

        innerArcs.forEach(arcItem => {
            this.drawArch(arcG, this.circle.sR, arcItem.pct, arcItem.color, arcItem.start, arcItem.end);
        });

        let lineG = this.svg.append('g'),
            solidLData = this.getSolidlineData(),
            dashedLData = this.getDashedLineData(data);

        this.drawLine(lineG, solidLData, 'solidLine');
        this.drawLine(lineG, dashedLData, 'dashedline');

        let htmlG = this.svg.append('g')
            .attr('transform', 'translate(0,263)');

        this.addHtmlContent(htmlG);
    }

    getOrderListHtml() {
        //let items = data.map((item, i) => ``);
        let html = `<div class='harfCircle'>
                        <ul class='industryList'>
                            <li><span>第三产业</span></li>
                            <li><span>第二产业</span></li>
                            <li><span>第一产业</span></li>
                        </ul>
                    </div>
                    <ul class='yearList'>
                        <li><div></div><span>2010年</span></li>
                        <li><div></div><span>2011年</span></li>
                        <li><div></div><span>2012年</span></li>
                        <li><div></div><span>2013年</span></li>
                        <li><div></div><span>2014年</span></li>
                        <li><div></div><span>2015年</span></li>
                    </ul>`;

        return html;
    }

    addHtmlContent(parentG) {
        let frnObj = parentG.append('foreignObject')
            .attr('width', '236px')
            .attr('height', '800px')
            .append("xhtml:body")
            .html(this.getOrderListHtml());
    }

    drawLine(pGroup, lineData, className) {
        pGroup.selectAll(`.${className}`)
            .data(lineData)
            .enter()
            .append('line')
            .attr('class', className)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
    }

    drawArch(parentG, r, percentage, color, startAngle, endAngle) {
        let arc = d3.arc()
            .innerRadius(r - this.arcWidth)
            .outerRadius(r)
            .startAngle(startAngle)
            .endAngle(endAngle);

        parentG.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr('fill', color);

        let angle = startAngle + endAngle;

        r = r - 86;
        parentG.append('rect')
            .attr('class', 'rect_bg')
            .attr('x', r * Math.sin(angle / 2) - 12)
            .attr('y', angle / 2 < 1.5 ? - r * Math.cos(angle / 2) - 20 : -r * Math.cos(angle / 2) - 10)
            .attr('width', 70)
            .attr('height', 30)
            .attr('rx', 15)
            .attr('ry', 15);

        parentG.append('text')
            .text(percentage + '%')
            .style('fill', color)
            .attr('class', 'pct')
            .attr('x', r * Math.sin(angle / 2))
            .attr('y', angle / 2 < 1.5 ? - r * Math.cos(angle / 2) : -r * Math.cos(angle / 2) + 10);
    }

    drawArchWithGradientColor(parentG, id, oR, iR, sColor, eColor, startAngle, endAngle) {
        let arc = d3.arc()
            .innerRadius(iR)
            .outerRadius(oR)
            .startAngle(startAngle)
            .endAngle(endAngle);

        let radialGradient = this.svg.append("defs")
            .append("linearGradient")
            .attr("id", `liner-gradient${id}`)
            .attr("x1", `${(endAngle) * 100 / Math.PI}%`)
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "45%");

        radialGradient.append("stop")
            .attr('offset', '0%')
            .attr('stop-color', sColor);

        radialGradient.append("stop")
            .attr("offset", '100%')
            .attr('stop-color', eColor)

        parentG.append("path")
            .attr("class", "g_arc")
            .attr("d", arc)
            .attr('id', id)
            .style('fill', `url(#liner-gradient${id})`);
    }
}