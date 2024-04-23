"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const StockChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const toolTipRef = useRef(null);

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartContainerRef.current, {
        layout: {
          textColor: "black",
          background: { type: "solid", color: "white" },
        },
        rightPriceScale: {
          borderVisible: false,
        },
      });
    }

    const areaSeries = chartInstance.current.addAreaSeries({
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
      lineColor: "#2962FF",
      lineWidth: 2,
    });
    areaSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    const volumeSeries = chartInstance.current.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    areaSeries.setData(
      data.map((item) => ({ time: item.time, value: item.close }))
    );
    volumeSeries.setData(
      data.map((item) => ({ time: item.time, value: item.volume }))
    );

    chartInstance.current.subscribeCrosshairMove((param) => {
      if (param.time && param.point) {
        const dateStr = param.time;
        let price = null;
        let volume = null;

        for (const seriesId in param.prices) {
          if (
            param.prices.hasOwnProperty(seriesId) &&
            seriesId === areaSeries.seriesId
          ) {
            price = param.prices[seriesId];
            break;
          }
        }

        for (const seriesId in param.prices) {
          if (
            param.prices.hasOwnProperty(seriesId) &&
            seriesId === volumeSeries.seriesId
          ) {
            volume = param.prices[seriesId];
            break;
          }
        }

        showTooltip(dateStr, price, volume, param.point);
      } else {
        hideTooltip();
      }
    });

    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, []);

  const showTooltip = (dateStr, price, volume, point) => {
    const toolTip = toolTipRef.current;
    toolTip.style.display = "block";
    toolTip.style.left = point.x + "px";
    toolTip.style.top = point.y + "px";
    toolTip.innerHTML = `
      <div>${dateStr}</div>
      <div>Price: ${price}</div>
      <div>Volume: ${volume}</div>
    `;
  };

  const hideTooltip = () => {
    const toolTip = toolTipRef.current;
    toolTip.style.display = "none";
  };

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "500px" }}>
      <div
        ref={toolTipRef}
        style={{
          width: "auto",
          height: "auto",
          position: "absolute",
          display: "none",
          padding: "8px",
          boxSizing: "border-box",
          fontSize: "12px",
          textAlign: "left",
          zIndex: 1000,
          pointerEvents: "none",
          border: "1px solid",
          borderRadius: "2px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          background: "white",
          color: "black",
          borderColor: "rgba( 38, 166, 154, 1)",
        }}
      />
    </div>
  );
};

export default StockChart;
