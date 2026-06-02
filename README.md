# studio

Site pessoal de **Bruno Pulis** ([@brunopulis](https://github.com/brunopulis)) — portfólio de consultoria em acessibilidade digital.

## Stack

- **Static site generator**: [Eleventy](https://www.11ty.dev/) v3 com templates Nunjucks (`.njk`)
- **CSS**: [Tailwind CSS v4](https://tailwindcss.com/) via CLI
- **Deploy**: [Vercel](https://vercel.com)

## Scripts

| Comando | Descrição |
|---|---|
| `npm start` | Servidor de desenvolvimento (Tailwind watch + Eleventy serve) |
| `npm run build` | Build de produção (Tailwind minificado + Eleventy) |
| `npm run build:css` | Build do CSS com Tailwind |
| `npm run clean` | Remove `_site/` e CSS gerado |

## Estrutura

```
src/
  _data/          — dados globais do site
  _includes/      — partials Nunjucks reutilizáveis
  assets/css/     — estilos Tailwind
  public/         — diretório pass-through
  *.njk           — páginas do site
```

## Licença

MIT © Bruno Pulis
