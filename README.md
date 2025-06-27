# oled-bitchart
A practical extension based on micro:bit for data analysis  

![icon.png](https://github.com/MeowCata/oled-bitchart/blob/master/icon.png)
[icon.png](https://github.com/MeowCata/oled-bitchart/blob/master/icon.png) by ChatGPT

> [!TIP]
> This MakeCode extension used [YF-OLED](https://github.com/YFROBOT-TM/pxt-yfrobot-oled) as its dependency, so you should get an OLED screen with an I2C address `0x3D`

For those OLED screens with I2C addresses of `0x3C`, please fork this project and edit `dependencies` in [pxt.json](https://github.com/MeowCata/oled-bitchart/blob/master/pxt.json):
```json
"dependencies": {
    "core": "*",
    "SSD1306_OLED": "github:tinkertanker/pxt-oled-ssd1306#v2.0.17"
},
```
And edit [main.ts](https://github.com/MeowCata/oled-bitchart/blob/master/main.ts):
```typescript
YFOLED.clear() --> OLED.clear()
/* and so on */
```

### 1. What Can This Extension Do?  

If you've used the serial functionality of the micro:bit, you may know that MakeCode plots a line graph for the serial-printed data, as shown below:  

 
However, if the micro:bit is not connected to a computer and is instead powered by an external source, this feature becomes unavailable.  

Therefore, this extension aims to develop a similar "data analysis" feature for use with an external OLED screen and encapsulates it into a function for easy calling.  

### 2. Extension Features & Usage  

This project used `DeepSeek V3-0324` model for coding and can be used as an extension in MakeCode.

[main.ts](https://github.com/MeowCata/OLED-BitChart/blob/main/main.ts) contains a function called `drawCurve`. To use it, first add the extension in MakeCode, then call this function in a loop.  

**Explanation of the `drawCurve()` parameters:**  
* `data`: The data to be plotted, which can be sensor readings.  
* `sampleRate`: The number of plots per second.  
* `jitter`: The fluctuation range for the maximum and minimum values of the line graph. Since the graph automatically adjusts its range based on the input `data`, this process involves a full-screen refresh (which is slightly time-consuming). To minimize refresh frequency, the maximum/minimum value is increased in by one unit of `jitter` value. Additionally, this expands the range, avoiding unnecessary screen refreshes caused by sensor noise (see [Runtime Explanation](#runtime-explanation) for details).  

Here's an example using `MPU6050` as a temperature sensor ([runtime photo](https://github.com/MeowCata/oled-bitchart#runtime-photo)) (MPU6050 extention: [pxt-mpu6050](https://github.com/zuoyu2014/pxt-mpu6050)):  
```typescript
YFOLED.init(128, 64)
MPU6050.initMPU6050(MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68)
basic.forever(function () {
    input.onButtonPressed(Button.A, function () {
        while (!input.buttonIsPressed(Button.B)) {
            BitChart.drawCurve(Math.round(MPU6050.readTempature(MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68)*100)/100, 5, 0.3) //two-digit number and two decimal places---recommended
        }
        YFOLED.clear()
        BitChart.resetGraph()
        MPU6050.resetMPU6050(MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68)
    })
})


```  

### Runtime Explanation  

When the program starts, the maximum and minimum values (referred to as "extremes") of the graph are determined based on the current `data` input, with the range defined as `Δ range = 2 × jitter`. The current maximum and minimum values are displayed in the top-right and bottom-right corners of the screen(default: two-digit number and two decimal places) (this feature may require manual adjustments depending on the extension and OLED screen used **and the data**, as it hasn't been tested on other extensions or OLED screens).  

If the current `data` value exceeds the extremes range, the maximum or minimum will be increased by one unit of `jitter`, the screen will be refreshed, and the graph will be redrawn with the updated range.  

If the line graph exceeds the screen width (128 pixels), the historical data will be cleared, and plotting will restart from the left side of the screen.  

**Recommended Use:**  
- Suitable for plotting not *that* big variations in data(temperature, humidity, brightness change, gas concentration, acceleration, sound level, etc.)  
- Not recommended for detecting large changes, such as axis angle variations, as significant value fluctuations can make the graph difficult to interpret and cause frequent refreshes.  

#### Runtime Photo  


This project should be helpful for data analysis. By adjusting the `sampleRate`, you can achieve long-term plotting, but be mindful of OLED burn-in. It is recommended to use it in conjunction with the `Data Logger` extension for both short- and long-term monitoring.



> Open this page at [https://meowcata.github.io/oled-bitchart/](https://meowcata.github.io/oled-bitchart/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/meowcata/oled-bitchart** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/meowcata/oled-bitchart** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
