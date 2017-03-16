import _ from 'lodash';
import d3 from 'd3';

import './timeLineMonth.scss';

function _getYearAndMonthInfo(curYear, curMonth) {
    var yearText,
        monthTexts = [],
        tempMonth = curMonth,
        result = {};

    curYear = parseInt(curYear);
    curMonth = parseInt(curMonth);

    if (curMonth > 7) {
        yearText = curYear + 1;
    } else {
        yearText = curYear;
    }

    result.year = yearText;

    for (var i = 0; i < 6; i++) {
        tempMonth--;

        if (tempMonth < 1) {
            tempMonth = 12;
        }

        monthTexts.push(tempMonth);
    }

    monthTexts = _.reverse(monthTexts);
    monthTexts.push(curMonth);
    tempMonth = curMonth;

    for (var j = 0; j < 5; j++) {
        tempMonth++;

        if (tempMonth > 12) {
            tempMonth = 1;
        }

        monthTexts.push(tempMonth);
    }

    result.monthTexts = monthTexts;

    return result;
}

function _buildData(curYear, curMonth, height) {
    var yearMonthInfo,
        monthTexts = [],
        monthResult = [],
        dotResult = [],
        tempObj,
        result = {};

    yearMonthInfo = _getYearAndMonthInfo(curYear, curMonth);
    monthTexts = yearMonthInfo.monthTexts;
    result.year = yearMonthInfo.year;

    for (var k = 0; k < monthTexts.length; k++) {
        //the outer circle
        tempObj = {};
        tempObj.monthText = monthTexts[k] + "月";
        tempObj.cx = k * 4 * 42 + 30 + 35;
        tempObj.cy = height / 2;
        tempObj.r = 16;
        tempObj.opacity = 0.36;
        monthResult.push(tempObj);

        //the inner circle
        tempObj = {};
        tempObj.monthText = monthTexts[k] + "月";
        tempObj.cx = k * 4 * 42 + 30 + 35;
        tempObj.cy = height / 2;
        tempObj.r = 10;
        tempObj.opacity = 1;
        monthResult.push(tempObj);

        if (k >= 11) {
            break;
        }

        for (var index = 1; index < 4; index++) {
            tempObj = {};
            tempObj.monthText = "";
            tempObj.cx = (k * 4 + index) * 42 + 30 + 35;
            tempObj.cy = height / 2;
            tempObj.r = 5;
            tempObj.opacity = 1;
            dotResult.push(tempObj);
        }
    }

    result.data = monthResult;
    result.dotResult = dotResult;
    return result;

}
export default class TimeLineMonth {


    constructor(container, changeIndexEventHandler) {
        this.width = 2000;
        this.height = 120;
        this.container = container;

        this.changeIndexEventHandler = changeIndexEventHandler;
    }


    render({ year, month}) {
        const { width, height, container, changeIndexEventHandler} = this;
        const {data, dotResult} = _buildData(year, month, height);

        const svg = d3.select(container).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(0,0)");

        //draw month circles
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                var monthNum = d.monthText.substr(0, d.monthText.indexOf("月"));
                return "month" + monthNum;
            })
            .classed("normal", true)
            .attr("cx", function (d) {
                return d.cx;
            })
            .attr("cy", function (d) {
                return d.cy;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .attr("opacity", function (d) {
                return d.opacity;
            })
            .on("click", function (d, i) {
                svg.selectAll(".selected")
                    .classed("selected", false);
                var curNodeClass = ".month" + d.monthText.substr(0, d.monthText.indexOf("月"));
                svg.selectAll(curNodeClass)
                    .classed("selected", true);

                var timeIndex = Math.floor(i / 2) + 1;

                changeIndexEventHandler(timeIndex);
            });
        // draw dots
        svg.selectAll(".innerCircle")
            .data(dotResult)
            .enter()
            .append("circle")
            .attr("class", "innerCircle")
            .classed("normal", true)
            .attr("cx", function (d) {
                return d.cx;
            })
            .attr("cy", function (d) {
                return d.cy;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .attr("opacity", function (d) {
                return d.opacity;
            });

        const textData = _.filter(data, function (o) {
            return o.monthText !== "" && o.opacity === 1;
        });

        svg.selectAll("text")
            .data(textData)
            .enter()
            .append("text")
            .attr("class", function (d) {
                var monthNum = d.monthText.substr(0, d.monthText.indexOf("月"));
                return "month" + monthNum;
            })
            .attr("font-size", "20px")
            .classed("normal", true)
            .attr("x", function (d) {
                return d.cx - d.r;
            })
            .attr("y", function (d) {
                return d.cy + 40;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .text(function (d) {
                return d.monthText;
            });


        const yearStart = _.find(textData, function (o, index) {
            return o.monthText === "1月";
        });

        svg.selectAll(".month" + month)
            .classed("selected", true);

        //draw year text
        svg.append("text")
            .attr("font-size", "32px")
            .attr("font-weight", "600")
            .attr("fill", "#885bb5")
            .text(year)
            .attr("x", yearStart.cx - 30)
            .attr("y", yearStart.cy - 25);



    }
}