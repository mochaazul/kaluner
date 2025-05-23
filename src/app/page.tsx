import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Kaluner</h1>
        <p className="text-xl text-muted-foreground">
          Aplikasi Manajemen Bisnis Kuliner
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}
