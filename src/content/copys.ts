/**
 * Copys do Brechó da Rosi
 * Arquivo centralizado com todas as mensagens e textos do site
 */

export const BRAND = {
  name: 'Brechó da Rosi',
  tagline: 'Moda com afeto no Jardim Mariléia',
  location: 'Jardim Mariléia',
  owner: 'Rosi',
};

export const HERO = {
  title: 'Bem-vinda ao Brechó da Rosi',
  subtitle: 'Aquele achadinho que você ama está aqui, pertinho de você.',
  description: 'Curadoria feita com carinho pela Rosi para as vizinhas mais estilosas do Jardim Mariléia.',
  cta: 'Ver Achadinhos',
  badge: 'Do Bairro Para o Bairro',
};

export const ABOUT = {
  title: 'A história por trás do garimpo',
  description: `Sou a Rosi, apaixonada por moda e garimpo há anos.
Criei este brechó para compartilhar com as vizinhas do Jardim Mariléia peças especiais que encontro.

Aqui você não vai encontrar qualquer coisa.
Cada peça passa pela minha curadoria afetiva:
- Qualidade garantida
- Preço justo
- Estilo atemporal

Porque moda boa não precisa ser cara.
E sustentabilidade é sobre escolhas conscientes.`,
  shortDescription: 'Sou a Rosi, apaixonada por moda e garimpo há anos. Criei este brechó para compartilhar com as vizinhas do Jardim Mariléia peças especiais que encontro. Cada achadinho passa pela minha curadoria afetiva, garantindo qualidade, preço justo e estilo atemporal.',
};

export const SECTIONS = {
  newArrivals: {
    title: 'Chegou no Bairro',
    subtitle: 'As novidades que acabaram de entrar na arara.',
  },
  philosophy: {
    title: 'Histórias que vestem bem',
    description: 'Acreditamos na força da nossa comunidade aqui no Jardim Mariléia. Cada peça é garimpada pensando em você, unindo sustentabilidade, economia e aquele estilo único que só a gente tem.',
  },
};

export const SOCIAL = {
  instagram: {
    bio: `🌿 Brechó da Rosi | Jardim Mariléia
Garimpo + Curadoria afetiva
Moda circular com muito estilo
📍 Retirada local ou entrega
👇 Achadinhos novos toda semana`,

    launchPost: `Gente, finalmente! 🎉

Depois de anos garimpando as melhores peças,
o Brechó da Rosi agora está online!

💚 Curadoria afetiva (só o que é bom entra)
📍 Aqui no Jardim Mariléia
🌱 Moda circular e consciente
💰 Preços que cabem no bolso

E o melhor: você pode retirar pertinho de casa
ou receber em casa com entrega.

Dá uma olhada nos achadinhos que chegaram! 👇

#BrechoDaRosi #JardimMarileia #ModaCircular
#BrechodeBairro #AchadinhosDaRosi`,
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
  welcome: `Oi! Aqui é a Rosi do brechó! 👋

Bem-vinda ao Brechó da Rosi!
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

Obrigada por comprar no Brechó da Rosi! 💚
  `.trim(),
};

export const VALUES = {
  curadoriaAfetiva: {
    title: 'Curadoria Afetiva',
    description: 'Cada peça é escolhida pensando em alguém',
  },
  comunidadeLocal: {
    title: 'Comunidade Local',
    description: 'Vizinhas se ajudam, economia no bairro',
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
  title: 'Brechó da Rosi | Moda com afeto no Jardim Mariléia',
  description: 'Brechó de bairro com curadoria afetiva no Jardim Mariléia. Peças garimpadas com carinho pela Rosi para as vizinhas mais estilosas. Moda circular, atendimento próximo e preços justos.',
  keywords: ['brechó', 'jardim mariléia', 'moda circular', 'brechó de bairro', 'rosi', 'achadinhos', 'moda sustentável', 'brechó online'],
};
