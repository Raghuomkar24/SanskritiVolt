"use client";
import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import ReactDatamaps from "react-india-states-map";

interface Tooltip {
  visible: boolean;
  x: number;
  y: number;
  name: string;
}

interface ActiveState {
  name: string;
  data?: any;
}

const IndiaMap: React.FC = () => {
  const [activeState, setActiveState] = useState<ActiveState>({ name: "India" });
  const [tooltip, setTooltip] = useState<Tooltip>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
  });

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Debounced tooltip update
  const updateTooltip = useCallback(
    (e: React.MouseEvent<SVGElement>, name: string) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        const mapContainer = (e.currentTarget as unknown as HTMLElement).getBoundingClientRect();
        setTooltip({
          visible: true,
          x: e.clientX - mapContainer.left + 20,
          y: e.clientY - mapContainer.top - 40,
          name,
        });
      }, 50);
    },
    []
  );

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, name: string) => {
    updateTooltip(e, name);
  };

  const handleMouseLeave = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    setTooltip((prevTooltip) => ({ ...prevTooltip, visible: false }));
  };

  const stateOnClick = (data: Record<string, any>, name: string) => {
    setActiveState({ data, name });
    const sanitizedName = name.replace(/\s+/g, "-").toLowerCase();
    router.push(`/state/${sanitizedName}`);
  };

  return (
    <div
      style={{
        width: "700px", // smaller than before
        height: "580px", // reduced height so it won’t cut
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        margin: "0 auto", // center map horizontally
      }}
    >
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "white",
            padding: "6px",
            border: "1px solid black",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.name || "No Data"}
        </div>
      )}

      <ReactDatamaps
        mapLayout={{
          hoverTitle: "Count",
          noDataColor: "#D36418",
          borderColor: "#ffffff",
          hoverBorderColor: "pink",
          hoverColor: "green",
        }}
        onMouseMove={(region: any, name: string, e: React.MouseEvent<SVGElement>) =>
          handleMouseMove(e, name)
        }
        onMouseLeave={handleMouseLeave}
        onClick={(data: any, name: string) => stateOnClick(data, name)}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
    </div>
  );
};

export default IndiaMap;
