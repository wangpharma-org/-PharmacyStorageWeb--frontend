import { useState } from "react"
import { PlusIcon, WarehouseIcon } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader, RowActions, DeleteConfirmDialog, SkeletonRows, EmptyRow } from "../components"
import {
  useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom,
  useZones, useCreateZone, useUpdateZone, useDeleteZone,
  useRacks, useCreateRack, useUpdateRack, useDeleteRack,
  useShelves, useCreateShelf, useUpdateShelf, useDeleteShelf,
} from "../hooks/useStock"
import type {
  Room, Zone, Rack, Shelf,
} from "../types/stock.types"


// ─── Rooms tab ────────────────────────────────────────────────────
function RoomsTab() {
  const { data, isLoading } = useRooms({ limit: 100 })
  const createRoom = useCreateRoom()
  const updateRoom = useUpdateRoom()
  const deleteRoom = useDeleteRoom()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Room | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  function handleCreate() {
    if (!name.trim()) return
    createRoom.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      { onSuccess: () => { setCreateOpen(false); setName(""); setDescription("") } },
    )
  }

  function openEdit(r: Room) {
    setEditTarget(r)
    setName(r.name)
    setDescription(r.description ?? "")
  }

  function handleEdit() {
    if (!editTarget || !name.trim()) return
    updateRoom.mutate(
      { id: editTarget.id, payload: { name: name.trim(), description: description.trim() || undefined } },
      { onSuccess: () => { setEditTarget(null); setName(""); setDescription("") } },
    )
  }

  const rows = data?.data ?? []

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">{rows.length} room(s)</p>
        <Button size="sm" onClick={() => { setName(""); setDescription(""); setCreateOpen(true) }}>
          <PlusIcon className="size-3.5" />
          New Room
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <SkeletonRows cols={2} /> : rows.length === 0
            ? <EmptyRow cols={2} label="rooms" />
            : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.description ?? "—"}</TableCell>
                <TableCell>
                  <RowActions onEdit={() => openEdit(r)} onDelete={() => setDeleteTarget(r)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Room</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Room name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createRoom.isPending}>
              {createRoom.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Room</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Room name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!name.trim() || updateRoom.isPending}>
              {updateRoom.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Room"
        description={<>Delete <strong>{deleteTarget?.name}</strong>? This will also remove all zones, racks, and shelves inside it.</>}
        onConfirm={() => { if (deleteTarget) deleteRoom.mutate(deleteTarget.id); setDeleteTarget(null) }}
      />
    </>
  )
}

// ─── Zones tab ────────────────────────────────────────────────────
function ZonesTab() {
  const { data, isLoading } = useZones({ limit: 100 })
  const { data: roomsData } = useRooms({ limit: 100 })
  const createZone = useCreateZone()
  const updateZone = useUpdateZone()
  const deleteZone = useDeleteZone()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Zone | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [roomId, setRoomId] = useState("")

  const rooms = roomsData?.data ?? []
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.name]))

  function handleCreate() {
    if (!name.trim() || !roomId) return
    createZone.mutate(
      { name: name.trim(), description: description.trim() || undefined, roomId },
      { onSuccess: () => { setCreateOpen(false); setName(""); setDescription(""); setRoomId("") } },
    )
  }

  function openEdit(z: Zone) {
    setEditTarget(z)
    setName(z.name)
    setDescription(z.description ?? "")
    setRoomId(z.roomId)
  }

  function handleEdit() {
    if (!editTarget || !name.trim() || !roomId) return
    updateZone.mutate(
      { id: editTarget.id, payload: { name: name.trim(), description: description.trim() || undefined, roomId } },
      { onSuccess: () => { setEditTarget(null); setName(""); setDescription(""); setRoomId("") } },
    )
  }

  const rows = data?.data ?? []

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">{rows.length} zone(s)</p>
        <Button size="sm" onClick={() => { setName(""); setDescription(""); setRoomId(""); setCreateOpen(true) }}>
          <PlusIcon className="size-3.5" />
          New Zone
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Room</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <SkeletonRows cols={3} /> : rows.length === 0
            ? <EmptyRow cols={3} label="zones" />
            : rows.map((z) => (
              <TableRow key={z.id}>
                <TableCell className="font-medium">{z.name}</TableCell>
                <TableCell className="text-muted-foreground">{z.description ?? "—"}</TableCell>
                <TableCell className="text-sm">{roomMap[z.roomId] ?? <span className="font-mono text-xs text-muted-foreground">{z.roomId}</span>}</TableCell>
                <TableCell>
                  <RowActions onEdit={() => openEdit(z)} onDelete={() => setDeleteTarget(z)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Zone</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Zone name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger><SelectValue placeholder="Select room *" /></SelectTrigger>
              <SelectContent>{rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !roomId || createZone.isPending}>
              {createZone.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Zone</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Zone name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger><SelectValue placeholder="Select room *" /></SelectTrigger>
              <SelectContent>{rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!name.trim() || !roomId || updateZone.isPending}>
              {updateZone.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Zone"
        description={<>Delete <strong>{deleteTarget?.name}</strong>?</>}
        onConfirm={() => { if (deleteTarget) deleteZone.mutate(deleteTarget.id); setDeleteTarget(null) }}
      />
    </>
  )
}

// ─── Racks tab ────────────────────────────────────────────────────
function RacksTab() {
  const { data, isLoading } = useRacks({ limit: 100 })
  const { data: zonesData } = useZones({ limit: 100 })
  const createRack = useCreateRack()
  const updateRack = useUpdateRack()
  const deleteRack = useDeleteRack()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Rack | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Rack | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [zoneId, setZoneId] = useState("")

  const zones = zonesData?.data ?? []
  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.name]))

  function handleCreate() {
    if (!name.trim() || !zoneId) return
    createRack.mutate(
      { name: name.trim(), description: description.trim() || undefined, zoneId },
      { onSuccess: () => { setCreateOpen(false); setName(""); setDescription(""); setZoneId("") } },
    )
  }

  function openEdit(r: Rack) {
    setEditTarget(r)
    setName(r.name)
    setDescription(r.description ?? "")
    setZoneId(r.zoneId)
  }

  function handleEdit() {
    if (!editTarget || !name.trim() || !zoneId) return
    updateRack.mutate(
      { id: editTarget.id, payload: { name: name.trim(), description: description.trim() || undefined, zoneId } },
      { onSuccess: () => { setEditTarget(null); setName(""); setDescription(""); setZoneId("") } },
    )
  }

  const rows = data?.data ?? []

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">{rows.length} rack(s)</p>
        <Button size="sm" onClick={() => { setName(""); setDescription(""); setZoneId(""); setCreateOpen(true) }}>
          <PlusIcon className="size-3.5" />
          New Rack
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <SkeletonRows cols={3} /> : rows.length === 0
            ? <EmptyRow cols={3} label="racks" />
            : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.description ?? "—"}</TableCell>
                <TableCell className="text-sm">{zoneMap[r.zoneId] ?? <span className="font-mono text-xs text-muted-foreground">{r.zoneId}</span>}</TableCell>
                <TableCell>
                  <RowActions onEdit={() => openEdit(r)} onDelete={() => setDeleteTarget(r)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Rack</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Rack name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger><SelectValue placeholder="Select zone *" /></SelectTrigger>
              <SelectContent>{zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !zoneId || createRack.isPending}>
              {createRack.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Rack</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Rack name *" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger><SelectValue placeholder="Select zone *" /></SelectTrigger>
              <SelectContent>{zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!name.trim() || !zoneId || updateRack.isPending}>
              {updateRack.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Rack"
        description={<>Delete <strong>{deleteTarget?.name}</strong>?</>}
        onConfirm={() => { if (deleteTarget) deleteRack.mutate(deleteTarget.id); setDeleteTarget(null) }}
      />
    </>
  )
}

// ─── Shelves tab ──────────────────────────────────────────────────
function ShelvesTab() {
  const { data, isLoading } = useShelves({ limit: 100 })
  const { data: racksData } = useRacks({ limit: 100 })
  const createShelf = useCreateShelf()
  const updateShelf = useUpdateShelf()
  const deleteShelf = useDeleteShelf()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Shelf | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Shelf | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rackId, setRackId] = useState("")
  const [medicineCode, setMedicineCode] = useState("")
  const [capacity, setCapacity] = useState("")
  const [quantity, setQuantity] = useState("0")

  const racks = racksData?.data ?? []
  const rackMap = Object.fromEntries(racks.map((r) => [r.id, r.name]))

  function resetForm() {
    setName(""); setDescription(""); setRackId("")
    setMedicineCode(""); setCapacity(""); setQuantity("0")
  }

  function handleCreate() {
    if (!name.trim() || !rackId) return
    createShelf.mutate(
      {
        name: name.trim(), description: description.trim() || undefined, rackId,
        medicineCode: medicineCode.trim() || undefined,
        capacity: capacity ? Number(capacity) : undefined,
        quantity: Number(quantity),
      },
      { onSuccess: () => { setCreateOpen(false); resetForm() } },
    )
  }

  function openEdit(s: Shelf) {
    setEditTarget(s)
    setName(s.name)
    setDescription(s.description ?? "")
    setRackId(s.rackId)
    setMedicineCode(s.medicineCode ?? "")
    setCapacity(s.capacity !== null ? String(s.capacity) : "")
    setQuantity(String(s.quantity))
  }

  function handleEdit() {
    if (!editTarget || !name.trim() || !rackId) return
    updateShelf.mutate(
      {
        id: editTarget.id,
        payload: {
          name: name.trim(), description: description.trim() || undefined, rackId,
          medicineCode: medicineCode.trim() || undefined,
          capacity: capacity ? Number(capacity) : undefined,
          quantity: Number(quantity),
        },
      },
      { onSuccess: () => { setEditTarget(null); resetForm() } },
    )
  }

  const rows = data?.data ?? []

  const shelfFormFields = (
    <div className="space-y-3 py-2">
      <Input placeholder="Shelf name *" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Select value={rackId} onValueChange={setRackId}>
        <SelectTrigger><SelectValue placeholder="Select rack *" /></SelectTrigger>
        <SelectContent>{racks.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
      </Select>
      <Input placeholder="Medicine code (optional)" value={medicineCode} onChange={(e) => setMedicineCode(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input type="number" placeholder="Capacity" min={0} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <Input type="number" placeholder="Quantity" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
    </div>
  )

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p className="text-sm text-muted-foreground">{rows.length} shelf(ves)</p>
        <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true) }}>
          <PlusIcon className="size-3.5" />
          New Shelf
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Medicine Code</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Rack</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <SkeletonRows cols={5} /> : rows.length === 0
            ? <EmptyRow cols={5} label="shelves" />
            : rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="font-mono text-xs">{s.medicineCode ?? "—"}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>{s.capacity ?? "—"}</TableCell>
                <TableCell className="text-sm">{rackMap[s.rackId] ?? <span className="font-mono text-xs text-muted-foreground">{s.rackId}</span>}</TableCell>
                <TableCell>
                  <RowActions onEdit={() => openEdit(s)} onDelete={() => setDeleteTarget(s)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Shelf</DialogTitle></DialogHeader>
          {shelfFormFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !rackId || createShelf.isPending}>
              {createShelf.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Shelf</DialogTitle></DialogHeader>
          {shelfFormFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!name.trim() || !rackId || updateShelf.isPending}>
              {updateShelf.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Shelf"
        description={<>Delete <strong>{deleteTarget?.name}</strong>?</>}
        onConfirm={() => { if (deleteTarget) deleteShelf.mutate(deleteTarget.id); setDeleteTarget(null) }}
      />
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export function StockManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/app/storage"
        icon={<WarehouseIcon className="size-5 text-emerald-500" strokeWidth={1.5} />}
        title="Stock Management"
        subtitle="Manage physical storage hierarchy: rooms → zones → racks → shelves."
      />

      <Tabs defaultValue="rooms">
        <TabsList>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="racks">Racks</TabsTrigger>
          <TabsTrigger value="shelves">Shelves</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="mt-4"><RoomsTab /></TabsContent>
        <TabsContent value="zones" className="mt-4"><ZonesTab /></TabsContent>
        <TabsContent value="racks" className="mt-4"><RacksTab /></TabsContent>
        <TabsContent value="shelves" className="mt-4"><ShelvesTab /></TabsContent>
      </Tabs>
    </div>
  )
}
