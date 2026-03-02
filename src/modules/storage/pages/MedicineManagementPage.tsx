import { useState, useMemo } from "react"
import {
  FlaskConicalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebounce } from "@/hooks/useDebounce"
import { useMedicines, useCreateMedicine, useUpdateMedicine, useDeleteMedicine, useMedicineRoomSnapshots } from "../hooks/useMedicines"
import type { Medicine } from "../types/medicine.types"
import {
  PageHeader,
  RowActions,
  DeleteConfirmDialog,
  SkeletonRows,
  EmptyRow,
  MedicineFormFields,
} from "../components"


export function MedicineManagementPage() {
  const [search, setSearch] = useState("")
  const [filterRoomId, setFilterRoomId] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Medicine | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null)

  // Form state (shared between create & edit)
  const [code, setCode] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [nameTh, setNameTh] = useState("")
  const [methodEn, setMethodEn] = useState("")
  const [methodTh, setMethodTh] = useState("")
  const [note, setNote] = useState("")
  const [roomId, setRoomId] = useState("")

  const debouncedSearch = useDebounce(search)
  const { data, isLoading, isError } = useMedicines(
    debouncedSearch ? { medicineCode: debouncedSearch } : { limit: 100 },
  )

  const { data: roomsData } = useMedicineRoomSnapshots({ limit: 100 })
  const createMedicine = useCreateMedicine()
  const updateMedicine = useUpdateMedicine()
  const deleteMedicine = useDeleteMedicine()

  const rooms = roomsData?.data ?? []
  const roomMap = useMemo(
    () => Object.fromEntries(rooms.map((r) => [r.roomId, r.roomName])),
    [rooms],
  )
  
  const roomsForForm = useMemo(
    () => rooms.map((r) => ({ id: r.roomId, name: r.roomName })),
    [rooms],
  )

  const allRows = data?.data ?? []
  const rows = useMemo(
    () => filterRoomId ? allRows.filter((m) => m.roomId === filterRoomId) : allRows,
    [allRows, filterRoomId],
  )

  function resetForm() {
    setCode(""); setNameEn(""); setNameTh("")
    setMethodEn(""); setMethodTh(""); setNote(""); setRoomId("")
  }

  function handleCreate() {
    if (!code.trim()) return
    createMedicine.mutate(
      {
        medicineCode: code.trim(),
        medicineName_en: nameEn.trim() || undefined,
        medicineName_th: nameTh.trim() || undefined,
        medicineMethod_en: methodEn.trim() || undefined,
        medicineMethod_th: methodTh.trim() || undefined,
        medicineNote: note.trim() || undefined,
        roomId: roomId || undefined,
      },
      { onSuccess: () => { setCreateOpen(false); resetForm() } },
    )
  }

  function openEdit(m: Medicine) {
    setEditTarget(m)
    setCode(m.medicineCode)
    setNameEn(m.medicineName_en ?? "")
    setNameTh(m.medicineName_th ?? "")
    setMethodEn(m.medicineMethod_en ?? "")
    setMethodTh(m.medicineMethod_th ?? "")
    setNote(m.medicineNote ?? "")
    setRoomId(m.roomId ?? "")
  }

  function handleEdit() {
    if (!editTarget) return
    updateMedicine.mutate(
      {
        id: editTarget.id,
        payload: {
          medicineName_en: nameEn.trim() || undefined,
          medicineName_th: nameTh.trim() || undefined,
          medicineMethod_en: methodEn.trim() || undefined,
          medicineMethod_th: methodTh.trim() || undefined,
          medicineNote: note.trim() || undefined,
          roomId: roomId || undefined,
        },
      },
      { onSuccess: () => { setEditTarget(null); resetForm() } },
    )
  }

  const formProps = { code, setCode, nameEn, setNameEn, nameTh, setNameTh, methodEn, setMethodEn, methodTh, setMethodTh, note, setNote, roomId, setRoomId, rooms: roomsForForm }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        backTo="/app/storage"
        icon={<FlaskConicalIcon className="size-5 text-blue-500" strokeWidth={1.5} />}
        title="Medicine Management"
        subtitle="Add and manage medicines in the product catalogue."
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by medicine code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Room filter */}
        <Select value={filterRoomId || "__all__"} onValueChange={(v) => setFilterRoomId(v === "__all__" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All rooms</SelectItem>
            {rooms.map((r) => (
              <SelectItem key={r.roomId} value={r.roomId}>{r.roomName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true) }}>
          <PlusIcon className="size-3.5" />
          Add Medicine
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <p className="text-sm text-destructive">Failed to load medicines. Check that the product service is running.</p>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Name (TH)</TableHead>
            <TableHead>Room</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows cols={4} rows={5} />
          ) : rows.length === 0 ? (
            <EmptyRow cols={4} label="medicines" />
          ) : (
            rows.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-sm font-medium">{m.medicineCode}</TableCell>
                <TableCell>{m.medicineName_en ?? "—"}</TableCell>
                <TableCell>{m.medicineName_th ?? "—"}</TableCell>
                <TableCell className="text-sm">
                  {m.roomId
                    ? (roomMap[m.roomId] ?? <span className="font-mono text-xs text-muted-foreground">{m.roomId}</span>)
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <RowActions onEdit={() => openEdit(m)} onDelete={() => setDeleteTarget(m)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Medicine</DialogTitle></DialogHeader>
          <MedicineFormFields {...formProps} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm() }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!code.trim() || createMedicine.isPending}>
              {createMedicine.isPending ? "Adding…" : "Add Medicine"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm() } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Medicine</DialogTitle></DialogHeader>
          <MedicineFormFields {...formProps} disableCode />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm() }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMedicine.isPending}>
              {updateMedicine.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Medicine"
        description={<>Delete <strong>{deleteTarget?.medicineCode}</strong>{deleteTarget?.medicineName_en ? ` (${deleteTarget.medicineName_en})` : ""}? This action cannot be undone.</>}
        onConfirm={() => { if (deleteTarget) deleteMedicine.mutate(deleteTarget.id); setDeleteTarget(null) }}
      />
    </div>
  )
}
