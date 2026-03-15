"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2000 }: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const interpolator = d3.interpolateNumber(0, value);
    const timer = d3.timer((elapsed) => {
      const t = Math.min(elapsed / duration, 1);
      const eased = d3.easeCubicOut(t);
      setDisplay(Math.round(interpolator(eased)));
      if (t >= 1) timer.stop();
    });
    return () => timer.stop();
  }, [started, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

function MiniChart({ data, color, width = 120, height = 40 }: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data)!]).range([height - 2, 2]);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", `grad-${color.replace("#", "")}`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);

    // Area
    const area = d3
      .area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1((d) => y(d))
      .curve(d3.curveCatmullRom);

    svg
      .append("path")
      .datum(data)
      .attr("fill", `url(#grad-${color.replace("#", "")})`)
      .attr("d", area)
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    // Line
    const line = d3
      .line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveCatmullRom);

    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate line drawing
    const totalLength = path.node()!.getTotalLength();
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

    // Dot at end
    svg
      .append("circle")
      .attr("cx", x(data.length - 1))
      .attr("cy", y(data[data.length - 1]))
      .attr("r", 3)
      .attr("fill", color)
      .attr("opacity", 0)
      .transition()
      .delay(1500)
      .duration(300)
      .attr("opacity", 1);

  }, [isVisible, data, color, width, height]);

  return <svg ref={svgRef} width={width} height={height} className="overflow-visible" />;
}

function ActivityBar({ data, color, width = 200, height = 32 }: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const barWidth = width / data.length - 2;
    const y = d3.scaleLinear().domain([0, d3.max(data)!]).range([0, height]);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => i * (barWidth + 2))
      .attr("y", height)
      .attr("width", barWidth)
      .attr("height", 0)
      .attr("rx", 2)
      .attr("fill", color)
      .attr("opacity", 0.7)
      .transition()
      .delay((_, i) => i * 30)
      .duration(600)
      .ease(d3.easeBounceOut)
      .attr("y", (d) => height - y(d))
      .attr("height", (d) => y(d));

  }, [isVisible, data, color, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

const METRICS = [
  {
    label: "Plans Generated",
    value: 12847,
    suffix: "",
    trend: "+23%",
    trendUp: true,
    color: "#6366f1",
    sparkline: [20, 35, 28, 45, 52, 48, 62, 58, 72, 85, 78, 92],
  },
  {
    label: "Avg. Generation Time",
    value: 24,
    suffix: "s",
    trend: "-12%",
    trendUp: true,
    color: "#34d399",
    sparkline: [45, 42, 38, 40, 35, 32, 30, 28, 26, 25, 24, 24],
  },
  {
    label: "Team Members Active",
    value: 3420,
    suffix: "",
    trend: "+18%",
    trendUp: true,
    color: "#818cf8",
    sparkline: [15, 22, 28, 35, 40, 38, 45, 52, 58, 62, 68, 72],
  },
  {
    label: "Exports This Month",
    value: 8563,
    suffix: "",
    trend: "+31%",
    trendUp: true,
    color: "#fbbf24",
    sparkline: [30, 35, 42, 38, 48, 55, 52, 62, 68, 72, 78, 85],
  },
];

const ACTIVITY_DATA = [
  8, 12, 6, 15, 10, 18, 14, 20, 16, 22, 12, 25, 18, 28, 20, 30, 24, 32, 22, 35,
  28, 38, 30, 42, 35, 40, 32, 45, 38, 48,
];

export default function LiveMetrics({ primaryColor = "#6366f1" }: { primaryColor?: string }) {
  return (
    <section className="py-20 px-6 bg-background border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Built for Scale
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Real-time metrics from the PlanForge platform. Every number tells a story.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-sm">{metric.label}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    metric.trendUp
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {metric.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-text-primary mb-3">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <MiniChart data={metric.sparkline} color={metric.color} />
            </div>
          ))}
        </div>

        {/* Activity bar */}
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-text-primary font-semibold">Daily Activity</h3>
              <p className="text-text-muted text-sm">Plans generated over the last 30 days</p>
            </div>
            <div className="flex gap-2">
              {["7d", "14d", "30d"].map((range) => (
                <button
                  key={range}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    range === "30d"
                      ? "bg-primary-light text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <ActivityBar data={ACTIVITY_DATA} color={primaryColor} width={800} height={60} />
        </div>
      </div>
    </section>
  );
}
