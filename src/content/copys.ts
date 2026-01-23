/**
 * Copys do Brechó da Rosi
 * Arquivo centralizado com todas as mensagens e textos do site
 */

export const BRAND = {
  name: 'Rosi Design Ateliêr',
  tagline: 'Curadoria afetiva com envios para todo o Brasil',
  location: 'Jardim Mariléia • Rio das Ostras - RJ',
  owner: 'Rosi',
};

export const HERO = {
  title: 'Bem-vinda ao Rosi Design Ateliêr',
  subtitle: 'Aquele achadinho que você ama, do bairro para todo o Brasil.',
  description: 'Curadoria feita com carinho pela Rosi, com retirada local no Jardim Mariléia e entregas com rastreio para todo o Brasil.',
  cta: 'Ver Achadinhos',
  badge: 'Do Bairro Para o Brasil',
};

export const ABOUT = {
  title: 'A história por trás do garimpo',
  description: `Sou a Rosi, apaixonada por moda e garimpo há anos.
Criei o Rosi Design Ateliêr para compartilhar peças especiais com quem ama estilo, onde quer que esteja.

Aqui você não vai encontrar qualquer coisa.
Cada peça passa pela minha curadoria afetiva:
- Qualidade garantida
- Preço justo
- Estilo atemporal

Para quem é do bairro, a retirada é local.
Para quem é de longe, envio com rastreio para todo o Brasil.`,
  shortDescription: 'Sou a Rosi, apaixonada por moda e garimpo há anos. Criei o Rosi Design Ateliêr para compartilhar peças especiais com quem ama estilo, com retirada local e envio para todo o Brasil. Cada achadinho passa pela minha curadoria afetiva, garantindo qualidade, preço justo e estilo atemporal.',
};

export const SECTIONS = {
  newArrivals: {
    title: 'Chegou no Ateliêr',
    subtitle: 'As novidades que acabaram de entrar na arara.',
  },
  philosophy: {
    title: 'Histórias que vestem bem',
    description: 'Acreditamos na força da nossa comunidade e no alcance da moda circular pelo Brasil. Cada peça é garimpada pensando em você, unindo sustentabilidade, economia e aquele estilo único que só a gente tem.',
  },
};

export const SOCIAL = {
  instagram: {
    bio: `🌿 Rosi Design Ateliêr
Garimpo + Curadoria afetiva
Moda circular com muito estilo
📍 Retirada local + envios Brasil
👇 Achadinhos novos toda semana`,

    launchPost: `Gente, finalmente! 🎉

Depois de anos garimpando as melhores peças,
o Rosi Design Ateliêr agora está online!

💚 Curadoria afetiva (só o que é bom entra)
📍 Retirada no Jardim Mariléia
🌱 Moda circular e consciente
💰 Preços que cabem no bolso

E o melhor: você pode retirar pertinho de casa
ou receber em qualquer lugar do Brasil com rastreio.

Dá uma olhada nos achadinhos que chegaram! 👇

#RosiDesignAtelier #ModaCircular #Achadinhos
#ModaSustentavel #BrechoOnline`,
  },
};

export const PRODUCT_TEMPLATES = {
  basics: (productName: string, size: string, condition: string) => `
Aquele básico que não pode faltar no guarda-roupa.
Peça atemporal, versátil e em ótimo estado.

Tamanho: ${size}
Condição: ${condition}
  `.trim(),

  accessories: (productName: string, details: string) => `
Achado especial!
Esse ${productName} é perfeito para dar aquele UP no look.

Detalhes: ${details}
Estado: Garimpado e aprovado pela Rosi ✓
  `.trim(),

  special: (productName: string, description: string) => `
${description}

Peça única com a curadoria afetiva da Rosi.
Quando você encontra um achadinho desses, é pra levar! 💚
  `.trim(),
};

export const WHATSAPP = {
  welcome: `Oi! Aqui é a Rosi do ateliêr! 👋

Bem-vinda ao Rosi Design Ateliêr!
Como posso te ajudar hoje?

💚 Ver peças disponíveis
📍 Saber como retirar/receber
💬 Tirar dúvidas sobre alguma peça`,

  orderConfirmation: (customerName: string, orderDetails: string) => `
Uhuul! Pedido confirmado! 🎉

${customerName}, seu achadinho já está reservado!

📦 Resumo do pedido:
${orderDetails}

Próximos passos:
[instruções de pagamento/retirada]

Obrigada por comprar no Rosi Design Ateliêr! 💚
  `.trim(),
};

export const VALUES = {
  curadoriaAfetiva: {
    title: 'Curadoria Afetiva',
    description: 'Cada peça é escolhida pensando em alguém',
  },
  comunidadeLocal: {
    title: 'Comunidade Local',
    description: 'Clientes se ajudam, economia circular',
  },
  sustentabilidade: {
    title: 'Sustentabilidade',
    description: 'Moda circular, menos desperdício',
  },
  acessibilidade: {
    title: 'Acessibilidade',
    description: 'Preços justos, democrático',
  },
};

export const SEO = {
  title: 'Rosi Design Ateliêr | Curadoria afetiva com envio para todo o Brasil',
  description: 'Rosi Design Ateliêr: peças garimpadas com carinho pela Rosi, com retirada local no Jardim Mariléia e envios com rastreio para todo o Brasil. Moda circular, atendimento próximo e preços justos.',
  keywords: ['brechó', 'moda circular', 'rosi design', 'achadinhos', 'moda sustentável', 'brechó online', 'envio para todo o brasil'],
};
