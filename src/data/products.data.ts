import { StoreProduct } from '@/shared/types/domain';

export const products: StoreProduct[] = [
  {
    id: '1',
    kind: 'product', slug: 'modelo-anatomico-pelvis-humana-escala-real',
    name: 'Modelo Anatómico de Pelvis Humana – Escala Real (Impresión 3D)',
    description: 'Modelo anatómico físico de pelvis humana impreso en 3D a escala real, diseñado para uso educativo y médico.\n\nEsta pieza reproduce con precisión las principales estructuras óseas de la pelvis, siendo ideal para estudiantes de medicina, enfermería, obstetricia, fisioterapia y carreras afines.\n\nFabricado mediante impresión 3D de alta precisión en PLA Premium, el modelo incluye base de soporte, lo que facilita su correcta exhibición y manipulación en entornos académicos, educativos o clínicos.\n\nEs una herramienta didáctica ideal para el aprendizaje, la enseñanza y la demostración anatómica.',
    shortDescription: 'Modelo anatómico físico de pelvis humana impreso en 3D a escala real',
    price: 300.00,
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '1',
        productId: '1',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-vista-frontal.png?alt=media&token=d16a5cd3-4552-4995-910a-e3cadc295252',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Vista Frontal',
        isPrimary: true,
        imagePosition: 'object-center',
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-b',
        productId: '1',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-vista-lateral.png?alt=media&token=4074c59c-3962-447d-bdfc-25fada2de4fd',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Vista Lateral',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-c',
        productId: '1',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-detalle.jpg?alt=media&token=80fc524d-aecd-4096-91e7-9eaa7d658302',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Detalle Estructural',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-d',
        productId: '1',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-perspectiva.jpg?alt=media&token=ba6ebecf-7939-45b5-a01e-319e425d16e8',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Perspectiva',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-e',
        productId: '1',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-uso-educativo.jpg?alt=media&token=533a34cd-0cc8-40ba-8e4d-d1addf825c74',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Uso Educativo',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    specifications: [
      { name: 'Categoría', value: 'Anatomía Humana 3D' },
      { name: 'Escala', value: 'Escala 1:1 (Tamaño real)' },
      { name: 'Material', value: 'PLA Premium (impresión 3D de alta precisión)' },
      { name: 'Uso', value: 'Educativo y Médico' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['modeloAnatomico', 'pelvisHumana', 'anatomiaHumana', 'educacionMedica', 'modeloEducativo', 'impresion3D', 'anatomia3D', 'Arequipa'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Columna Vertebral Anatómica – Escala Real (Ensamblada)',
    kind: 'product', slug: 'columna-vertebral-anatomica-escala-real',
    description: 'Modelo anatómico físico impreso en 3D, compuesto por vértebras individuales ensambladas manualmente. Incluye pelvis como base de soporte, ideal para uso educativo y demostrativo.',
    shortDescription: 'Modelo anatómico físico impreso en 3D',
    price: 450.00,
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '12',
        productId: '6',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-vista-frontal.png?alt=media&token=d16a5cd3-4552-4995-910a-e3cadc295252',
        alt: 'Columna Vertebral Anatómica - Modelo 3D Ensamblado',
        isPrimary: true,
        imagePosition: 'object-top',
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ],
    specifications: [
      {
        id: '26',
        name: 'Categoría',
        value: 'Modelos Anatómicos'
      },
      {
        id: '27',
        name: 'Escala',
        value: 'Real'
      },
      {
        id: '28',
        name: 'Material',
        value: 'PLA Premium'
      },
      {
        id: '29',
        name: 'Configuración',
        value: 'Vértebras impresas por separado y ensambladas manualmente'
      },
      {
        id: '30',
        name: 'Base',
        value: 'Pelvis incluida'
      },
      {
        id: '31',
        name: 'Uso',
        value: 'Educativo / Didáctico'
      },
      {
        id: '32',
        name: 'Tiempo de fabricación',
        value: '7–10 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['anatomía', 'medicina', 'columna', 'educativo', '3d'],
    sku: 'ANAT-SPINE-001',
    stock: 10,
    minQuantity: 1,
    materials: ['PLA Premium'],
    complexity: 'high',
    rating: 4.8,
    reviewCount: 5,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    kind: 'product', slug: 'regalo-personalizado-fanaticos-autos-copa-piston',
    name: 'Regalo Personalizado para Fanáticos de Autos – Copa Pistón 3D (Estándar)',
    description: 'Regalo personalizado ideal para fanáticos de los autos, perfecto para sorprender a hijos, jóvenes o adultos amantes de la velocidad. Esta copa pistón fabricada en impresión 3D es una excelente opción para cumpleaños, logros o fechas especiales, e incluye personalización con nombre o frase.',
    shortDescription: 'Regalo personalizado ideal para fanáticos de los autos',
    price: 79.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '2',
        productId: '2',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcopa-piston-20cm-regalo-personalizado-autos-3d-frontal.png?alt=media&token=de1cdac1-67be-461a-abd2-2fccd8729a56',
        alt: 'Copa Pistón 20cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2-b',
        productId: '2',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcopa-piston-20cm-regalo-personalizado-autos-3d-detalle.png?alt=media&token=2086d4b3-2d6c-48d1-8b30-925b67804580',
        alt: 'Copa Pistón 20cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-sticker',
            name: 'Sticker personalizado (nombre o frase Incluida)',
            priceModifier: 0,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el nombre o frase (máx. 50 caracteres)...',
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D impreso (texto integrado en la pieza)',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '5',
        name: 'Tamaño',
        value: '20 cm'
      },
      {
        id: '8',
        name: 'Tiempo estimado de fabricación',
        value: 'Fabricación bajo pedido (2–4 días hábiles)'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['regaloPersonalizado', 'regaloParaFanaticosDeAutos', 'regaloParaHijos', 'trofeoPersonalizado', 'impresion3D', 'regalosArequipa', 'Arequipa'],
    sku: 'COPA-20CM-001',
    stock: 50,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 12,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '3',
    kind: 'product', slug: 'regalo-personalizado-fanaticos-autos-copa-piston-grande',
    name: 'Regalo Personalizado para Fanáticos de Autos – Copa Pistón 3D (Grande)',
    description: 'Regalo personalizado ideal para fanáticos de los autos, perfecto para sorprender a hijos, jóvenes o adultos amantes de la velocidad. Esta versión grande de nuestra copa pistón, fabricada en impresión 3D, destaca por su mayor tamaño y presencia, siendo una excelente opción para cumpleaños, logros o fechas especiales, e incluye personalización con nombre o frase.',
    shortDescription: 'Regalo personalizado ideal para fanáticos de los autos (Versión Grande)',
    price: 129.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '3',
        productId: '3',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcopa-piston-grande-30cm-regalo-personalizado-autos-3d-frontal.png?alt=media&token=5f9bd09b-f26a-420c-931f-07142f86d65b',
        alt: 'Copa Pistón Grande 30cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3-b',
        productId: '3',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcopa-piston-grande-30cm-regalo-personalizado-autos-3d-detalle.png?alt=media&token=5a2e4773-77e7-461e-8d7b-1608e6f6c101',
        alt: 'Copa Pistón Grande 30cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-sticker',
            name: 'Sticker personalizado (nombre o frase Incluida)',
            priceModifier: 0,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el nombre o frase (máx. 50 caracteres)...',
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D impreso (texto integrado en la pieza)',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '9',
        name: 'Tamaño',
        value: '30 cm'
      },
      {
        id: '13',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['regaloPersonalizado', 'regaloParaFanaticosDeAutos', 'regaloParaHijos', 'regaloEspecial', 'trofeoPersonalizado', 'impresion3D', 'regalosArequipa', 'Arequipa'],
    sku: 'COPA-30CM-001',
    stock: 50,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    rating: 4.9,
    reviewCount: 5,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '4',
    kind: 'product',
    slug: 'cooler-motor-3d-v6',
    name: 'Cooler Motor 3D – V6',
    description: 'Cooler funcional impreso en 3D con diseño inspirado en motores V6. Ideal para mantener bebidas frías en reuniones pequeñas, escritorios, espacios gamer o como regalo original para fanáticos de los autos y la mecánica.\n\nFabricado mediante impresión 3D en PLA Premium, combina diseño llamativo con funcionalidad real. Su formato compacto lo hace perfecto para cervezas, gaseosas o bebidas individuales, aportando un toque automotriz único al espacio.',
    shortDescription: 'Cooler funcional impreso en 3D con diseño inspirado en motores V6',
    price: 210.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '8',
        productId: '4',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-frontal.png?alt=media&token=1e24c02c-eab9-4ed8-81f4-7454cdda126c',
        alt: 'Cooler Motor 3D V6',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-none',
            name: 'Sin grabado personalizado',
            priceModifier: 0,
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D personalizado (nombre o frase) – grabado permanente integrado en la pieza',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '14',
        name: 'Tamaño',
        value: 'V6 (6 espacios)'
      },
      {
        id: '19',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cooler3D', 'coolerMotor', 'regaloParaFanaticosDeAutos', 'regaloOriginal', 'impresion3D', 'cerveza', 'Arequipa'],
    sku: 'COOLER-V6-001',
    stock: 20,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    rating: 4.8,
    reviewCount: 15,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '5',
    kind: 'product',
    slug: 'cooler-motor-3d-v8',
    name: 'Cooler Motor 3D – V8',
    description: 'Cooler funcional impreso en 3D con diseño robusto inspirado en motores V8. Pensado para quienes buscan mayor capacidad y presencia visual, ideal para reuniones, eventos pequeños, parrillas o como regalo premium para amantes del mundo automotor.\n\nFabricado en impresión 3D de alta calidad con PLA Premium, ofrece mayor espacio para bebidas y un diseño más imponente, manteniendo el estilo mecánico como protagonista.',
    shortDescription: 'Cooler funcional impreso en 3D con diseño robusto inspirado en motores V8',
    price: 260.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '10',
        productId: '5',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-frontal.png?alt=media&token=1e24c02c-eab9-4ed8-81f4-7454cdda126c',
        alt: 'Cooler Motor 3D V8 - Vista Principal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '10-b',
        productId: '5',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-detalle.png?alt=media&token=c846c579-5d8a-4c86-a192-19b8912df6bd',
        alt: 'Cooler Motor 3D V8 - Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '10-c',
        productId: '5',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-superior.png?alt=media&token=bc0f3ce5-b2ae-4ad0-ac7f-f54ba825337a',
        alt: 'Cooler Motor 3D V8 - Vista Superior',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '10-d',
        productId: '5',
        url: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-uso.png?alt=media&token=8247f60b-b83c-4418-adb2-7916e6fa96d5',
        alt: 'Cooler Motor 3D V8 - Uso',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-none',
            name: 'Sin grabado personalizado',
            priceModifier: 0,
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D personalizado (nombre o frase) – grabado permanente integrado en la pieza',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '20',
        name: 'Tamaño',
        value: 'V8 (8 espacios)'
      },
      {
        id: '25',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cooler3D', 'coolerMotorV8', 'regaloParaFanaticosDeAutos', 'regaloPremium', 'impresion3D', 'cerveza', 'Arequipa'],
    sku: 'COOLER-V8-001',
    stock: 15,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'high',
    rating: 4.9,
    reviewCount: 20,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
];
