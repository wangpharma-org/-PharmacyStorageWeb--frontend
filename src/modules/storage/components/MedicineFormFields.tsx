import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MedicineFormProps {
  code: string; setCode: (v: string) => void
  nameEn: string; setNameEn: (v: string) => void
  nameTh: string; setNameTh: (v: string) => void
  methodEn: string; setMethodEn: (v: string) => void
  methodTh: string; setMethodTh: (v: string) => void
  note: string; setNote: (v: string) => void
  roomId: string; setRoomId: (v: string) => void
  rooms: { id: string; name: string }[]
  disableCode?: boolean
}

export function MedicineFormFields({
  code, setCode, nameEn, setNameEn, nameTh, setNameTh,
  methodEn, setMethodEn, methodTh, setMethodTh,
  note, setNote, roomId, setRoomId, rooms, disableCode,
}: MedicineFormProps) {
  return (
    <div className="space-y-3 py-2">
      <Input
        placeholder="Medicine Code * (e.g. MED-001)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={disableCode}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Name (English)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <Input placeholder="Name (Thai)" value={nameTh} onChange={(e) => setNameTh(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Method (English)" value={methodEn} onChange={(e) => setMethodEn(e.target.value)} />
        <Input placeholder="Method (Thai)" value={methodTh} onChange={(e) => setMethodTh(e.target.value)} />
      </div>
      <Input placeholder="Notes (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Select value={roomId || "__none__"} onValueChange={(v) => setRoomId(v === "__none__" ? "" : v)}>
        <SelectTrigger>
          <SelectValue placeholder="Assign to room (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">— No room —</SelectItem>
          {rooms.map((r) => (
            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
