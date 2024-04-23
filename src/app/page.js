"use client";
import StockChart from "@/components/stockChart";
import data from "@/data/data";
import { useState } from "react";

export default function Home() {
  const [selectedRange, setSelectedRange] = useState(0);

  const handleRangeChange = (num) => {
    setSelectedRange(num);
  };

  const intervals = ["1D", "1W", "1M", "1Y"];
  return (
    <>
      <div className="pt-4 ps-2">
        {intervals.map((item, id) => (
          <button
            key={id}
            onClick={(e) => {
              e.stopPropagation();
              handleRangeChange(id);
            }}
            className={`${
              selectedRange === id ? "bg-gray-950 text-white" : "bg-gray-100"
            } size-9 border border-gray-200 rounded`}
          >
            {item}
          </button>
        ))}
      </div>
      <StockChart data={data} />
    </>
  );
}
