import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToppings } from '@/features/toppings/hooks/use-toppings'
import { CommandList } from 'cmdk'

interface PizzaFormProps {
  storeId: string
  initialName?: string
  initialToppingIds?: string[]
  onSubmit: (data: { name: string; toppingIds: string[] }) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function PizzaForm({
  storeId,
  initialName = '',
  initialToppingIds = [],
  onSubmit,
  onCancel,
  isSubmitting = false
}: PizzaFormProps) {
  const [name, setName] = useState(initialName)
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>(initialToppingIds)
  const [open, setOpen] = useState(false)
  const { data: toppings, isLoading } = useToppings(storeId)

  useEffect(() => {
    // setName(initialName)
    // setSelectedToppingIds(initialToppingIds)
  }, [initialName, initialToppingIds])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, toppingIds: selectedToppingIds })
  }

  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds(current =>
      current.includes(toppingId)
        ? current.filter(id => id !== toppingId)
        : [...current, toppingId]
    )
  }

  const getSelectedToppingsText = () => {
    if (selectedToppingIds.length === 0) return "Select toppings..."
    if (!toppings) return `${selectedToppingIds.length} selected`

    const selectedNames = toppings
      .filter(t => selectedToppingIds.includes(t.id))
      .map(t => t.name)
      .join(", ")

    return selectedNames.length > 30
      ? `${selectedToppingIds.length} selected`
      : selectedNames
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Pizza Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter pizza name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Toppings</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {getSelectedToppingsText()}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search toppings..." />
              <CommandEmpty>No toppings found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {isLoading ? (
                    <CommandItem disabled>Loading toppings...</CommandItem>
                  ) : toppings && toppings.map((topping) => (
                    <CommandItem
                      key={topping.id}
                      value={topping.name}
                      onSelect={() => {
                        toggleTopping(topping.id)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedToppingIds.includes(topping.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {topping.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Pizza"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}