// Tag service for fetching and managing tags

export interface Tag {
  id: number;
  nome: string;
  cor: string;
  descricao?: string;
}

// Cache for tags to avoid multiple API calls
let tagsCache: Tag[] | null = null;

/**
 * Fetch all tags from the API
 */
export async function fetchTags(): Promise<Tag[]> {
  // If we have cached tags, return them
  if (tagsCache) {
    return tagsCache;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    
    // Adicionar o token JWT ao cabeçalho
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}/api/tags`, { headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error fetching tags:", response.status, errorData);
      throw new Error(`Error fetching tags: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    // Map the API response to our Tag interface
    const tags: Tag[] = data.map((tag: any) => ({
      id: tag.id,
      nome: tag.nome,
      cor: tag.cor || "#71717A", // Default color if none is provided
      descricao: tag.descricao,
    }));

    // Cache the tags
    tagsCache = tags;
    
    return tags;
  } catch (error) {
    console.error("Error in fetchTags:", error);
    throw error;
  }
}

/**
 * Clear the tags cache to force a fresh fetch
 */
export function clearTagsCache() {
  tagsCache = null;
}

/**
 * Find a tag by name
 */
export async function findTagByName(name: string): Promise<Tag | undefined> {
  const tags = await fetchTags();
  return tags.find(tag => tag.nome.toLowerCase() === name.toLowerCase());
}

/**
 * Get tag color by name
 */
export async function getTagColor(name: string): Promise<string> {
  const tag = await findTagByName(name);
  return tag?.cor || "#71717A"; // Default color if tag not found
}

/**
 * Get multiple tags by their names
 */
export async function getTagsByNames(names: string[]): Promise<Tag[]> {
  const tags = await fetchTags();
  return tags.filter(tag => names.some(name => name.toLowerCase() === tag.nome.toLowerCase()));
}
