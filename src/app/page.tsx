import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
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
              <CardTitle>Analisis Bisnis</CardTitle>
              <CardDescription>
                Lihat laporan dan analisis bisnis kuliner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Dapatkan wawasan tentang bisnis kuliner Anda melalui laporan dan analisis yang komprehensif.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/analytics">Lihat Analisis</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Mulai Kelola Bisnis Kuliner Anda</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Kaluner membantu Anda mengelola berbagai aspek bisnis kuliner, dari manajemen resep, perhitungan biaya, inventaris, hingga pelaporan.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Masuk ke Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
