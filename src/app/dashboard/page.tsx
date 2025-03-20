import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { logout } from '@/app/auth/actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Kaluner</h1>
          <p className="text-muted-foreground">Selamat datang, {data.user.email}</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Resep</CardTitle>
              <CardDescription>
                Kelola resep dengan perhitungan biaya otomatis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Buat dan kelola resep dengan mudah. Hitung biaya produksi secara otomatis berdasarkan bahan yang digunakan.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/recipes">Lihat Resep</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventaris Bahan</CardTitle>
              <CardDescription>
                Pantau stok bahan dan harga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Kelola inventaris bahan dengan mudah. Pantau stok dan harga bahan untuk memastikan ketersediaan dan kontrol biaya.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/ingredients">Lihat Bahan</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menu & Harga</CardTitle>
              <CardDescription>
                Kelola menu dan harga jual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Buat dan kelola menu dengan mudah. Tetapkan harga jual yang optimal berdasarkan biaya produksi dan margin yang diinginkan.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/menu-items">Lihat Menu</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Aktivitas yang terjadi dalam 7 hari terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Belum ada aktivitas terbaru
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Bisnis</CardTitle>
              <CardDescription>
                Ringkasan bisnis kuliner Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Belum ada data statistik
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
