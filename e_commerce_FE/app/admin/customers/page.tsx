"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreHorizontal, Eye, Mail, UserX, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
  {
    id: "cust_001",
    name: "Nguyễn Thị Lan",
    email: "lan.nguyen@example.com",
    phone: "0901234567",
    orders: 12,
    totalSpent: 15600000,
    tier: "Gold",
    joinDate: "01/06/2023",
    avatar: null,
  },
  {
    id: "cust_002",
    name: "Trần Văn Minh",
    email: "minh.tran@example.com",
    phone: "0912345678",
    orders: 5,
    totalSpent: 4200000,
    tier: "Silver",
    joinDate: "15/09/2024",
    avatar: null,
  },
  {
    id: "cust_003",
    name: "Lê Thị Hương",
    email: "huong.le@example.com",
    phone: "0923456789",
    orders: 28,
    totalSpent: 42000000,
    tier: "Platinum",
    joinDate: "20/03/2022",
    avatar: null,
  },
  {
    id: "cust_004",
    name: "Phạm Văn Đức",
    email: "duc.pham@example.com",
    phone: "0934567890",
    orders: 2,
    totalSpent: 980000,
    tier: "Bronze",
    joinDate: "10/01/2026",
    avatar: null,
  },
  {
    id: "cust_005",
    name: "Hoàng Thị Mai",
    email: "mai.hoang@example.com",
    phone: "0945678901",
    orders: 8,
    totalSpent: 8500000,
    tier: "Gold",
    joinDate: "05/07/2024",
    avatar: null,
  },
];

const tierColors: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-800",
  Silver: "bg-slate-100 text-slate-800",
  Gold: "bg-yellow-100 text-yellow-800",
  Platinum: "bg-purple-100 text-purple-800",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Khách hàng
        </h1>
        <p className="text-muted-foreground">
          Quản lý thông tin khách hàng và cấp bậc thành viên
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{customers.length}</p>
            <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {customers.filter((c) => c.tier === "Gold" || c.tier === "Platinum").length}
            </p>
            <p className="text-sm text-muted-foreground">Khách hàng VIP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {formatCurrency(
                customers.reduce((acc, c) => acc + c.totalSpent, 0) /
                  customers.length
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Chi tiêu trung bình
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {(
                customers.reduce((acc, c) => acc + c.orders, 0) /
                customers.length
              ).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              Đơn hàng trung bình
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Cấp bậc</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar || undefined} />
                          <AvatarFallback className="bg-primary-light text-primary">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{customer.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell>
                      <Badge className={tierColors[customer.tier]}>
                        {customer.tier === "Platinum" && (
                          <Crown className="mr-1 h-3 w-3" />
                        )}
                        {customer.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.joinDate}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Gửi email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Vô hiệu hóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy khách hàng nào
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
