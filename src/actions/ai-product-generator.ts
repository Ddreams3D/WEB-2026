'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface GeneratedProductContent {
  name: string;
  description: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string | string[];
  categorySuggestion: string;
  materialSuggestion: string;
}

export async function generateProductContent(rawInput: string, context?: { validMaterials?: string[], validCategories?: string[], imageBase64?: string }): Promise<GeneratedProductContent | null> {
  if (!genAI) {
    console.warn('Gemini API Key is missing');
    return null;
  }

  try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });

    const materialsList = context?.validMaterials?.join(', ') || 'PLA Premium, PETG, TPU Flexible, Resina 8K';
    const categoriesList = context?.validCategories?.join(', ') || 'Arte y Diseño, Medicina, Ingeniería, Decoración, Otros';
    
    // Si tenemos imagen, ajustamos el prompt para análisis visual
    const hasImage = !!context?.imageBase64;
    const taskDescription = hasImage 
        ? `Analyze the provided image and the user input "${rawInput}". Generate a structured product data sheet based on the VISUAL appearance and the input context.`
        : `Generate the JSON data sheet for user input: "${rawInput}".`;

    const prompt = `
      You are an expert **Product Designer** and **3D Printing Specialist**.
      Your task is to generate a **clear, engaging, and professional product data sheet** for a 3D printed object.
      
      **CRITICAL RULE:** 
      You are NOT a salesperson. You do NOT write marketing copy (no "buy now", "perfect gift", etc.).
      However, you must NOT be overly clinical or robotic. 
      You describe the object's design, utility, and aesthetic value in a way that is **accessible to a general audience**.

      **FORBIDDEN PHRASES (Instant Fails):**
      - "Compra online"
      - "Venta de"
      - "Adquiere este producto"
      - "Gran oferta"
      - "El regalo perfecto"
      - "No te lo pierdas"

      **TONE GUIDELINES:**
      - Professional but approachable.
      - Descriptive and highlighting the *value* of the design (ergonomics, aesthetics, functionality).
      - Avoid excessive medical/engineering jargon unless strictly necessary for accuracy.
      - Style: High-end Design Magazine (e.g., Dezeen, Yanko Design).

      **CONTEXT:**
      - Brand: "Ddreams 3D" (High-end additive manufacturing service).
      - Location: "Arequipa, Perú" (Local market leader, but shipping nationwide).
      - Target Audience: Local customers in Arequipa (students, professionals) and general 3D printing enthusiasts in Perú.
      - Materials: ${materialsList}.
      - Categories: ${categoriesList}.

      **SEO & KEYWORD RULES:**
      - ALWAYS include "Arequipa" or "Perú" in keywords if relevant to the product (e.g., "impresion 3d arequipa", "maquetas arequipa").
      - "metaTitle" should be catchy and local-friendly if appropriate (e.g., "Nombre Producto | Impresión 3D Arequipa").
      - Keep keywords lowercased (except proper nouns if needed).

      **FEW-SHOT EXAMPLES (Follow these patterns):**

      --- EXAMPLE 1 (Medical/Educational) ---
      Input: "pelvis humana"
      Output: {
        "name": "Modelo de Pelvis Humana – Escala Real 1:1",
        "description": "Réplica detallada de la pelvis humana adulta, ideal para estudiantes y profesionales. Muestra con claridad la estructura ósea, incluyendo el sacro, el cóccix y los huesos coxales. Su acabado preciso permite apreciar relieves y articulaciones, convirtiéndolo en una herramienta excelente para el estudio anatómico o la explicación clínica a pacientes.",
        "shortDescription": "Modelo anatómico a escala real. Ideal para educación y consulta médica.",
        "metaTitle": "Pelvis Humana 3D Escala Real | Anatomía Ddreams 3D",
        "metaDescription": "Modelo de pelvis humana impreso en 3D. Réplica exacta para fines educativos y médicos.",
        "keywords": "anatomia pelvis, modelo medico, impresion 3d osea, educacion medica, anatomia arequipa",
        "categorySuggestion": "Medicina",
        "materialSuggestion": "PLA Premium"
      }

      --- EXAMPLE 2 (Design/Functional) ---
      Input: "soporte auriculares voronoi"
      Output: {
        "name": "Soporte de Auriculares - Diseño Voronoi",
        "description": "Soporte de escritorio moderno con una estructura basada en patrones naturales Voronoi. Este diseño no solo es visualmente impactante, sino que crea una pieza ligera y resistente. Su forma curva protege la diadema de tus auriculares, mientras que la estructura abierta permite una excelente ventilación. Un accesorio funcional que aporta un toque orgánico y tecnológico a tu espacio de trabajo.",
        "shortDescription": "Soporte de diseño orgánico y ligero. Protege y exhibe tus auriculares con estilo.",
        "metaTitle": "Soporte Auriculares Voronoi | Diseño Generativo 3D",
        "metaDescription": "Soporte para auriculares con patrón Voronoi. Diseño moderno, ligero y resistente.",
        "keywords": "voronoi design, soporte auriculares, diseño generativo, accesorios escritorio, impresion 3d peru",
        "categorySuggestion": "Decoración",
        "materialSuggestion": "PLA Premium"
      }

      **TASK:**
      ${taskDescription}
    `;

    let result;
    try {
        if (hasImage && context?.imageBase64) {
             // Multimodal Input
             const imagePart = {
                inlineData: {
                    data: context.imageBase64,
                    mimeType: "image/jpeg" // Asumimos JPEG o PNG, Gemini lo maneja bien
                }
            };
            result = await model.generateContent([prompt, imagePart]);
        } else {
            // Text Only Input
            result = await model.generateContent(prompt);
        }
    } catch (modelError) {
        console.warn("Gemini Flash failed, retrying with Gemini Pro...", modelError);
        // Fallback to Gemini Pro (legacy but reliable)
        const modelPro = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-pro',
            generationConfig: {
                maxOutputTokens: 4000,
                temperature: 0.2,
                responseMimeType: "application/json",
            }
        });
        result = await modelPro.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();
    
    // Como usamos responseMimeType: "application/json", el texto ya debería ser JSON válido sin markdown blocks.
    // Aún así, limpiamos por seguridad.
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let data;
    try {
        data = JSON.parse(cleanText);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw Text:", cleanText);
        return null;
    }

    // --- SANITIZACIÓN POST-PROCESAMIENTO (Red de Seguridad Final) ---
    const forbiddenStarters = [
      /^(¡)?compra( online)?/i,
      /^(¡)?venta( de)?/i,
      /^(¡)?adquiere/i,
      /^(¡)?disponible en/i,
      /^(¡)?consigue/i,
      /^(¡)?oferta/i,
      /^(¡)?precio/i,
      /^(¡)?env[íi]o gratis/i
    ];

    const sanitizeField = (field: string) => {
      if (!field) return "";
      let clean = field;
      
      // 1. Detectar si empieza con frase prohibida
      const hasForbiddenStart = forbiddenStarters.some(regex => regex.test(clean));
      
      if (hasForbiddenStart) {
        // Intentar cortar la primera oración (asumiendo que es la de venta)
        const parts = clean.split('.');
        if (parts.length > 1) {
            // Eliminar la primera parte y unir el resto
            clean = parts.slice(1).join('.').trim();
        } else {
            // Si solo hay una oración y es de venta, reemplazar con genérico
            clean = `Modelo 3D de alta precisión diseñado para ${rawInput}.`;
        }
      }
      
      // 2. Limpieza secundaria de prefijos residuales
      clean = clean.replace(/^modelo de modelo/i, "Modelo");
      return clean;
    };

    if (data.description) data.description = sanitizeField(data.description);
    if (data.shortDescription) data.shortDescription = sanitizeField(data.shortDescription);
    // ------------------------------------------------------------------------------------

    return data;
  } catch (error: any) {
    console.error('Error generating product content:', error);
    return null;
  }
}
