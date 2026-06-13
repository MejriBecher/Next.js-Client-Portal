"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type CssVars = {
  text: string
  textMuted: string
  grid: string
  tooltipBg: string
  tooltipBorder: string
}

function useCssVars(): CssVars {
  const { theme } = useTheme()
  const [vars, setVars] = useState<CssVars>({
    text: "#1a1c1b",
    textMuted: "#444748",
    grid: "#c4c7c7",
    tooltipBg: "#ffffff",
    tooltipBorder: "#c4c7c7",
  })

  const read = useCallback(() => {
    const el = document.documentElement
    const get = (name: string, fallback: string) =>
      getComputedStyle(el).getPropertyValue(name).trim() || fallback

    setVars({
      text: get("--color-text-rich", "#1a1c1b"),
      textMuted: get("--color-on-surface-variant", "#444748"),
      grid: get("--color-border", "#c4c7c7"),
      tooltipBg: get("--color-surface-container-lowest", "#ffffff"),
      tooltipBorder: get("--color-border", "#c4c7c7"),
    })
  }, [])

  useEffect(() => { read() }, [read, theme])

  return vars
}

const SAGE = "#506D68"
const AMBER = "#D4A04A"
const GRAY = "#9CA3AF"

export function RequestTrendChart({
  data,
}: {
  data: { date: string; count: number }[]
}) {
  const css = useCssVars()

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: d.count,
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={4}>
          <XAxis
            dataKey="date"
            tick={{ fill: css.textMuted, fontSize: 12 }}
            axisLine={{ stroke: css.grid }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: css.textMuted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: css.tooltipBg,
              border: `1px solid ${css.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 14,
              color: css.text,
            }}
          />
          <Bar dataKey="count" fill={SAGE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const PIE_COLORS: Record<string, string> = {
  Pending: AMBER,
  "In progress": SAGE,
  Done: GRAY,
}

export function StatusBreakdownChart({
  data,
}: {
  data: { name: string; value: number }[]
}) {
  const css = useCssVars()

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="h-[300px] flex items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={PIE_COLORS[entry.name] ?? GRAY}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: css.tooltipBg,
              border: `1px solid ${css.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 14,
              color: css.text,
            }}
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : 0
              return [
                `${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`,
                name,
              ]
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-3 shrink-0">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: PIE_COLORS[entry.name] ?? GRAY }}
            />
            <span className="font-body text-[14px] leading-relaxed text-on-surface-variant">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
