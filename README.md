# density-plot
a simple density plot / 2D histogram / heatmap

Uses D3 for [axes](https://github.com/d3/d3-axis) and color [scales](https://github.com/d3/d3-scale) as well as [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic).

Because the plot uses 2D canvas pixels as opposed to svg rectangles this implementation is likely better suited for large plots with tens of thousands of data points.

Node:
```npm install density-plot```

Browser: In the dist folder is minified version of the code built for loading into the browser which uses the global variable "densityPlot".

see example for usage
https://run.plnkr.co/preview/cjbd112es00063h5yaujsug9h/

Build:
```
npm run build
```

Develop:
```
npm run dev
```



<img width="498" alt="screen shot 2017-12-18 at 5 27 55 pm" src="https://user-images.githubusercontent.com/232036/34133285-833991de-e419-11e7-96d7-a3d9f02eaadd.png">
