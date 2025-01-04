import { ItemView, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE_STATS_TRACKER } from "./constants";
import * as ReactDOM from "react-dom";
import * as React from "react";
import Calendar from "./calendar";
import '../styles.css';

export default class StatsTrackerView extends ItemView {
    private dayCounts: Record<string, number>;

    constructor(leaf: WorkspaceLeaf, dayCounts: Record<string, number>) {
        super(leaf);
        this.dayCounts = dayCounts;

        this.registerInterval(
            window.setInterval(() => {
                ReactDOM.render(React.createElement(Heatmap, {
                    data: Object.keys(this.dayCounts).map(day => {
                        return { "date": new Date(day), "count": this.dayCounts[day] }; // 直接使用 day 字符串创建 Date 对象
                    }),
                }), this.contentEl);
            }, 1000)
        );
    }

    getDisplayText() {
        return "Daily Stats";
    }

    getIcon() {
        return "bar-graph";
    }

    getViewType() {
        return VIEW_TYPE_STATS_TRACKER;
    }

    async onOpen() {
            return __awaiter(this, void 0, void 0, function* () {
                ReactDOM.render(React.createElement(Heatmap, {
                    data: Object.keys(this.dayCounts).map(day => {
                        return { "date": new Date(day), "count": this.dayCounts[day] }; // 正确的日期转换
                    }),
                    horizontal: false,
                    showMonthLabels: true,
                    showWeekdayLabels: true,
                    weekdayLabels: ["S", "M", "T", "W", "T", "F", "S"],
                    classForValue: (value) => {
                        if (!value || value.count == 0) {
                            return 'color-empty';
                        }
                        return `color${getColorLevel(value.count)}`;
                    },
                    titleForValue: (value) => !value || value.date === null ? '' : value.count + ' words on ' + new Date(value.date).toLocaleDateString() // 正确显示日期
                }), this.contentEl);
            });
    }
}
