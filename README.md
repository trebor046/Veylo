# Veylo - Conversor de arquivos por link

Veylo é um conversor simples, intuitivo e rápido para baixar vídeos e áudios a partir de links, com suporte a diversos formatos. Focado em praticidade: cole o link, escolha o formato e baixe.

## Tecnologias

- [Next.js 15](https://nextjs.org/) - Framework fullstack
- [TypeScript](https://www.typescriptlang.org/) - Tipagem
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Supabase](https://supabase.com/) - Banco de dados e autenticação (preparado)
- [Vercel](https://vercel.com/) - Hospedagem

## Funcionalidades

- Cole um link e veja os formatos disponíveis
- Foco inicial em MP4, mas suporta vários formatos (MP3, WEBM, M4A, entre outros)
- Interface limpa e intuitiva
- Pronto para deploy na Vercel
- Estrutura preparada para integração com Supabase

## Como rodar localmente

1. Clone o repositório

```bash
git clone https://github.com/trebor046/Veylo.git
cd Veylo/veylo
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais do Supabase.

```bash
cp .env.example .env.local
```

4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy

O projeto está pronto para ser hospedado na [Vercel](https://vercel.com/). Basta importar o repositório e configurar as variáveis de ambiente.

## Licença

MIT
