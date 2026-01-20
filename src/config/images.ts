import { StoragePathBuilder, STORAGE_PATHS } from '@/shared/constants/storage-paths';

export const heroImages = {
  innovation: `/${StoragePathBuilder.company('about')}/about-hero.svg`, // Impresora 3D moderna / About Hero
  services: `/${StoragePathBuilder.ui.banners()}/servicios-diseno-modelado-impresion-3d-ddreams-3d.png`, // Servicios General
  process: `/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`, // Proceso (misma imagen que innovación/about por defecto)
  precision: `/${StoragePathBuilder.projects('soluciones-funcionales-a-medida')}/prototipo-funcional-impresion-3d-pieza-tecnica-acople.png`, // Pieza detallada
  solutions: `/${StoragePathBuilder.projects('soluciones-funcionales-a-medida')}/prototipo-funcional-impresion-3d-conjunto-mecanico.png` // Prototipo funcional
};

export const serviceImages = {
  printing: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-detalle-alta-calidad.jpg`, // Impresión profesional
  modeling: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/modelado-3d-organico-personajes-esculturas-digitales.png`, // Modelado 3D (Principal)
  modelingSecondary: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/diseno-3d-organico-modelado-artistico-profesional.png`, // Modelado 3D (Secundaria/Detalle)
  prototyping: `/${StoragePathBuilder.services('prototipado-ingenieria-piezas-tecnicas')}/prototipado-ingenieria-vista-general-piezas.jpg`, // Prototipado
  production: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-produccion-lotes-piezas-tecnicas.jpg`, // Producción
  engineering: `/${StoragePathBuilder.services('prototipado-ingenieria-piezas-tecnicas')}/prototipado-ingenieria-detalle-mecanico-funcional.jpg`, // Ingeniería
  certification: `/${StoragePathBuilder.services('prototipado-tecnico-impresion-3d')}/ingenieria-inversa-diseno-mecanico-3d.png` // Certificación
};

export const productImages = {
  prototype: `/${StoragePathBuilder.services('prototipado-ingenieria-piezas-tecnicas')}/prototipado-ingenieria-vista-general-piezas.jpg`, // Prototipo
  architectural: `/${StoragePathBuilder.services('maquetas-3d')}/maquetas-didacticas-v2.png`, // Maqueta
  mechanical: `/${StoragePathBuilder.services('prototipado-ingenieria-piezas-tecnicas')}/prototipado-ingenieria-detalle-mecanico-funcional.jpg`, // Pieza mecánica
  medical: `/${StoragePathBuilder.products('medicina', 'modelo-anatomico-pelvis-humana-escala-real')}/modelo-pelvis-anatomica-escala-real-3d-vista-frontal.png`, // Modelo médico
  artistic: `/${StoragePathBuilder.products('arte-diseno', 'regalo-personalizado-fanaticos-autos-copa-piston')}/copa-piston-20cm-regalo-personalizado-autos-3d-frontal.png`, // Modelo artístico
  educational: `/${StoragePathBuilder.products('medicina', 'modelo-anatomico-pelvis-humana-escala-real')}/modelo-pelvis-anatomica-escala-real-3d-uso-educativo.jpg` // Modelo educativo
};

export const aboutImages = {
  team: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-encargo-servicio-profesional.jpg`, // Equipo trabajando
  facility: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-gran-formato-piezas-industriales.jpg`, // Instalaciones
  process: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-produccion-lotes-piezas-tecnicas.jpg` // Proceso
};

export const processImages = {
  upload: `/${StoragePathBuilder.services('prototipado-tecnico-impresion-3d')}/ingenieria-inversa-diseno-mecanico-3d.png`, // Subida de archivos
  review: `/${StoragePathBuilder.services('prototipado-tecnico-impresion-3d')}/prototipado-tecnico-diseno-cad-industrial.png`, // Revisión
  printing: `/${StoragePathBuilder.services('impresion-3d-por-encargo')}/impresion-3d-detalle-alta-calidad.jpg`, // Impresión
  postProcess: `/${StoragePathBuilder.services('fabricacion-cascos-mascaras-props-cosplay')}/fabricacion-cascos-mascaras-cosplay-props-acabado-final.png`, // Post-procesado
  delivery: `/${StoragePathBuilder.products('arte-diseno', 'cooler-motor-3d-v8')}/cooler-motor-v8-impresion-3d-regalo-autos-uso.png` // Entrega
};