const API_URL = import.meta.env.VITE_API_URL;

export const getArticulos = async (limit = 10) => {
  try {
    // Optimización: Populate selectivo y campos estrictamente necesarios para el listado
    const query = new URLSearchParams({
      'fields[0]': 'titulo',
      'fields[1]': 'slug',
      'fields[2]': 'resumen',
      'fields[3]': 'categoria',
      'fields[4]': 'publishedAt',
      'populate[imagenDestacada][fields][0]': 'url',
      'populate[imagenDestacada][fields][1]': 'formats',
      'sort[0]': 'publishedAt:desc',
      'pagination[pageSize]': limit
    });
    const res = await fetch(`${API_URL}/articulos?${query.toString()}`);
    if (!res.ok) throw new Error('Error fetching articles');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in getArticulos:', error);
    return [];
  }
};

export const getRecursos = async () => {
  try {
    const res = await fetch(`${API_URL}/recursos?populate=*`);
    if (!res.ok) throw new Error('Error fetching resources');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in getRecursos:', error);
    return [];
  }
};

// ===== ForoBiker API =====

/**
 * Obtener temas del foro con filtro de categoría y paginación.
 * Lectura pública (no requiere token).
 */
export const getForoTemas = async (categoria = '', page = 1, pageSize = 10) => {
  try {
    let url = `${API_URL}/foro-temas?populate[0]=autor.avatar&populate[1]=autor.role&populate[2]=respuestas&sort[0]=fijado:desc&sort[1]=updatedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    if (categoria && categoria !== 'todas') {
      url += `&filters[categoria][$eq]=${categoria}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching foro temas');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getForoTemas:', error);
    return { data: [], meta: { pagination: { page: 1, pageCount: 1, total: 0 } } };
  }
};

/**
 * Obtener conteos de temas por categoría
 */
export const getForoStats = async () => {
  try {
    // Un simple endpoint para obtener todos y luego agruparlos, o múltiples llamadas ligeras.
    // Para simplificar, obtenemos todo con solo el campo categoria.
    const url = `${API_URL}/foro-temas?fields[0]=categoria&pagination[pageSize]=1000`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching foro stats');
    const data = await res.json();
    
    const counts = {
      todas: data.meta.pagination.total || 0,
      'Las Motos y la Mecánica': 0,
      'Rutas, Eventos y Quedadas': 0,
      'Taller, Equipo y Consejos': 0,
      'La Vida Biker': 0,
      'Nuevos Miembros': 0,
    };
    
    if (data.data) {
      data.data.forEach(tema => {
        if (counts[tema.categoria] !== undefined) {
          counts[tema.categoria]++;
        }
      });
    }
    return counts;
  } catch (error) {
    console.error('Error in getForoStats:', error);
    return {};
  }
};

/**
 * Obtener un tema individual con sus respuestas populadas.
 * Lectura pública.
 */
export const getForoTema = async (documentId) => {
  try {
    const url = `${API_URL}/foro-temas/${documentId}?populate[autor][populate][0]=avatar&populate[autor][populate][1]=role&populate[respuestas][populate][autor][populate][0]=avatar&populate[respuestas][populate][autor][populate][1]=role&populate[respuestas][sort][0]=createdAt:asc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching foro tema');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in getForoTema:', error);
    return null;
  }
};

/**
 * Crear un nuevo tema. Requiere autenticación.
 */
export const crearForoTema = async ({ titulo, contenido, categoria }, token) => {
  try {
    const res = await fetch(`${API_URL}/foro-temas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { titulo, contenido, categoria } }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || 'Error creando tema');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in crearForoTema:', error);
    throw error;
  }
};

/**
 * Crear una respuesta a un tema. Requiere autenticación.
 */
export const crearForoRespuesta = async ({ contenido, temaDocumentId }, token) => {
  try {
    const res = await fetch(`${API_URL}/foro-respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          contenido,
          tema: temaDocumentId,
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || 'Error creando respuesta');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in crearForoRespuesta:', error);
    throw error;
  }
};

// ===== GangaBiker API =====

/**
 * Obtener gangas con filtro de categoría y paginación.
 * Lectura pública.
 */
export const getGangas = async (categoria = '', page = 1, pageSize = 12) => {
  try {
    let url = `${API_URL}/gangas?populate=vendedor.avatar,fotos&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    if (categoria && categoria !== 'todas') {
      url += `&filters[categoria][$eq]=${categoria}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching gangas');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getGangas:', error);
    return { data: [], meta: { pagination: { page: 1, pageCount: 1, total: 0 } } };
  }
};

/**
 * Subir archivos a Strapi. Requiere autenticación.
 */
export const uploadMedia = async (file, token) => {
  try {
    console.log("🌐 Enviando petición a /upload con token:", token ? `Presente (longitud: ${token.length})` : "AUSENTE");
    const formData = new FormData();
    formData.append('files', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Error crudo del servidor:", err);
      throw new Error(err?.error?.message || `Error al subir la imagen: ${res.status}`);
    }
    const data = await res.json();
    return data; // Array of uploaded files
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    throw error;
  }
};

/**
 * Crear una nueva Ganga. Requiere autenticación.
 */
export const crearGanga = async (gangaData, token) => {
  try {
    const res = await fetch(`${API_URL}/gangas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: gangaData }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || 'Error publicando ganga');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error in crearGanga:', error);
    throw error;
  }
};

/**
 * Fetch list of videos with pagination and category filtering
 */
export const getVideos = async (categoria = 'todas', page = 1, pageSize = 12) => {
  let url = `${API_URL}/videos?populate=*&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  if (categoria !== 'todas') {
    url += `&filters[categoria][$eq]=${categoria}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar videos');
  return response.json();
};
