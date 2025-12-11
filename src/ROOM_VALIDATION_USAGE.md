# Room Validation System - Usage Guide

Panduan lengkap cara menggunakan sistem validasi room assignment dengan auto-disable jam yang sudah dibooking.

## Fitur Utama

### 1. **Smart Host Filtering**
- Otomatis filter host berdasarkan brand compatibility
- Tampilkan hanya host yang:
  - Punya brand tag yang sesuai (exclusive host)
  - ATAU tidak punya brand tag (flexible host)
  - DAN punya availability di tanggal yang dipilih

### 2. **Auto-Disable Booked Slots**
- Jam yang sudah dibooking di room tersebut otomatis disabled
- Visual indicator (✕) untuk slot yang tidak available
- Warning message menampilkan jam-jam yang sudah terisi

### 3. **Real-time Validation**
- Validasi 3-layer sebelum submit:
  1. Brand compatibility check
  2. Room time slot availability
  3. Host schedule availability
- Error message yang jelas dan actionable

## Cara Penggunaan

### Skenario 1: Booking Room 1 untuk Brand Lezza Indonesia

**Step 1: Buka Assign Host Modal**
```
Click "Assign Host" button
```

**Step 2: Pilih Room dan Date**
```
Room: Room 1
Date: 12 Desember 2024
```
→ System akan fetch room availability untuk tanggal tersebut

**Step 3: Pilih Brand**
```
Brand: Lezza Indonesia
```
→ System akan fetch available hosts yang:
- Punya tag `brand:lezza` (exclusive)
- ATAU tidak punya tag sama sekali (flexible)

**Step 4: Pilih Host**
```
Dropdown akan menampilkan:
- John Doe - 🌟 Flexible (8 slots)
- Jane Smith - 🎯 1 brand(s) (6 slots)
```
→ Pilih salah satu host

**Step 5: Pilih Time Slots**
```
Available slots muncul (jam yang available untuk host tersebut)
Pilih: 08:00, 09:00, 10:00, 11:00 (4 sesi)
```
→ Semua slot available (belum ada booking di room ini)

**Step 6: Submit**
```
Click "Assign Host"
→ System validasi otomatis
→ Assignment berhasil dibuat ✅
```

### Skenario 2: Booking Room 1 Lagi untuk Brand Lain di Tanggal Yang Sama

**Step 1-2: Pilih Room dan Date (sama seperti sebelumnya)**
```
Room: Room 1
Date: 12 Desember 2024
```
→ System detect ada booking sebelumnya

**Warning muncul:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ 4 slot(s) already booked in this room   │
│ [08:00 ✕] [09:00 ✕] [10:00 ✕] [11:00 ✕]  │
└─────────────────────────────────────────────┘
```

**Step 3: Pilih Brand Lain**
```
Brand: Brand ABC
```
→ System fetch host yang compatible dengan Brand ABC

**Step 4: Pilih Host**
```
Dropdown menampilkan:
- Sarah Lee - 🌟 Flexible (10 slots)
- Mike Chen - 🎯 2 brand(s) (7 slots)
```

**Step 5: Pilih Time Slots**
```
Time slots yang muncul:
- 08:00 ✕ (DISABLED - already booked)
- 09:00 ✕ (DISABLED - already booked)
- 10:00 ✕ (DISABLED - already booked)
- 11:00 ✕ (DISABLED - already booked)
- 12:00 ✓ (AVAILABLE)
- 13:00 ✓ (AVAILABLE)
- 14:00 ✓ (AVAILABLE)
- 15:00 ✓ (AVAILABLE)
```

**Pilih jam yang available:**
```
Select: 12:00, 13:00, 14:00, 15:00
```

**Step 6: Submit**
```
Click "Assign Host"
→ System validasi
→ Assignment berhasil ✅
```

**Result:**
Room 1 di tanggal 12 Desember sekarang punya 2 assignments:
1. **08:00-11:00**: Brand Lezza Indonesia - John Doe
2. **12:00-15:00**: Brand ABC - Sarah Lee

## UI Elements Explained

### Host Dropdown
```
┌────────────────────────────────────────────────┐
│ Select Host         ✓ 3 host(s) compatible    │
│ ┌──────────────────────────────────────────┐  │
│ │ Choose a host...                         │  │
│ │ John Doe - 🌟 Flexible (8 slots)        │  │
│ │ Jane Smith - 🎯 1 brand(s) (6 slots)    │  │
│ │ Mike Chen - 🎯 2 brand(s) (7 slots)     │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Indicators:**
- `🌟 Flexible` = Host tanpa brand tags (bisa semua brand)
- `🎯 N brand(s)` = Host exclusive untuk N brand
- `(X slots)` = Jumlah time slots yang available untuk host

### Time Slots Grid

**Normal State (All Available):**
```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ 08:00│ 09:00│ 10:00│ 11:00│ 12:00│ 13:00│
└──────┴──────┴──────┴──────┴──────┴──────┘
  ✓      ✓      ✓      ✓      ✓      ✓
```

**With Occupied Slots:**
```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│08:00✕│09:00✕│10:00✕│11:00✕│ 12:00│ 13:00│
└──────┴──────┴──────┴──────┴──────┴──────┘
 Booked Booked Booked Booked   ✓      ✓
(Disabled & Grayed)         (Available)
```

**Legend:**
- `✓ Available` = Hijau, bisa diklik
- `✕ Booked` = Merah, disabled, tidak bisa diklik
- Badge `✕` di corner = Visual indicator untuk booked slot

### Warning Box
```
┌─────────────────────────────────────────────┐
│ ⚠️ 4 slot(s) already booked in this room   │
│ on this date                                │
│                                             │
│ [08:00 ✕] [09:00 ✕] [10:00 ✕] [11:00 ✕]  │
└─────────────────────────────────────────────┘
```

### Validation States

**Validating:**
```
┌──────────────────────┐
│  ⏳ Validating...   │
└──────────────────────┘
(Button disabled, spinner showing)
```

**Validation Success:**
```
✅ Host assigned successfully!
```

**Validation Error:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Room time slots not available           │
│ The following time slots are already       │
│ assigned: 08:00, 09:00                     │
└─────────────────────────────────────────────┘
```

## Validation Flow

```
User selects Room + Date
        ↓
System fetches room availability
        ↓
Display occupied slots warning (if any)
        ↓
User selects Brand
        ↓
System fetches compatible hosts
        ↓
Filter: brand tags + availability
        ↓
Display filtered hosts
        ↓
User selects Host
        ↓
Display available time slots
        ↓
Auto-disable occupied slots
        ↓
User selects time slots (only available ones)
        ↓
User clicks "Assign Host"
        ↓
System validates:
  1. Brand compatibility ✓
  2. Room availability ✓
  3. Host availability ✓
        ↓
If valid → Create assignment ✅
If invalid → Show error ❌
```

## Error Handling

### Error 1: Brand Incompatible
```
⚠️ Host tidak kompatibel dengan brand ini.
Host's allowed brands: brand:123, brand:456
```
**Solution:** Pilih host lain yang compatible

### Error 2: Room Slot Occupied
```
⚠️ Jam sudah terisi: 08:00, 09:00
```
**Solution:** Pilih jam lain yang available (sudah otomatis disabled di UI)

### Error 3: Host Not Available
```
⚠️ Host tidak tersedia.
Host is only available at: 13:00, 14:00, 15:00
```
**Solution:** Pilih jam yang sesuai dengan availability host

### Error 4: No Compatible Hosts
```
┌─────────────────────────────────────────────┐
│ ⚠️ No hosts available for this brand on    │
│ this date                                   │
└─────────────────────────────────────────────┘
```
**Solution:**
- Pilih brand lain
- Pilih tanggal lain
- Atau wait for hosts to submit their availability

## Best Practices

### 1. Selalu Pilih Room dan Date Terlebih Dahulu
- Ini akan trigger fetch room availability
- Occupied slots akan langsung terlihat
- Prevent double booking

### 2. Perhatikan Warning Message
- Warning box muncul jika ada jam yang sudah terisi
- Lihat jam mana saja yang tidak available
- Plan assignment dengan jam yang tersedia

### 3. Pilih Host Berdasarkan Brand Compatibility
- System sudah filter otomatis
- Hanya tampilkan host yang compatible
- Flexible host (🌟) bisa untuk semua brand
- Exclusive host (🎯) hanya untuk brand tertentu

### 4. Perhatikan Jumlah Slots Available
- Dropdown menampilkan jumlah slots per host
- Pilih host dengan cukup slots untuk kebutuhan
- Example: `(8 slots)` berarti host punya 8 jam available

### 5. Validasi Sebelum Submit
- System akan auto-validate
- Tapi pastikan:
  - Minimal 1 time slot terpilih
  - Tidak ada slot yang disabled terpilih
  - Host compatible dengan brand

## Technical Details

### API Calls Sequence

**On Room + Date Select:**
```javascript
GET /room-availability/:roomId/:date
→ Returns occupied slots for the room
```

**On Brand + Date Select:**
```javascript
POST /get-available-hosts
Body: { brandId, date, timeSlots: [] }
→ Returns filtered compatible hosts
```

**On Submit:**
```javascript
POST /validate-room-assignment
Body: { roomId, date, brandId, hostId, timeSlots }
→ Validates 3-layer check
→ If valid, proceed to create assignment
```

### State Management

```javascript
// Room availability state
const [roomOccupiedSlots, setRoomOccupiedSlots] = useState<string[]>([]);
const [roomAvailabilityData, setRoomAvailabilityData] = useState<RoomTimeSlot[]>([]);

// Filtered hosts state
const [availableHosts, setAvailableHosts] = useState<HostData[]>([]);

// Validation state
const [validating, setValidating] = useState(false);
const [validationError, setValidationError] = useState<string | null>(null);
```

### Helper Functions

```javascript
// Check if slot is occupied in room
isTimeSlotOccupied(timeSlot: string): boolean

// Check if slot is in the past
isTimeSlotPast(timeSlot: string): boolean

// Fetch room availability
fetchRoomAvailability(): Promise<void>

// Fetch compatible hosts
fetchAvailableHostsForBrand(): Promise<void>
```

## Mobile Responsive

- Time slots grid responsive (3 cols on mobile, 6 on desktop)
- Warning messages stack nicely
- Modal scrollable on small screens
- Touch-friendly slot buttons
