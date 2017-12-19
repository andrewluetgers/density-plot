# density-plot
a simple density plot / 2D histogram / heatmap

Uses D3 for [axes](https://github.com/d3/d3-axis) and color [scales](https://github.com/d3/d3-scale) as well as [d3-scale-chromtic](https://github.com/d3/d3-scale-chromatic)
Uses 2D canvas for the plot. 

Because the plot uses canvas pixels as opposed to svg rectangles this implementation is likely better suited for large plots with tens of thousands of data points.

see examples for usage

<img width="498" alt="screen shot 2017-12-18 at 5 27 55 pm" src="https://user-images.githubusercontent.com/232036/34133285-833991de-e419-11e7-96d7-a3d9f02eaadd.png">
