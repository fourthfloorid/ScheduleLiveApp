# Brand Tag System - User Interface Guide

Panduan lengkap untuk menggunakan Brand Tag System di User Management untuk mengatur akses host ke brand.

## Overview

Brand Tag System memungkinkan admin untuk mengatur brand mana saja yang bisa diakses oleh seorang host:
- **Flexible Host (🌟)**: Host tanpa brand tags (array kosong) bisa bekerja dengan SEMUA brand
- **Exclusive Host (🎯)**: Host dengan brand tags hanya bisa bekerja dengan brand yang dipilih

## Fitur UI

### 1. User Management Table

Tabel user sekarang memiliki kolom **Brand Access** yang menampilkan:

#### Untuk Host Flexible:
```
🌟 Flexible
```
- Badge kuning yang menunjukkan host bisa bekerja dengan semua brand
- Tidak ada batasan brand

#### Untuk Host Exclusive:
```
🎯 2 Brands
[Tag] Brand A  [Tag] Brand B
```
- Badge biru menunjukkan jumlah brand yang bisa diakses
- Menampilkan 2 brand pertama dengan icon tag
- Jika lebih dari 2, ada indicator `+N` untuk brand tambahan

#### Untuk Admin:
```
-
```
- Tidak ada brand access karena admin tidak perlu assignment

### 2. Edit User Modal - Brand Tag Selector

Saat edit user dengan role **Host**, akan muncul section **Brand Access**:

#### Status Indicator Box
```
┌─────────────────────────────────────────────┐
│ 🌟 Flexible Host - Can work with ALL brands │
│ Currently flexible (can work with all brands)│
└─────────────────────────────────────────────┘
```
atau
```
┌─────────────────────────────────────────────┐
│ 🎯 Exclusive Host - 2 brand(s) only         │
│ Clear all to make flexible                   │
└─────────────────────────────────────────────┘
```

#### Brand Selection List
- Scrollable list dengan max-height 48 (overflow jika banyak brand)
- Setiap brand ditampilkan dalam card dengan:
  - ✅ Checkbox untuk select/unselect
  - 🏷️ Icon tag
  - Nama brand
  - Description (jika ada)
  - Badge "Selected" jika dipilih
  - Highlight biru untuk brand yang selected

#### Selected Brands Summary
Jika ada brand yang dipilih, muncul summary box di bawah:
```
┌─────────────────────────────────────────────┐
│ Selected brands:                            │
│ [Tag] Brand A [x]  [Tag] Brand B [x]        │
└─────────────────────────────────────────────┘
```
- Pills untuk setiap selected brand
- Button [x] untuk remove brand dari selection

## Cara Penggunaan

### 1. Membuat Host Flexible (Default)

**Step by step:**
1. Buka User Management
2. Klik tombol Edit pada user host
3. Pastikan Role = "Host"
4. **Jangan pilih brand sama sekali** atau klik "Clear all to make flexible"
5. Klik "Update User"

**Result:**
- Host akan menampilkan badge `🌟 Flexible`
- Host bisa di-assign ke semua brand yang ada
- Cocok untuk host yang versatile

### 2. Membuat Host Exclusive untuk 1 Brand

**Step by step:**
1. Buka User Management
2. Klik tombol Edit pada user host
3. Pastikan Role = "Host"
4. Centang **HANYA 1 brand** dari list
5. Klik "Update User"

**Result:**
- Host akan menampilkan badge `🎯 1 Brand`
- Host hanya bisa di-assign ke brand yang dipilih
- Cocok untuk host yang dedicated untuk 1 brand

### 3. Membuat Host Multi-Brand

**Step by step:**
1. Buka User Management
2. Klik tombol Edit pada user host
3. Pastikan Role = "Host"
4. Centang **BEBERAPA brand** dari list (misal 3 brand)
5. Klik "Update User"

**Result:**
- Host akan menampilkan badge `🎯 3 Brands`
- Host bisa di-assign ke salah satu dari 3 brand yang dipilih
- Cocok untuk host yang handle multiple brands

### 4. Mengubah Host dari Exclusive ke Flexible

**Step by step:**
1. Buka User Management
2. Klik tombol Edit pada user host yang exclusive
3. Klik link "Clear all to make flexible"
4. Klik "Update User"

**Result:**
- Semua brand tags akan dihapus
- Host berubah menjadi flexible
- Bisa bekerja dengan semua brand

### 5. Menambah/Mengurangi Brand untuk Host Exclusive

**Step by step:**
1. Buka User Management
2. Klik tombol Edit pada user host
3. Centang/uncentang brand yang diinginkan
4. Atau klik [x] di summary box untuk remove brand
5. Klik "Update User"

**Result:**
- Brand tags akan update sesuai selection
- Badge akan update jumlah brandnya

## Visual Indicators

### Badge Colors

| Type | Badge | Color | Meaning |
|------|-------|-------|---------|
| Flexible | 🌟 Flexible | Yellow (bg-[#fef3c7]) | Can work with all brands |
| Exclusive | 🎯 N Brands | Blue (bg-[#f0f5ff]) | Limited to specific brands |
| Admin | - | Gray | No brand access needed |

### Selection State

| State | Border | Background | Badge |
|-------|--------|------------|-------|
| Selected | Blue (border-[#2a6ef0]) | Light Blue (bg-[#f0f5ff]) | "Selected" |
| Not Selected | Gray (border-[#e5e7eb]) | White | None |
| Hover | Gray (border-[#d1d5dc]) | White | None |

## Integration dengan Room Assignment

Ketika admin melakukan room assignment:

### Untuk Host Flexible (brandTags: [])
```typescript
isHostBrandCompatible([], "brand:123") // ✅ true
isHostBrandCompatible([], "brand:456") // ✅ true
isHostBrandCompatible([], "any-brand") // ✅ true
```
→ Bisa di-assign ke brand apapun

### Untuk Host Exclusive (brandTags: ["brand:123", "brand:456"])
```typescript
isHostBrandCompatible(["brand:123", "brand:456"], "brand:123") // ✅ true
isHostBrandCompatible(["brand:123", "brand:456"], "brand:456") // ✅ true
isHostBrandCompatible(["brand:123", "brand:456"], "brand:789") // ❌ false
```
→ Hanya bisa di-assign ke brand:123 atau brand:456

## Error Handling

### Tidak Ada Brand di System
Jika belum ada brand yang dibuat, akan muncul:
```
┌─────────────────────────────────────────────┐
│            [Tag Icon - Grayed]              │
│         No brands available                 │
│    Create brands in Brand Management        │
└─────────────────────────────────────────────┘
```

**Solution:** Buat brand terlebih dahulu di Brand Management page

### Admin Role
Brand Access section hanya muncul untuk role **Host**, tidak untuk Admin.

## Best Practices

### 1. Default ke Flexible untuk Host Baru
- Saat create host baru, default brandTags adalah `[]` (flexible)
- Biarkan flexible dulu sampai ada kebutuhan exclusive
- Lebih mudah untuk assignment

### 2. Gunakan Exclusive untuk Dedicated Host
- Host yang fokus di 1 brand tertentu
- Brand yang butuh host dengan knowledge spesifik
- Mencegah confusion di assignment

### 3. Multi-Brand untuk Host Versatile
- Host yang handle beberapa related brands
- Misalnya: fashion brands (Brand A, Brand B, Brand C)
- Atau: tech brands (Brand X, Brand Y)

### 4. Periodic Review
- Review brand tags secara berkala
- Update jika ada perubahan responsibility host
- Remove brand tags yang sudah tidak aktif

## UI Components

### BrandTagsBadge (Display dalam Table)
```tsx
{isFlexible ? (
  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-[#fef3c7] text-[#f59e0b]">
    🌟 Flexible
  </span>
) : (
  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-[#f0f5ff] text-[#2a6ef0]">
    🎯 {brandTagCount} {brandTagCount === 1 ? 'Brand' : 'Brands'}
  </span>
)}
```

### BrandTagSelector (Edit Modal)
```tsx
<div className="space-y-2 max-h-48 overflow-y-auto border border-[#d1d5dc] rounded-lg p-3">
  {brands.map((brand) => (
    <label className={isSelected ? 'bg-[#f0f5ff] border-[#2a6ef0]' : 'bg-white border-[#e5e7eb]'}>
      <input type="checkbox" checked={isSelected} />
      <Tag /> {brand.name}
      {isSelected && <div>Selected</div>}
    </label>
  ))}
</div>
```

### SelectedBrandsPills (Summary)
```tsx
<div className="flex flex-wrap gap-2">
  {brandTags.map((brandId) => (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#2a6ef0] rounded-full text-xs text-[#2a6ef0]">
      <Tag /> {brandName}
      <button onClick={removeBrand}><X /></button>
    </span>
  ))}
</div>
```

## Accessibility

- ✅ Keyboard navigation untuk checkbox
- ✅ Focus ring untuk interactive elements
- ✅ Clear visual feedback untuk selection
- ✅ Descriptive labels dan text
- ✅ Color + Icon untuk status (tidak hanya warna)

## Mobile Responsive

- Scrollable brand list untuk screen kecil
- Pills wrap untuk selected brands
- Touch-friendly checkbox size (size-4)
- Readable text size (text-sm, text-xs)

## Data Flow

```
User Management Page
        ↓
    Edit User (Modal)
        ↓
    Select Brand Tags
        ↓
    userAPI.update({ brandTags: [...] })
        ↓
    Backend: PUT /users/:id
        ↓
    Update user_metadata.brandTags
        ↓
    Refresh Users List
        ↓
    Display Updated Badge
```

## Validation dalam Room Assignment

Saat admin assign room ke host:

1. **Backend Validation** (`/validate-room-assignment`):
   - Cek `isHostBrandCompatible(hostBrandTags, targetBrandId)`
   - Return error jika incompatible
   
2. **Frontend Filtering** (`/get-available-hosts`):
   - Filter host berdasarkan brand compatibility
   - Hanya tampilkan compatible hosts
   
3. **UI Feedback**:
   - Disable/hide incompatible hosts
   - Show tooltip kenapa host tidak available
