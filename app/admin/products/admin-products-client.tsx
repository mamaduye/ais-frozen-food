"use client"

import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "./actions"
import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatRupiah } from "@/lib/data"
import type { Category, Product } from "@/lib/types"
import { toast } from "sonner"
type Props = {
  initialProducts: Product[]
  categories: Category[]
}

type FormState = {
  name: string
  price: string
  stock: string
  category: string
  shortDescription: string
  description: string
  image: string
  weight: string
  storage: string
  expiry: string
}

const emptyForm: FormState = {
  name: "",
  price: "",
  stock: "",
  category: "",
  shortDescription: "",
  description: "",
  image: "",
  weight: "500g",
  storage: "Simpan pada suhu -18°C",
  expiry: "baik hingga 12 bulan",
}

export function AdminProductsClient({ initialProducts, categories }: Props) {
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [uploading, setUploading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [items, search])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      category: p.categoryId,
      shortDescription: p.shortDescription,
      description: p.description,
      image: p.images[0] ?? "",
      weight: p.weight,
      storage: p.storage,
      expiry: p.expiry,
    })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.image) {
      toast.error("Product image is required")
      return
    }
    const price = Number(form.price) || 0
    const stock = Number(form.stock) || 0
    const image = form.image

    if (editing) {
        await updateProductAction({
          id: editing.id,
          name: form.name,
          price,
          stock,
          categoryId: form.category,
          shortDescription: form.shortDescription,
          description: form.description,
          imageUrl: image,
          weight: form.weight,
          storage: form.storage,
          expiry: form.expiry,
        })
      } else {
        await createProductAction({
          name: form.name,
          price,
          stock,
          categoryId: form.category,
          shortDescription: form.shortDescription,
          description: form.description,
          imageUrl: image,
          weight: form.weight,
          storage: form.storage,
          expiry: form.expiry,
        })
      }

      window.location.reload()
    setOpen(false)
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Jenis gambar tidak valid", {
        description: "Hanya gambar JPG, PNG, dan WEBP yang diizinkan.",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Gambar terlalu besar", {
        description: "Ukuran gambar maksimal adalah 5MB.",
      })
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "gagal mengunggah gambar")
      }

      setForm((current) => ({
        ...current,
        image: result.url,
      }))

      toast.success("Gambar berhasil diunggah", {
        description: "Gambar produk telah berhasil diunggah.",
      })
    } catch (error) {
      console.error(error)

      toast.error("Gagal mengunggah gambar", {
        description:
          error instanceof Error
            ? error.message
            : "ada yang salah.",
      })
    } finally {
      setUploading(false)

      // reset input supaya file yang sama bisa dipilih ulang
      e.target.value = ""
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return
    }

    await deleteProductAction(id)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Produk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola katalog makanan beku Anda. Perubahan akan muncul di toko secara langsung.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Tambah produk
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 table-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={p.images[0] || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatRupiah(p.price)}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        p.stock < 20
                          ? "text-destructive"
                          : p.stock < 50
                            ? "text-amber-600 dark:text-amber-400"
                            : ""
                      }
                    >
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}
                        className="
                          text-bg-blue-900
                          hover:bg-blue-900
                        hover:text-white
                          hover:scale-105
                          transition-all
                          duration-200
                        ">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        className="
                          text-destructive
                          hover:bg-destructive
                        hover:text-white
                          hover:scale-105
                          transition-all
                          duration-200
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Tidak ada produk yang sesuai dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editing ? "Edit produk" : "Tambah produk baru"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Perbarui detail produk. Perubahan akan disinkronkan ke toko."
                : "Buat produk baru yang dapat dibrowse dan dipesan pelanggan."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Nama produk</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="price">Harga (IDR)</Label>
              <Input
                id="price"
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger id="category" className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">Berat</Label>
              <Input
                id="weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="storage">Penyimpanan</Label>
              <Input
                id="storage"
                value={form.storage}
                onChange={(e) =>
                  setForm({ ...form, storage: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="expiry">Tanggal Kedaluwarsa</Label>
              <Input
                id="expiry"
                value={form.expiry}
                onChange={(e) =>
                  setForm({ ...form, expiry: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <Label htmlFor="image">Gambar produk</Label>

              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="cursor-pointer"
              />

              {uploading && (
                <p className="text-sm text-muted-foreground">
                  Mengunggah gambar...
                </p>
              )}

              {form.image && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={form.image}
                    alt="Product preview"
                    fill
                    className="object-contain"
                    sizes="600px"
                  />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="short">Deskripsi singkat</Label>
              <Input
                id="short"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="desc">Deskripsi lengkap</Label>
              <Textarea
                id="desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Create product"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
