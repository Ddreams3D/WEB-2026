import {
  getAnimationClasses,
  useStaggeredAnimation,
} from '@/shared/hooks/useIntersectionAnimation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

const teamMembers = [
  {
    name: 'Daniel Chaiña',
    role: 'CEO & Fundador Visionario',
    description:
      'Líder emprendedor con visión estratégica que fundó Ddreams 3D para democratizar la tecnología de impresión 3D en Perú. Su pasión por la innovación y el desarrollo tecnológico ha posicionado a la empresa como referente en soluciones 3D personalizadas.',
    image: '/images/placeholder-team.svg',
    expertise: [
      'Liderazgo Empresarial',
      'Estrategia de Negocio',
      'Innovación Tecnológica',
      'Desarrollo de Mercado',
    ],
    additionalInfo: {
      experience: '5+ años en tecnología 3D',
      education: 'Ingeniería Industrial',
      achievements: [
        'Fundador de Ddreams 3D',
        'Pionero en impresión 3D en Arequipa',
        'Mentor de startups tecnológicas',
      ],
    },
  },
  {
    name: 'Miguel Torres',
    role: 'Especialista en Modelado 3D',
    description:
      'Experto en diseño y modelado 3D con dominio avanzado de software especializado. Transforma ideas conceptuales en modelos digitales precisos, optimizados para impresión 3D y manufactura aditiva de alta calidad.',
    image: '/images/placeholder-team.svg',
    expertise: [
      'Modelado 3D Avanzado',
      'CAD/CAM',
      'Optimización de Diseño',
      'Prototipado Rápido',
    ],
    additionalInfo: {
      experience: '4+ años en modelado 3D',
      education: 'Diseño Industrial',
      achievements: [
        'Especialista en SolidWorks',
        'Experto en Fusion 360',
        'Más de 200 modelos creados',
      ],
    },
  },
  {
    name: 'Ana García',
    role: 'Directora de Operaciones',
    description:
      'Profesional especializada en gestión de proyectos y optimización de procesos productivos. Coordina la ejecución eficiente de proyectos desde la conceptualización hasta la entrega final, garantizando calidad y cumplimiento de tiempos.',
    image: '/images/placeholder-team.svg',
    expertise: [
      'Gestión de Proyectos',
      'Control de Calidad',
      'Optimización de Procesos',
      'Atención al Cliente',
    ],
    additionalInfo: {
      experience: '3+ años en operaciones',
      education: 'Administración de Empresas',
      achievements: [
        'Certificación PMP',
        'Implementación de sistemas de calidad',
        '95% de satisfacción del cliente',
      ],
    },
  },
  {
    name: 'Carlos Mendoza',
    role: 'Técnico en Impresión 3D',
    description:
      'Especialista técnico en tecnologías de impresión 3D y post-procesamiento. Domina múltiples tecnologías de manufactura aditiva y materiales especializados, asegurando la excelencia técnica en cada producción.',
    image: '/images/placeholder-team.svg',
    expertise: [
      'Impresión 3D FDM/SLA',
      'Post-procesamiento',
      'Materiales Avanzados',
      'Mantenimiento Técnico',
    ],
    additionalInfo: {
      experience: '3+ años en impresión 3D',
      education: 'Técnico en Mecánica',
      achievements: [
        'Certificación en múltiples tecnologías',
        'Especialista en materiales',
        'Cero defectos en producción',
      ],
    },
  },
];

export default function AboutTeam() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const { ref: teamRef, isVisible: teamVisible } = useStaggeredAnimation();

  return (
    <section ref={teamRef}>
      <div className="text-center mb-12">
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getAnimationClasses(
            teamVisible,
            0
          )}`}
        >
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Nuestro Equipo de Expertos
          </span>
        </h2>
        <p
          className={`text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto ${getAnimationClasses(
            teamVisible,
            1
          )}`}
        >
          <strong>Talentos excepcionales</strong> unidos por la pasión hacia la
          tecnología 3D. Cada miembro aporta <em>experiencia única</em> y
          dedicación absoluta para transformar tus ideas más ambiciosas en
          realidades extraordinarias.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`group cursor-pointer ${getAnimationClasses(
              teamVisible,
              index + 2
            )}`}
            onClick={() =>
              setExpandedMember(expandedMember === index ? null : index)
            }
          >
            <div className="bg-surface dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gradient-to-br from-primary-400 via-secondary-500 to-primary-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2 text-sm">
                  {member.role}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-3">
                  {member.description}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(expandedMember === index
                    ? member.expertise
                    : member.expertise.slice(0, 2)
                  ).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.expertise.length > 2 && expandedMember !== index && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                      +{member.expertise.length - 2}
                    </span>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedMember === index && member.additionalInfo && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 block">
                          Experiencia
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {member.additionalInfo.experience}
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 block">
                          Educación
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {member.additionalInfo.education}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Logros Destacados
                      </h4>
                      <ul className="space-y-1">
                        {member.additionalInfo.achievements.map(
                          (achievement, achIndex) => (
                            <li
                              key={achIndex}
                              className="text-xs text-gray-600 dark:text-gray-400 flex items-start"
                            >
                              <span className="w-1 h-1 bg-primary-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {expandedMember === index
                        ? 'Ver menos'
                        : 'Ver más detalles'}
                    </span>
                    {expandedMember === index ? (
                      <ChevronUp className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    ) : (
                      <ChevronDown className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
