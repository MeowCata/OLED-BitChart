/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/
/**
 * Custom blocks
 */
//% weight=100 color=#5EA9DD icon="\uf201"
namespace BitChart {
    // 全局变量
    let dataHistory: number[] = []
    let minValue = Infinity
    let maxValue = -Infinity
    let lastX = 0
    let needsFullRedraw = true
    let topMargin_i = 9  // 初始化并明确类型
    let bottomMargin_i = 9

    /**
     * draw a line graph on your OLED
     */
    //% block="draw line graph: data %data sample-rate %sampleRate jitter %jitter top-margin %topMargin bottom-margin %bottomMargin"
    export function drawCurve(
        data: number, 
        sampleRate: number, 
        jitter: number, 
        topMargin: number, 
        bottomMargin: number
    ): void {
        // 更新边距值
        topMargin_i = topMargin
        bottomMargin_i = bottomMargin

        // 1. 检查是否需要更新极值
        let rangeChanged = false
        if (data < minValue) {
            minValue = data - jitter
            rangeChanged = true
        }
        if (data > maxValue) {
            maxValue = data + jitter
            rangeChanged = true
        }

        // 2. 添加新数据点
        dataHistory.push(data)
        if (dataHistory.length > 128) {
            dataHistory.shift()
        }

        // 3. 决定刷新方式
        if (rangeChanged || needsFullRedraw || dataHistory.length === 1) {
            fullRedraw()
            needsFullRedraw = false
        } else {
            partialRedraw()
        }

        // 4. 延迟控制采样率
        basic.pause(1000 / sampleRate)
    }

    /**
     * clear and reset the graph
     */
    //% block="reset graph"
    export function resetGraph(): void {
        dataHistory = []
        minValue = Infinity
        maxValue = -Infinity
        needsFullRedraw = true
        YFOLED.clear()
    }

    function fullRedraw(): void {
        // 1. 清除屏幕
        YFOLED.clear()

        // 2. 显示极值
        YFOLED.writeNumNewLine(maxValue)
        for (let i = 0; i < 6; i++) {
            YFOLED.newLine()
        }
        YFOLED.writeNumNewLine(minValue)

        // 3. 绘制所有线段
        const graphY = topMargin_i
        const graphHeight = 64 - topMargin_i - bottomMargin_i

        for (let i = 1; i < dataHistory.length; i++) {
            const y1 = calculateY(dataHistory[i - 1], graphY, graphHeight)
            const y2 = calculateY(dataHistory[i], graphY, graphHeight)
            YFOLED.drawLine(i - 1, y1, i, y2)
        }
    }

    function partialRedraw(): void {
        const graphY = topMargin_i
        const graphHeight = 64 - topMargin_i - bottomMargin_i
        const len = dataHistory.length

        // 1. 清除上一条线段的末端
        if (len > 2) {
            const yPrev = calculateY(dataHistory[len - 3], graphY, graphHeight)
            const yLast = calculateY(dataHistory[len - 2], graphY, graphHeight)
            YFOLED.drawLine(len - 3, yPrev, len - 2, yLast)
        }

        // 2. 绘制新线段
        const y1 = calculateY(dataHistory[len - 2], graphY, graphHeight)
        const y2 = calculateY(dataHistory[len - 1], graphY, graphHeight)
        YFOLED.drawLine(len - 2, y1, len - 1, y2)

        // 3. 检查是否需要循环
        if (len === 128) {
            dataHistory = []
            needsFullRedraw = true
        }
    }

    function calculateY(value: number, graphY: number, graphHeight: number): number {
        if (maxValue === minValue) {
            return graphY + graphHeight / 2
        }
        let y = graphY + graphHeight - Math.round(
            (value - minValue) / (maxValue - minValue) * graphHeight
        )
        return Math.max(graphY, Math.min(graphY + graphHeight, y))
    }
}
