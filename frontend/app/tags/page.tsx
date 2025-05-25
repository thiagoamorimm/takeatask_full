import TagsList from "@/components/tags-list"
import NovaTagButton from "@/components/nova-tag-button"

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">Gerencie as tags para categorizar tarefas.</p>
        </div>
        <NovaTagButton />
      </div>

      <TagsList />
    </div>
  )
}
