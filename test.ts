// tests go here; this will not be compiled when this package is used as an extension.
YFOLED.init(128, 64)
basic.forever(function () {
    input.onButtonPressed(Button.A, function () {
        while (!input.buttonIsPressed(Button.B)) {
            BitChart.drawCurve(Math.round(input.lightLevel())*100)/100, 5, 10)
        }
        YFOLED.clear()
        BitChart.resetGraph()
    })
})
