import './rightNav.scss';
import $ from 'jquery';
export default class topNav {
    constructor(container, imgsrc, setttings = [{ "title": "实时监测", "link": "index.html" }, { "title": "政策模拟", "link": "zhengcemoni.html" }, { "title": "实时监测", "link": "wanquanjiance.html" }]) {
        this.container = container;
        this.src = imgsrc;
        this.setttings = setttings;
    }
    render() {
        const {container, src, setttings} = this;
        const imgsrc=require("../images/" + src);
        let imghtml = "<div class='img'><img src='" + imgsrc + "'><div class='link'>";
        let nvhtml = "<div class='nav'><ul>";
        for (let i = 0; i < setttings.length; i++) {
            imghtml += "<a href='" + setttings[i].link + "' target='_blank'></a>";
            nvhtml += "<li><a href='" + setttings[i].link + "' target='_blank'>" + setttings[i].title + "</a></li>";
        }
        imghtml+="</div></div>";
        nvhtml+="</ul></div>";
        let html=imghtml+nvhtml;
        $("#"+container).html(html);
    }
}