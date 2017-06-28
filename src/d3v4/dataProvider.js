const data = {
    industry_dist: {
        former: { year: 2010, tertiary: 31.2, secondary: 52.3, primary: 16.5 },
        latest: { year: 2015, tertiary: 36.9, secondary: 48.6, primary: 14.5 }
    },
    increment: {
        cmp_years: [//只有两年
            { year: 2014, value: 176.9, unit: "亿元", ctrb: 24.8 },
            { year: 2015, value: 337.5, unit: "亿元", ctrb: 39.4 }
        ],
        incr_pct: 68.8,
        avg_incr_pct: 11,
        over_avg_pct: 1.8,
        ctrb_pct: 14.6
    },
    informatization: {
        comp_total: { num: 543, unit: "个" },
        class_stat: [
            { name: "使用计算机的企业", num: 541, unit: "个", pct: 99.6 },
            { name: "有信息技术人员的企业", num: 479, unit: "个", pct: 88.2 },
            { name: "使用信息化管理的企业", num: 514, unit: "个", pct: 94.7 },
            { name: "有信息化投入的企业", num: 377, unit: "个", pct: 69.4 },
            { name: "有网站的企业", num: 268, unit: "个", pct: 49.4 }
        ]
    },
    intenet_app: [
        { name: "使用网上银行", num: 298, unit: "个", pct: 55.1 },
        { name: "了解商品和服务的信息", num: 206, unit: "个", pct: 38.1 },
        { name: "收发电子邮件的企业", num: 449, unit: "个", pct: 83.0 },
        { name: "从政府机构获取信息", num: 184, unit: "个", pct: 34.0 },
        { name: "提供客户服务", num: 88, unit: "个", pct: 16.3 },
    ],
    ecom: {
        class_stat: [
            { name: "有电子商务交易的企业", num: 39, unit: "个", pct: 7.2 },
            { name: "有电子商务平台的企业", num: 25, unit: "个", pct: 4.6 },
        ],
        total_stat: [
            { name: "电子商务销售", num: 174158, unit: "万元" },
            { name: "电子商务采购", num: 154929, unit: "万元" }
        ]
    }
}

import { basePath } from '../components/hostComponent';

export default function getdata() {
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}