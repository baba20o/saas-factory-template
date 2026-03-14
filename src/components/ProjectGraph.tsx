"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  label: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

const NODES: Node[] = [
  { id: "idea", label: "Project Idea", group: 0 },
  { id: "scope", label: "Scope", group: 1 },
  { id: "design", label: "Design", group: 1 },
  { id: "backend", label: "Backend", group: 2 },
  { id: "frontend", label: "Frontend", group: 2 },
  { id: "api", label: "API Layer", group: 2 },
  { id: "auth", label: "Auth", group: 3 },
  { id: "db", label: "Database", group: 3 },
  { id: "ui", label: "UI Components", group: 3 },
  { id: "testing", label: "Testing", group: 4 },
  { id: "deploy", label: "Deploy", group: 4 },
  { id: "launch", label: "Launch", group: 5 },
];

const LINKS: Link[] = [
  { source: "idea", target: "scope" },
  { source: "idea", target: "design" },
  { source: "scope", target: "backend" },
  { source: "scope", target: "frontend" },
  { source: "design", target: "frontend" },
  { source: "design", target: "ui" },
  { source: "backend", target: "api" },
  { source: "backend", target: "auth" },
  { source: "backend", target: "db" },
  { source: "frontend", target: "ui" },
  { source: "api", target: "testing" },
  { source: "auth", target: "testing" },
  { source: "ui", target: "testing" },
  { source: "testing", target: "deploy" },
  { source: "deploy", target: "launch" },
];

const GROUP_COLORS = [
  "#a78bfa", // violet
  "#818cf8", // indigo
  "#6366f1", // primary
  "#60a5fa", // blue
  "#34d399", // emerald
  "#fbbf24", // amber
];

export default function ProjectGraph({ primaryColor = "#6366f1" }: { primaryColor?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: Math.min(500, width * 0.6) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // D3 force simulation
  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Deep clone data
    const nodes: Node[] = NODES.map((d) => ({ ...d }));
    const links: Link[] = LINKS.map((d) => ({ ...d }));

    // Defs for glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow marker
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4b5563");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink<Node, Link>(links).id((d) => d.id).distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35));

    // Links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#374151")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6,4")
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0);

    // Animate links in
    link
      .transition()
      .delay((_, i) => i * 80)
      .duration(600)
      .attr("opacity", 0.6);

    // Node groups
    const node = svg
      .append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .attr("opacity", 0);

    // Animate nodes in
    node
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr("opacity", 1);

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => (d.id === "idea" || d.id === "launch" ? 22 : 16))
      .attr("fill", (d) => GROUP_COLORS[d.group])
      .attr("stroke", (d) => GROUP_COLORS[d.group])
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.3)
      .attr("filter", "url(#glow)");

    // Pulse ring on key nodes
    node
      .filter((d) => d.id === "idea" || d.id === "launch")
      .append("circle")
      .attr("r", 22)
      .attr("fill", "none")
      .attr("stroke", (d) => GROUP_COLORS[d.group])
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Labels
    node
      .append("text")
      .text((d) => d.label)
      .attr("dy", (d) => (d.id === "idea" || d.id === "launch" ? 36 : 30))
      .attr("text-anchor", "middle")
      .attr("fill", "#9ca3af")
      .attr("font-size", "11px")
      .attr("font-weight", "500");

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [isVisible, dimensions, primaryColor]);

  return (
    <section ref={containerRef} className="py-20 px-6 bg-gray-950 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            See Your Project Come to Life
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            PlanForge maps your entire project as an interactive dependency graph.
            Drag nodes to explore relationships. This is what AI planning looks like.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="w-full h-auto"
          />
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Interactive — drag nodes to explore the project structure
        </p>
      </div>
    </section>
  );
}
