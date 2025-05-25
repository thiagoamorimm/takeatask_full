"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchTags, Tag } from "@/services/tag-service"
import ColoredTag from "@/components/colored-tag"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true)
        const fetchedTags = await fetchTags()
        setTags(fetchedTags)
        setError(null)
      } catch (err) {
        console.error("Error loading tags:", err)
        setError("Falha ao carregar tags")
      } finally {
        setLoading(false)
      }
    }

    loadTags()
  }, [])

  const handleSelect = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tagName) => (
          <ColoredTag 
            key={tagName} 
            name={tagName} 
            onRemove={() => removeTag(tagName)} 
          />
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading ? "Carregando tags..." : "Selecionar tags"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar tag..." />
            <CommandEmpty>
              {error ? (
                <div className="text-red-500 p-2">{error}</div>
              ) : (
                "Nenhuma tag encontrada."
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.nome}
                  onSelect={() => handleSelect(tag.nome)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ backgroundColor: tag.cor }}
                    />
                    <span>{tag.nome}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTags.includes(tag.nome) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
