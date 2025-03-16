import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Package, 
  Percent, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Utensils 
} from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgColor: string;
}

const DashboardCard = ({ 
  icon, 
  title, 
  description, 
  href, 
  bgColor 
}: DashboardCardProps) => {
  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-md transition-all">
        <div className={`${bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </Card>
    </Link>
  );
};

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang di Kaluner</h1>
        <p className="text-gray-500 mt-1">
          Kelola bisnis kuliner Anda dengan mudah dan efisien
        </p>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-500" />
            <h3 className="text-lg font-semibold">Ringkasan Bisnis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Penjualan Hari Ini</p>
              <p className="text-2xl font-bold mt-1">Rp 0</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Stok Menipis</p>
              <p className="text-2xl font-bold mt-1">0 item</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Promosi Aktif</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          icon={<Utensils size={24} className="text-white" />}
          title="Manajemen Resep"
          description="Kelola resep dan hitung biaya produksi (HPP)"
          href="/dashboard/recipes"
          bgColor="bg-blue-500"
        />
        
        <DashboardCard
          icon={<Package size={24} className="text-white" />}
          title="Inventaris"
          description="Kelola stok bahan baku dan inventaris"
          href="/dashboard/inventory"
          bgColor="bg-green-500"
        />
        
        <DashboardCard
          icon={<ShoppingCart size={24} className="text-white" />}
          title="Pembelian"
          description="Kelola pembelian dan supplier"
          href="/dashboard/purchases"
          bgColor="bg-purple-500"
        />
        
        <DashboardCard
          icon={<BookOpen size={24} className="text-white" />}
          title="Menu"
          description="Kelola menu dan penetapan harga"
          href="/dashboard/menu"
          bgColor="bg-orange-500"
        />
        
        <DashboardCard
          icon={<CreditCard size={24} className="text-white" />}
          title="Penjualan"
          description="Catat dan analisis penjualan"
          href="/dashboard/sales"
          bgColor="bg-red-500"
        />
        
        <DashboardCard
          icon={<Percent size={24} className="text-white" />}
          title="Promosi"
          description="Kelola diskon dan program loyalitas"
          href="/dashboard/promotions"
          bgColor="bg-pink-500"
        />
        
        <DashboardCard
          icon={<Calendar size={24} className="text-white" />}
          title="Perencanaan Bisnis"
          description="Analisis BEP dan proyeksi keuangan"
          href="/dashboard/planning"
          bgColor="bg-indigo-500"
        />
        
        <DashboardCard
          icon={<BarChart3 size={24} className="text-white" />}
          title="Laporan"
          description="Lihat laporan keuangan dan performa"
          href="/dashboard/reports"
          bgColor="bg-cyan-500"
        />
        
        <DashboardCard
          icon={<Users size={24} className="text-white" />}
          title="Pelanggan"
          description="Kelola data pelanggan"
          href="/dashboard/customers"
          bgColor="bg-amber-500"
        />
      </div>

      
    </div>
  );
};

export default DashboardPage;
