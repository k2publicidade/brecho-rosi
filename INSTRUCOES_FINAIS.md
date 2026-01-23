# Instruções Finais para o Brechó Jardim Mariléia

## ✅ O QUE JÁ FOI FEITO:
- [x] **Deploy das Funções no Supabase:** Funções de pagamento e webhook ativas.
- [x] **Configuração de Segredos no Supabase:** Chaves conectadas.
- [x] **Configuração do Código:** GitHub Actions configurado para a branch `final`.

---

## ⚠️ ÚNICA AÇÃO NECESSÁRIA AGORA:
**Configurar os Segredos no GitHub da K2 Publicidade.**

Como o repositório está na conta do seu irmão (`k2publicidade/brecho-rosi`), você **DEVE** fazer login na conta dele (ou usar a sua se tiver acesso de admin ao repo) para adicionar as chaves.

### Passo a Passo Rápido:
1. Acesse este link direto:
   👉 **[https://github.com/k2publicidade/brecho-rosi/settings/secrets/actions](https://github.com/k2publicidade/brecho-rosi/settings/secrets/actions)**

2. Clique em **New repository secret** e adicione as chaves abaixo (uma por uma):

| Nome (Name) | Valor (Secret) |
|------|-------|
| `FTP_SERVER` | `deepskyblue-mouse-182209.hostingersite.com` |
| `FTP_USERNAME` | `u673756708` |
| `FTP_PASSWORD` | `Mudar123!` |
| `VITE_GEMINI_API_KEY` | (Sua chave Gemini que começa com AIza...) |
| `VITE_SUPABASE_URL` | `https://eamvslpmecbqffrdhsrs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (Sua chave pública do Supabase) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | (Sua chave pública do Stripe que começa com pk_live...) |
| `VITE_ADMIN_EMAILS` | `lipexedits@gmail.com,k2publicidade@gmail.com` |

---

## 🚀 Como fazer o Deploy (Publicar o Site)
O sistema já está configurado para ler a branch `final`.

1. **Codar:** Trabalhe na branch `dev` normalmente.
2. **Publicar:** Quando quiser colocar o site no ar, faça o merge da `dev` para a `final` e dê o push.
   - O GitHub vai detectar a mudança na `final` e subir tudo para a Hostinger sozinho.

**Pronto! É só isso.** Não precisa configurar mais nada manual.