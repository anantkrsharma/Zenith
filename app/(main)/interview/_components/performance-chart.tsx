"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { format } from "date-fns";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PerformanceChart = ({ assessments }: { assessments: Assessment[] }) => {
  const chartData = assessments.map((assessment) => ({
    date: format(new Date(assessment.createdAt), "MMM dd yyyy"),
    score: Number(assessment.quizScore.toFixed(1)),
  }));

  const isLargeScreen = useMediaQuery("(min-width: 1280px)");
  const isMediumScreen = useMediaQuery("(max-width: 1023px)");
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const heightClass = "h-[240px] md:h-[350px]";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="md:text-lg">Your progress has a shape.</CardTitle>
        <CardDescription className="space-y-0">
          <div>Assessment scores over time · 0–100%</div>
          <br />
          {isSmallScreen && chartData.length > 0 && (
            <span className="text-sm text-primary">
              Tap a point to see the score and date.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <p className="font-medium">A little practice goes a long way.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your performance trend will appear after your first quiz.
            </p>
          </div>
        ) : (
          <div className={`${heightClass} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  left: isSmallScreen ? -25 : -5,
                  right: isMediumScreen ? (isSmallScreen ? 10 : 50) : 50,
                  bottom: isMediumScreen ? (isSmallScreen ? -15 : 70) : 30,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 5" />
                <XAxis
                  dataKey="date"
                  interval={0}
                  angle={
                    isMediumScreen
                      ? isSmallScreen
                        ? 0
                        : -15
                      : isLargeScreen
                        ? 0
                        : -10
                  }
                  dy={isMediumScreen ? (isSmallScreen ? 0 : 15) : 15}
                  tick={!isSmallScreen}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-neutral-900 border border-zinc-700 rounded-lg p-2 space-y-[2px] shadow-lg text-center">
                          <p className="text-sm font-medium">
                            Score: {payload[0].value}%
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {payload[0].payload.date}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="score"
                  stroke="#70b7c2"
                  strokeWidth={2.5}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
