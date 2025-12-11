# Room Availability Validation System

Sistem validasi room availability dengan mekanisme matching otomatis antara room slots, host schedule, dan brand compatibility.

## Fitur Utama

### 1. **Brand Compatibility System**
- Setiap host dapat memiliki brand tags (array of brand IDs)
- **Host Fleksibel**: Jika host tidak memiliki brand tags (array kosong), mereka bisa bekerja dengan semua brand
- **Host Eksklusif**: Jika host memiliki brand tags, mereka hanya bisa bekerja dengan brand yang ada di tag list mereka
- **Brand Fleksibel**: Brand dapat memiliki banyak host
- **Brand Eksklusif**: Brand dapat memiliki 1 host eksklusif (dengan hanya 1 host yang memiliki brand tag tersebut)

### 2. **Time Slot Matching**
- Room kosong akan dicocokkan dengan jadwal host yang available di waktu yang sama
- Validasi otomatis untuk memastikan tidak ada konflik waktu
- Real-time checking untuk slot yang sudah terisi

### 3. **Host Availability Validation**
- Host harus sudah submit schedule availability terlebih dahulu
- Semua time slots yang di-request harus ada dalam schedule host
- Validasi otomatis mencegah double booking

## Backend Endpoints

### 1. Validate Room Assignment
**POST** `/make-server-df75f45f/validate-room-assignment`

Memvalidasi assignment sebelum dibuat dengan 3 layer validasi:
- Brand compatibility
- Room time slot availability  
- Host schedule availability

```typescript
// Request
{
  roomId: string;
  date: string;      // YYYY-MM-DD
  brandId: string;
  hostId: string;
  timeSlots: string[]; // ['09:00', '10:00', '11:00']
}

// Response (Success)
{
  valid: true,
  message: "Room assignment is valid",
  validation: {
    brandCompatible: true,
    roomSlotsAvailable: true,
    hostAvailable: true
  }
}

// Response (Error - Brand Incompatible)
{
  valid: false,
  error: "Brand compatibility failed",
  reason: "Host is not authorized for this brand. Host's allowed brands: brand:123, brand:456",
  code: "BRAND_INCOMPATIBLE"
}

// Response (Error - Room Occupied)
{
  valid: false,
  error: "Room time slots not available",
  reason: "The following time slots are already assigned: 09:00, 10:00",
  unavailableSlots: ["09:00", "10:00"],
  code: "ROOM_SLOT_OCCUPIED"
}

// Response (Error - Host Not Available)
{
  valid: false,
  error: "Host not available for requested time slots",
  reason: "Host is only available at: 13:00, 14:00, 15:00",
  hostAvailableSlots: ["13:00", "14:00", "15:00"],
  code: "HOST_NOT_AVAILABLE"
}
```

### 2. Get Available Hosts
**POST** `/make-server-df75f45f/get-available-hosts`

Mendapatkan daftar host yang tersedia berdasarkan brand, date, dan time slots.

```typescript
// Request
{
  roomId?: string;    // Optional
  date: string;       // YYYY-MM-DD
  brandId: string;
  timeSlots: string[]; // ['09:00', '10:00']
}

// Response
{
  hosts: [
    {
      id: "user-id-123",
      email: "host@example.com",
      name: "John Doe",
      brandTags: ["brand:123", "brand:456"], // Empty array = flexible
      availableSlots: ["09:00", "10:00", "11:00", "12:00"],
      matchingSlots: ["09:00", "10:00"] // Slots yang match dengan request
    }
  ],
  totalAvailable: 1
}
```

### 3. Get Room Availability
**GET** `/make-server-df75f45f/room-availability/:roomId/:date`

Mendapatkan status availability room untuk tanggal tertentu.

```typescript
// Response
{
  roomId: "room:123",
  date: "2024-12-15",
  availability: [
    {
      time: "09:00",
      available: false,
      assignment: {
        hostId: "user-id-123",
        hostName: "John Doe",
        brandId: "brand:123",
        brandName: "Brand A",
        assignmentId: "assignment:123"
      }
    },
    {
      time: "10:00",
      available: true,
      assignment: null
    }
  ],
  totalSlots: 14,
  occupiedSlots: 5,
  availableSlots: 9
}
```

## Frontend Usage

### Import Utilities

```typescript
import {
  validateRoomAssignment,
  getAvailableHosts,
  getRoomAvailability,
  isHostBrandCompatible,
  formatValidationError,
  COMMON_TIME_SLOTS,
} from './utils/roomValidation';
```

### Example 1: Validate Before Creating Assignment

```typescript
const handleCreateAssignment = async () => {
  // Validate first
  const validation = await validateRoomAssignment(accessToken, {
    roomId: selectedRoom,
    date: selectedDate,
    brandId: selectedBrand,
    hostId: selectedHost,
    timeSlots: selectedTimeSlots,
  });

  if (!validation.valid) {
    alert(formatValidationError(validation));
    return;
  }

  // Validation passed, create assignment
  await createRoomAssignment({...});
};
```

### Example 2: Get Available Hosts for Brand

```typescript
const fetchAvailableHosts = async () => {
  const { hosts, totalAvailable } = await getAvailableHosts(accessToken, {
    date: '2024-12-15',
    brandId: 'brand:123',
    timeSlots: ['09:00', '10:00', '11:00'],
  });

  console.log(`Found ${totalAvailable} available hosts`);
  
  hosts.forEach(host => {
    console.log(`${host.name} - Available at: ${host.matchingSlots.join(', ')}`);
  });
};
```

### Example 3: Show Room Availability Calendar

```typescript
const showRoomAvailability = async () => {
  const availability = await getRoomAvailability(
    accessToken,
    'room:123',
    '2024-12-15'
  );

  if (availability) {
    console.log(`${availability.availableSlots} of ${availability.totalSlots} slots available`);
    
    availability.availability.forEach(slot => {
      if (slot.available) {
        console.log(`${slot.time} - Available`);
      } else {
        console.log(`${slot.time} - Occupied by ${slot.assignment?.hostName}`);
      }
    });
  }
};
```

### Example 4: Client-side Brand Check

```typescript
const checkHostBrandCompatibility = (host: any, brandId: string) => {
  const isCompatible = isHostBrandCompatible(host.brandTags, brandId);
  
  if (!isCompatible) {
    console.log('Host tidak bisa bekerja dengan brand ini');
    console.log('Allowed brands:', host.brandTags.join(', '));
  }
  
  return isCompatible;
};
```

## Data Model

### Host User Metadata
```typescript
{
  name: string;
  role: 'host' | 'admin';
  brandTags: string[]; // ['brand:123', 'brand:456'] or []
}
```

### Schedule (Host Availability)
```typescript
{
  id: string;
  hostId: string;
  hostName: string;
  date: string;        // YYYY-MM-DD
  timeSlots: string[]; // ['09:00', '10:00', '11:00']
  createdAt: string;
}
```

### Room Assignment
```typescript
{
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  brandId: string;
  brandName: string;
  hostId: string;
  hostName: string;
  timeSlots: string[];
  createdAt: string;
  createdBy: string;
}
```

## Brand Tag Examples

### Flexible Host (Dapat bekerja dengan semua brand)
```typescript
{
  id: "user-123",
  name: "John Doe",
  brandTags: [] // Empty = flexible
}
```

### Exclusive Host (Hanya untuk brand tertentu)
```typescript
{
  id: "user-456",
  name: "Jane Smith",
  brandTags: ["brand:123"] // Hanya bisa brand:123
}
```

### Multi-Brand Host
```typescript
{
  id: "user-789",
  name: "Bob Wilson",
  brandTags: ["brand:123", "brand:456", "brand:789"] // Bisa 3 brand
}
```

## Validation Flow

1. **Admin memilih Room** → System cek available time slots
2. **Admin memilih Brand** → System filter host yang kompatibel dengan brand
3. **Admin memilih Date** → System cek host schedules untuk tanggal tersebut
4. **Admin memilih Time Slots** → System validasi 3 layer:
   - ✅ Brand compatibility
   - ✅ Room slots availability
   - ✅ Host schedule availability
5. **Jika semua validasi pass** → Assignment dapat dibuat
6. **Jika ada yang gagal** → System berikan error message yang jelas

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `BRAND_INCOMPATIBLE` | Host tidak kompatibel dengan brand | Pilih host lain atau update host brand tags |
| `ROOM_SLOT_OCCUPIED` | Jam di room sudah terisi | Pilih jam lain atau room lain |
| `HOST_NOT_AVAILABLE` | Host tidak available di jam tersebut | Pilih jam yang sesuai schedule host |
| `VALIDATION_ERROR` | Error sistem | Coba lagi atau hubungi admin |

## Best Practices

1. **Selalu validasi sebelum create assignment**
   - Gunakan `validateRoomAssignment()` sebelum submit
   - Tampilkan error message yang jelas ke user

2. **Filter host berdasarkan brand**
   - Gunakan `getAvailableHosts()` untuk mendapat list host yang valid
   - Jangan tampilkan host yang tidak kompatibel

3. **Tampilkan room availability**
   - Gunakan `getRoomAvailability()` untuk visualisasi calendar
   - Highlight slot yang sudah terisi

4. **Update brand tags dengan hati-hati**
   - Brand tags menentukan akses host ke brand
   - Empty array = flexible, terisi = restricted

5. **Handle validation errors dengan baik**
   - Gunakan `formatValidationError()` untuk user-friendly message
   - Berikan suggestion untuk fix masalah
