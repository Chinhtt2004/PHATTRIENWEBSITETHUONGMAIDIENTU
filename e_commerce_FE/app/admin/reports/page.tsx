"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const revenueData = [
  { date: "01/01", revenue: 4500000, orders: 12 },
  { date: "02/01", revenue: 5200000, orders: 15 },
  { date: "03/01", revenue: 4800000, orders: 13 },
  { date: "04/01", revenue: 6100000, orders: 18 },
  { date: "05/01", revenue: 5500000, orders: 16 },
  { date: "06/01", revenue: 6700000, orders: 20 },
  { date: "07/01", revenue: 7200000, orders: 22 },
  { date: "08/01", revenue: 8500000, orders: 25 },
  { date: "09/01", revenue: 7800000, orders: 23 },
  { date: "10/01", revenue: 9200000, orders: 28 },
  { date: "11/01", revenue: 10500000, orders: 32 },
  { date: "12/01", revenue: 12540000, orders: 38 },
  { date: "13/01", revenue: 11800000, orders: 35 },
  { date: "14/01", revenue: 13200000, orders: 40 },
];

const categoryData = [
  { name: "Chăm sóc da", value: 45, color: "#B76E79" },
  { name: "Trang điểm", value: 30, color: "#E8D5C4" },
  { name: "Dưỡng thể", value: 15, color: "#4CAF50" },
  { name: "Nước hoa", value: 10, color: "#2196F3" },
];

const topProducts = [
  { name: "Serum Vitamin C 20%", sales: 156, revenue: 70200000, growth: 25 },
  { name: "Kem Dưỡng Ẩm Hyaluronic", sales: 142, revenue: 53960000, growth: 18 },
  { name: "Kem Chống Nắng SPF50+", sales: 128, revenue: 40960000, growth: 12 },
  { name: "Sữa Rửa Mặt Dịu Nhẹ", sales: 98, revenue: 24500000, growth: -5 },
  { name: "Son Môi Lì Velvet", sales: 87, revenue: 24360000, growth: 8 },
];

const stats = [
  {
    title: "Tổng doanh thu",
    value: "125.400.000đ",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "So với tháng trước",
  },
  {
    title: "Đơn hàng",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "347 đơn thành công",
  },
  {
    title: "Khách hàng mới",
    value: "256",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    description: "32% từ quảng cáo",
  },
  {
    title: "Giá trị đơn TB",
    value: "890.000đ",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    description: "Giảm so với kỳ trước",
  },
];

const conversionData = [
  { stage: "Xem sản phẩm", value: 10000, rate: 100 },
  { stage: "Thêm vào giỏ", value: 2500, rate: 25 },
  { stage: "Bắt đầu checkout", value: 1500, rate: 15 },
  { stage: "Hoàn thành", value: 750, rate: 7.5 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("7days");

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Báo cáo & Phân tích
          </h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất kinh doanh của cửa hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">90 ngày qua</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Doanh thu & Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Doanh thu", color: "var(--primary)" },
                orders: { label: "Đơn hàng", color: "var(--chart-3)" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) =>
                          name === "revenue"
                            ? formatCurrency(value as number)
                            : value
                        }
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Doanh số theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Tỉ lệ", color: "var(--primary)" },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel & Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phễu chuyển đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((item, index) => (
                <div key={item.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.stage}</span>
                    <span className="font-medium">
                      {item.value.toLocaleString()} ({item.rate}%)
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  {index < conversionData.length - 1 && (
                    <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {Math.round(
                        ((conversionData[index].value -
                          conversionData[index + 1].value) /
                          conversionData[index].value) *
                          100
                      )}
                      % rời bỏ
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Đã bán</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                  <TableHead className="text-right">Tăng trưởng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          product.growth > 0
                            ? "border-success text-success"
                            : "border-destructive text-destructive"
                        }
                      >
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
            <CardTitle className="text-lg">Nguồn truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { source: "Tìm kiếm tự nhiên", visits: 4520, percentage: 45, color: "bg-primary" },
              { source: "Quảng cáo trả phí", visits: 2580, percentage: 26, color: "bg-chart-3" },
              { source: "Mạng xã hội", visits: 1890, percentage: 19, color: "bg-chart-4" },
              { source: "Trực tiếp", visits: 1010, percentage: 10, color: "bg-chart-5" },
            ].map((item) => (
              <div key={item.source} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.source}</span>
                  <ArrowUpRight className="h-4 w-4 text-success" />
                </div>
                <p className="mt-2 text-2xl font-bold">{item.visits.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
