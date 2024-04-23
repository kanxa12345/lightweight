"use client";
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import data from "@/data/data";

const StockChart = () => {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);

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
      data.map((item) => ({ time: item.time, value: item.volume }))
    );
    volumeSeries.setData(
      data.map((item) => ({ time: item.time, value: item.volume }))
    );

    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default StockChart;
