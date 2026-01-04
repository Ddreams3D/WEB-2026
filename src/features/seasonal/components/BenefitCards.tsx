import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Gift, Truck, Zap, Ghost, Skull, Moon } from 'lucide-react';

interface BenefitProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
  iconClassName?: string;
  titleClassName?: string;
}

export const BenefitCard = ({ icon: Icon, title, description, delay = 0, iconClassName, titleClassName }: BenefitProps) => {
  return (
    <Card className={`border-none shadow-none bg-transparent animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300 ring-1 ring-rose-500/20 shadow-[0_0_15px_-5px_rgba(225,29,72,0.1)]">
          <Icon className={`w-6 h-6 ${iconClassName || 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
        </div>
        <h3 className={`font-semibold text-lg mb-3 ${titleClassName || 'text-rose-50'}`}>{title}</h3>
        <p className="text-rose-100/70 text-sm leading-relaxed font-medium">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export const ValentinesBenefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Diseños Románticos",
      description: "Colección exclusiva pensada para expresar amor verdadero con detalles únicos en 3D.",
      iconClassName: "text-rose-400 fill-rose-400/20 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]", // Warm Pink + Glow
      titleClassName: "text-rose-50"
    },
    {
      icon: Gift,
      title: "Empaque Especial",
      description: "Todos los pedidos de San Valentín incluyen un empaque temático listo para regalar.",
      iconClassName: "text-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]", // Elegant Wine + Glow
      titleClassName: "text-rose-50"
    },
    {
      icon: Zap,
      title: "Personalización Express",
      description: "Añade nombres o fechas especiales. Priorizamos tu pedido para que llegue a tiempo.",
      iconClassName: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]", // Intense Red + Glow
      titleClassName: "text-rose-50"
    },
    {
      icon: Truck,
      title: "Envíos Seguros",
      description: "Garantizamos la entrega antes del 14 de Febrero para pedidos confirmados a tiempo.",
      iconClassName: "text-rose-400/90 drop-shadow-[0_0_6px_rgba(251,113,133,0.3)]", // Muted Red + Soft Glow
      titleClassName: "text-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((benefit, idx) => (
        <BenefitCard 
          key={idx}
          {...benefit}
          delay={idx * 100}
        />
      ))}
    </div>
  );
};

export const HalloweenBenefits = () => {
  const benefits = [
    {
      icon: Ghost,
      title: "Diseños de Terror",
      description: "Máscaras, props y decoraciones espeluznantes para tu mejor fiesta de Halloween.",
      iconClassName: "text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]",
      titleClassName: "text-orange-50"
    },
    {
      icon: Skull,
      title: "Accesorios Cosplay",
      description: "Completa tu disfraz con detalles únicos impresos en 3D de alta calidad y resistencia.",
      iconClassName: "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
      titleClassName: "text-orange-50"
    },
    {
      icon: Moon,
      title: "Ambiente Nocturno",
      description: "Litofanías y lámparas temáticas para crear la atmósfera perfecta en tu hogar.",
      iconClassName: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]",
      titleClassName: "text-orange-50"
    },
    {
      icon: Zap,
      title: "Envío Flash",
      description: "No dejes tu disfraz para el final. Envíos rápidos para salvar tu noche de brujas.",
      iconClassName: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
      titleClassName: "text-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((benefit, idx) => (
        <BenefitCard 
          key={idx}
          {...benefit}
          delay={idx * 100}
        />
      ))}
    </div>
  );
};

export const MothersDayBenefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Amor de Mamá",
      description: "Diseños pensados para agradecer y celebrar el amor incondicional de mamá.",
      iconClassName: "text-pink-400 fill-pink-400/20 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]",
      titleClassName: "text-rose-50"
    },
    {
      icon: Gift,
      title: "Empaque Especial",
      description: "Cada regalo para mamá llega con un empaque hermoso, listo para sorprenderla.",
      iconClassName: "text-pink-600 drop-shadow-[0_0_8px_rgba(219,39,119,0.4)]",
      titleClassName: "text-rose-50"
    },
    {
      icon: Zap,
      title: "Personalización Única",
      description: "Graba su nombre o una frase especial. Hacemos que su regalo sea irrepetible.",
      iconClassName: "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]",
      titleClassName: "text-rose-50"
    },
    {
      icon: Truck,
      title: "Entrega Garantizada",
      description: "Nos aseguramos de que su regalo llegue a tiempo para celebrar su día especial.",
      iconClassName: "text-pink-400/90 drop-shadow-[0_0_6px_rgba(244,114,182,0.3)]",
      titleClassName: "text-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((benefit, idx) => (
        <BenefitCard 
          key={idx}
          {...benefit}
          delay={idx * 100}
        />
      ))}
    </div>
  );
};
